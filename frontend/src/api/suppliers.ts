/**
 * Supplier API client — separated from UI so screens never call fetch directly.
 */

import type { CreateSupplierInput, Supplier } from "../types";
import { apiRequest } from "./client";

export function listSuppliers(userId: string): Promise<Supplier[]> {
  return apiRequest<Supplier[]>(userId, "/api/suppliers");
}

export function getSupplierById(userId: string, id: string): Promise<Supplier> {
  return apiRequest<Supplier>(userId, `/api/suppliers/${id}`);
}

export function createSupplier(
  userId: string,
  input: CreateSupplierInput,
): Promise<Supplier> {
  return apiRequest<Supplier>(userId, "/api/suppliers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function approveSupplier(userId: string, id: string): Promise<Supplier> {
  return apiRequest<Supplier>(userId, `/api/suppliers/${id}/approve`, {
    method: "POST",
  });
}

export function rejectSupplier(
  userId: string,
  id: string,
  reason: string,
): Promise<Supplier> {
  return apiRequest<Supplier>(userId, `/api/suppliers/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
