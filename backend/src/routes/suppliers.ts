import { Router } from "express";
import {
  createSupplier,
  validateCreateSupplierInput,
} from "../services/supplierService.js";
import type { CreateSupplierPayload } from "../types.js";

export const supplierRouter = Router();

supplierRouter.get("/", (_req, res) => {
  res.success([]);
});

supplierRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body as CreateSupplierPayload;
    const input = validateCreateSupplierInput(body);
    const supplier = await createSupplier(input, req.currentUser);
    res.success(supplier, "Supplier created", 201);
  } catch (err) {
    next(err);
  }
});
