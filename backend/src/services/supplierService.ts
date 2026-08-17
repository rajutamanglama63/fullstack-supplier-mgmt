import { AppError } from "../errors.js";
import { prisma } from "../db.js";
import { Prisma } from "../generated/prisma/client.js";
import {
  ErrorCode,
  SupplierField,
  SupplierStatus,
  type CreateSupplierInput,
  type CreateSupplierPayload,
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
