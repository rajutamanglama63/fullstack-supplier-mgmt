import { AppError } from "../errors.js";
import { prisma } from "../db.js";
import { Prisma } from "../generated/prisma/client.js";
import {
  ErrorCode,
  SupplierField,
  SupplierStatus,
  UserRole,
  type CreateSupplierInput,
  type CreateSupplierPayload,
  type RejectSupplierPayload,
  type Supplier,
  type SupplierRecord,
  type User,
} from "../types.js";

// Matches a simple email: text @ text . text (no spaces). Not a full RFC check.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredString(value: string | undefined, field: string): string {
  if (typeof value !== "string") {
    throw new AppError(ErrorCode.VALIDATION_ERROR, `${field} is required.`, 400);
  }

  // Strip leading/trailing spaces so "  Alpha AG  " is stored as "Alpha AG".
  // A value of only spaces ("   ") is treated as empty — same as a missing field.
  const trimmed = value.trim();

  if (!trimmed) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, `${field} is required.`, 400);
  }

  return trimmed;
}

export function validateCreateSupplierInput(
  body: CreateSupplierPayload,
): CreateSupplierInput {
  const companyName = requiredString(body.companyName, SupplierField.companyName);
  const vatId = requiredString(body.vatId, SupplierField.vatId);
  const country = requiredString(body.country, SupplierField.country);
  const contactEmail = requiredString(body.contactEmail, SupplierField.contactEmail);

  if (!EMAIL_PATTERN.test(contactEmail)) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `${SupplierField.contactEmail} must be a valid email address.`,
      400,
    );
  }

  return { companyName, vatId, country, contactEmail };
}

function toSupplier(row: SupplierRecord): Supplier {
  return {
    id: row.id,
    companyName: row.companyName,
    vatId: row.vatId,
    country: row.country,
    contactEmail: row.contactEmail,
    status: row.status,
    createdBy: row.createdBy,
    createdAt: row.createdAt.toISOString(),
    approvedBy: row.approvedBy ?? undefined,
    rejectedBy: row.rejectedBy ?? undefined,
    rejectionReason: row.rejectionReason ?? undefined,
  };
}

export async function createSupplier(
  input: CreateSupplierInput,
  currentUser: User,
): Promise<Supplier> {
  const existing = await prisma.supplier.findUnique({
    where: { vatId: input.vatId },
  });

  if (existing) {
    throw new AppError(
      ErrorCode.VAT_ID_ALREADY_EXISTS,
      `A supplier with VAT ID ${input.vatId} already exists.`,
      409,
    );
  }

  try {
    const created: SupplierRecord = await prisma.supplier.create({
      data: {
        companyName: input.companyName,
        vatId: input.vatId,
        country: input.country,
        contactEmail: input.contactEmail,
        // Client may send DRAFT; after validation we persist as pending approval.
        status: SupplierStatus.PENDING_APPROVAL,
        createdBy: currentUser.id,
      },
    });

    return toSupplier(created);
  } catch (err) {
    // P2002 = unique constraint failed (VAT ID). Covers a race if two creates slip past findUnique.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new AppError(
        ErrorCode.VAT_ID_ALREADY_EXISTS,
        `A supplier with VAT ID ${input.vatId} already exists.`,
        409,
      );
    }

    throw err;
  }
}

// Load one supplier by id from the DB. Throws 404 if it does not exist.
async function getSupplierRecord(id: string): Promise<SupplierRecord> {
  const supplier = await prisma.supplier.findUnique({ where: { id } });

  if (!supplier) {
    throw new AppError(ErrorCode.SUPPLIER_NOT_FOUND, `Supplier ${id} was not found.`, 404);
  }

  return supplier;
}

// Approve/reject is allowed only if: user is an approver, status is pending, and they are not the creator.
function assertCanReview(supplier: SupplierRecord, currentUser: User): void {
  if (currentUser.role !== UserRole.approver) {
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      "Only an approver can approve or reject a supplier.",
      403,
    );
  }

  if (supplier.status !== SupplierStatus.PENDING_APPROVAL) {
    throw new AppError(
      ErrorCode.INVALID_STATUS_TRANSITION,
      `Supplier ${supplier.id} is ${supplier.status} and cannot be reviewed.`,
      409,
    );
  }

  if (supplier.createdBy === currentUser.id) {
    throw new AppError(
      ErrorCode.SELF_APPROVAL_NOT_ALLOWED,
      "The creator of a supplier cannot approve or reject the same supplier.",
      409,
    );
  }
}

export async function listSuppliers(): Promise<Supplier[]> {
  const rows = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Prisma returns SupplierRecord[]: createdAt is a Date, optional fields are null.
  // The API expects Supplier[]: createdAt as an ISO string, optional fields as undefined.
  // map runs toSupplier on each row (same as looping and pushing the converted object).
  return rows.map(toSupplier);
}

export async function getSupplierById(id: string): Promise<Supplier> {
  const supplier = await getSupplierRecord(id);
  return toSupplier(supplier);
}

export async function approveSupplier(id: string, currentUser: User): Promise<Supplier> {
  const supplier = await getSupplierRecord(id);
  assertCanReview(supplier, currentUser);

  const updated: SupplierRecord = await prisma.supplier.update({
    where: { id },
    data: {
      status: SupplierStatus.APPROVED,
      approvedBy: currentUser.id,
      rejectedBy: null,
      rejectionReason: null,
    },
  });

  return toSupplier(updated);
}

export function validateRejectReason(body: RejectSupplierPayload): string {
  return requiredString(body.reason, SupplierField.rejectionReason);
}

export async function rejectSupplier(
  id: string,
  reason: string,
  currentUser: User,
): Promise<Supplier> {
  const supplier = await getSupplierRecord(id);
  assertCanReview(supplier, currentUser);

  const updated: SupplierRecord = await prisma.supplier.update({
    where: { id },
    data: {
      status: SupplierStatus.REJECTED,
      rejectedBy: currentUser.id,
      rejectionReason: reason,
      approvedBy: null,
    },
  });

  return toSupplier(updated);
}
