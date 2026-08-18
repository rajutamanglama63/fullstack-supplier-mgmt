/**
 * Local drafts for supplier create. These are not stored in the database until
 * the requester clicks Request.
 */

import type { CreateSupplierInput, Supplier } from "../types";

const STORAGE_KEY = "supplier-mgmt-drafts";

/** Load every draft from localStorage, or [] if nothing is saved. */
function readDrafts(): Supplier[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Supplier[];
  } catch {
    return [];
  }
}

/** Overwrite localStorage with the given draft list. */
function writeDrafts(drafts: Supplier[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

/** Drafts created by this user (Anna's drafts stay hidden from Max). */
export function listDrafts(userId: string): Supplier[] {
  return readDrafts().filter((draft) => draft.createdBy === userId);
}

/** Find one draft by id, or undefined if it is not in localStorage. */
export function getDraftById(id: string): Supplier | undefined {
  return readDrafts().find((draft) => draft.id === id);
}

/** Add a new DRAFT supplier for this user and persist it. */
export function saveDraft(userId: string, input: CreateSupplierInput): Supplier {
  const draft: Supplier = {
    id: crypto.randomUUID(),
    companyName: input.companyName,
    vatId: input.vatId,
    country: input.country,
    contactEmail: input.contactEmail,
    status: "DRAFT",
    createdBy: userId,
    createdAt: new Date().toISOString(),
  };

  writeDrafts([draft, ...readDrafts()]);
  return draft;
}

/** Delete a draft after it has been requested (saved in the database). */
export function removeDraft(id: string): void {
  writeDrafts(readDrafts().filter((draft) => draft.id !== id));
}
