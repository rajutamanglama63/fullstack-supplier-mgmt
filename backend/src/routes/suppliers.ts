import { Router } from "express";

export const supplierRouter = Router();

supplierRouter.get("/", (_req, res) => {
  res.success([]);
});
