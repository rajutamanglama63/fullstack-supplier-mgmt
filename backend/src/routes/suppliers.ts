import { Router } from "express";
import {
  approveSupplier,
  createSupplier,
  getSupplierById,
  listSuppliers,
  rejectSupplier,
  validateCreateSupplierInput,
  validateRejectReason,
} from "../services/supplierService.js";
import type { CreateSupplierPayload, RejectSupplierPayload } from "../types.js";

export const supplierRouter = Router();

// GET /api/suppliers — return all suppliers (newest first). Empty list is still success.
// On success: { success: true, message, data: suppliers } (empty list is still success).
// If listSuppliers rejects (e.g. DB failure), next(err) goes to errorHandler.
// That logs the real error and returns { success: false, message: generic } — 500 unless AppError.
supplierRouter.get("/", async (_req, res, next) => {
  try {
    const suppliers = await listSuppliers();
    res.success(suppliers);
  } catch (err) {
    next(err);
  }
});

// POST /api/suppliers — validate body, persist a pending supplier as the current user.
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

// POST /api/suppliers/:id/approve — approver (not the creator) marks a pending supplier approved.
supplierRouter.post("/:id/approve", async (req, res, next) => {
  try {
    const supplier = await approveSupplier(req.params.id, req.currentUser);
    res.success(supplier, "Supplier approved");
  } catch (err) {
    next(err);
  }
});

// POST /api/suppliers/:id/reject — same review rules; body.reason is required.
supplierRouter.post("/:id/reject", async (req, res, next) => {
  try {
    const body = req.body as RejectSupplierPayload;
    const reason = validateRejectReason(body);
    const supplier = await rejectSupplier(req.params.id, reason, req.currentUser);
    res.success(supplier, "Supplier rejected");
  } catch (err) {
    next(err);
  }
});

// GET /api/suppliers/:id — return one supplier, or 404 if it does not exist.
supplierRouter.get("/:id", async (req, res, next) => {
  try {
    const supplier = await getSupplierById(req.params.id);
    res.success(supplier);
  } catch (err) {
    next(err);
  }
});
