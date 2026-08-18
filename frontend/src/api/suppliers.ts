/**
 * Supplier API client — separated from UI so screens never call fetch directly.
 */

import type { Supplier } from "../types";
import { apiRequest } from "./client";

export function listSuppliers(userId: string): Promise<Supplier[]> {
  return apiRequest<Supplier[]>(userId, "/api/suppliers");
}

export function getSupplierById(userId: string, id: string): Promise<Supplier> {
  return apiRequest<Supplier>(userId, `/api/suppliers/${id}`);
}
