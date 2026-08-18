import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  approveSupplier,
  createSupplier,
  rejectSupplier,
} from "../api/suppliers";
import { useUser } from "../context/UserContext";
import { removeDraft } from "../storage/drafts";
import type { Supplier } from "../types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400";

export function SupplierActions({
  supplier,
  onSupplierChange,
}: {
  supplier: Supplier;
  onSupplierChange?: (supplier: Supplier) => void;
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isRequester = user.role === "requester";
  const isApprover = user.role === "approver";

  async function handleRequest() {
    setError(null);
    setSaving(true);

    try {
      await createSupplier(user.id, {
        companyName: supplier.companyName,
        vatId: supplier.vatId,
        country: supplier.country,
        contactEmail: supplier.contactEmail,
      });
      removeDraft(supplier.id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send request.");
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove() {
    setError(null);
    setSaving(true);

    try {
      const updated = await approveSupplier(user.id, supplier.id);
      onSupplierChange?.(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not approve supplier.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const reason = String(new FormData(event.currentTarget).get("reason") ?? "").trim();
    if (!reason) return;
    setSaving(true);

    try {
      const updated = await rejectSupplier(user.id, supplier.id, reason);
      onSupplierChange?.(updated);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reject supplier.");
    } finally {
      setSaving(false);
    }
  }

  if (supplier.status === "DRAFT" && isRequester) {
    return (
      <div className="space-y-3">
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={() => void handleRequest()}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          Request
        </button>
      </div>
    );
  }

  if (supplier.status === "PENDING_APPROVAL" && isApprover) {
    return (
      <form onSubmit={handleReject} className="space-y-3">
        {error && <p className="text-sm text-red-700">{error}</p>}
        <label className="block text-sm font-medium text-zinc-700">
          Rejection reason
          <textarea className={fieldClass} name="reason" rows={3} required />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleApprove()}
            disabled={saving}
            className="rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            Approve
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      </form>
    );
  }

  return null;
}
