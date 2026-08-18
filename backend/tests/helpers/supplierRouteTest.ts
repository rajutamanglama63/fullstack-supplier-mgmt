import { jest } from "@jest/globals";
import type {
  approveSupplier,
  createSupplier,
  getSupplierById,
  listSuppliers,
  rejectSupplier,
  validateCreateSupplierInput,
  validateRejectReason,
} from "../../src/services/supplierService.js";
import type { Supplier } from "../../src/types.js";

export const serviceMocks = {
  listSuppliers: jest.fn<typeof listSuppliers>(),
  getSupplierById: jest.fn<typeof getSupplierById>(),
  createSupplier: jest.fn<typeof createSupplier>(),
  approveSupplier: jest.fn<typeof approveSupplier>(),
  rejectSupplier: jest.fn<typeof rejectSupplier>(),
  validateCreateSupplierInput: jest.fn<typeof validateCreateSupplierInput>(),
  validateRejectReason: jest.fn<typeof validateRejectReason>(),
};

export const pendingSupplier: Supplier = {
  id: "sup-1",
  companyName: "Alpha GmbH",
  vatId: "DE123",
  country: "Germany",
  contactEmail: "ops@alpha.test",
  status: "PENDING_APPROVAL",
  createdBy: "anna",
  createdAt: "2026-08-18T00:00:00.000Z",
};

jest.unstable_mockModule("../../src/services/supplierService.js", () => serviceMocks);

const { createApp } = await import("../../src/app.js");

export const app = createApp();
