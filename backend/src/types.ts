export const SupplierStatus = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type SupplierStatus = (typeof SupplierStatus)[keyof typeof SupplierStatus];

export type UserRole = "requester" | "approver";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Supplier {
  id: string;
  companyName: string;
  vatId: string;
  country: string;
  contactEmail: string;
  status: SupplierStatus;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

/** Database row from Prisma: Date for timestamps, null for optional fields. */
export type { Supplier as SupplierRecord } from "./generated/prisma/client.js";

export interface CreateSupplierInput {
  companyName: string;
  vatId: string;
  country: string;
  contactEmail: string;
}

/** Incoming create-supplier body. Fields may be missing until validated. */
export type CreateSupplierPayload = Partial<CreateSupplierInput>;

export const SupplierField = {
  companyName: "Company name",
  vatId: "VAT ID",
  country: "Country",
  contactEmail: "Contact email",
} as const;

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SUPPLIER_NOT_FOUND: "SUPPLIER_NOT_FOUND",
  VAT_ID_ALREADY_EXISTS: "VAT_ID_ALREADY_EXISTS",
  INVALID_STATUS_TRANSITION: "INVALID_STATUS_TRANSITION",
  SELF_APPROVAL_NOT_ALLOWED: "SELF_APPROVAL_NOT_ALLOWED",
  REJECTION_REASON_REQUIRED: "REJECTION_REASON_REQUIRED",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
