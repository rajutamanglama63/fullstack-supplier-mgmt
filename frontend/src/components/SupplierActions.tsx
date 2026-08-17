import { type FormEvent } from "react";
import { useUser } from "../context/UserContext";
import type { Supplier } from "../types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400";

export function SupplierActions({ supplier }: { supplier: Supplier }) {
  const { user } = useUser();
  const isRequester = user.role === "requester";
  const isApprover = user.role === "approver";

  function handleRequest() {
    console.log({ action: "request", id: supplier.id });
  }

  function handleApprove() {
    console.log({ action: "approve", id: supplier.id });
  }

  function handleReject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reason = String(new FormData(event.currentTarget).get("reason") ?? "").trim();
    if (!reason) return;
    console.log({ action: "reject", id: supplier.id, reason });
  }

  if (supplier.status === "DRAFT" && isRequester) {
    return (
      <button
        type="button"
        onClick={handleRequest}
        className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Request
      </button>
    );
  }

  if (supplier.status === "PENDING_APPROVAL" && isApprover) {
    return (
      <form onSubmit={handleReject} className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700">
          Rejection reason
          <textarea className={fieldClass} name="reason" rows={3} required />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleApprove}
            className="rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            Approve
          </button>
          <button
            type="submit"
            className="rounded-lg bg-red-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Reject
          </button>
        </div>
      </form>
    );
  }

  return null;
}
