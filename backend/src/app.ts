import cors from "cors";
import express from "express";
import morgan from "morgan";
import { corsConfig } from "./config/corsConfig.js";
import { currentUser } from "./middleware/currentUser.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { responseHandler } from "./middleware/responseHandler.js";
import { supplierRouter } from "./routes/suppliers.js";

export function createApp() {
  const app = express();

  // Allows the frontend origin to call this API from the browser (dev vs prod).
  app.use(cors(corsConfig));
  app.use(express.json());
  // Logs each HTTP request (method, URL, status, time) to the terminal during development.
  app.use(morgan("dev"));
  // Adds res.success() and res.fail() so every route returns the same JSON shape.
  app.use(responseHandler);

  app.use("/api", currentUser);
  app.use("/api/suppliers", supplierRouter);

  // Unmatched routes: generic 404. Must stay after real routes or they would never run.
  app.use((_req, res) => {
    res.fail(404);
  });

  // Thrown/passed errors: log details server-side, send a generic message to the client.
  app.use(errorHandler);

  return app;
}
