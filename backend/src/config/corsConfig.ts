import type { CorsOptions } from "cors";

const isProd = process.env.NODE_ENV === "production";

const origin = isProd
  ? (process.env.CORS_ORIGIN_PROD ?? "https://production-frontend.example")
  : (process.env.CORS_ORIGIN_DEV ?? "http://localhost:5173");

export const corsConfig: CorsOptions = {
  origin,
  allowedHeaders: "*",
};
