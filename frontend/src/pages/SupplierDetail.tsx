/**
 * Supplier detail and workflow actions.
 * Submit / approve / reject shown only when valid for the active user and status.
 */

import { Link, useParams } from "react-router-dom";
import { SupplierActions } from "../components/SupplierActions";
import { StatusBadge } from "../components/StatusBadge";
import { APP_USERS } from "../context/UserContext";
import { DUMMY_SUPPLIERS } from "../data/dummySuppliers";

function userName(userId: string): string {
  for (const user of APP_USERS) {
    if (user.id === userId) {
      return user.name;
    }
  }
  return userId;
}

export function SupplierDetail() {
  const { id } = useParams();
  const supplier = DUMMY_SUPPLIERS.find((item) => item.id === id);

  if (!supplier) {
    return (
      <section>
        <h1 className="text-xl font-semibold">Supplier not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-zinc-500 no-underline hover:text-zinc-800">
          Back to suppliers
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">{supplier.companyName}</h1>
        <StatusBadge status={supplier.status} />
      </div>

      <div className="space-y-6 rounded-xl border border-black/10 bg-white p-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">VAT ID</dt>
            <dd className="mt-1 text-sm text-zinc-900">{supplier.vatId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Country</dt>
            <dd className="mt-1 text-sm text-zinc-900">{supplier.country}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Contact email</dt>
            <dd className="mt-1 text-sm text-zinc-900">{supplier.contactEmail}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Creator</dt>
            <dd className="mt-1 text-sm text-zinc-900">{userName(supplier.createdBy)}</dd>
          </div>
          {supplier.approvedBy && (
            <div>
              <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Approved by</dt>
              <dd className="mt-1 text-sm text-zinc-900">{userName(supplier.approvedBy)}</dd>
            </div>
          )}
          {supplier.rejectedBy && (
            <div>
              <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Rejected by</dt>
              <dd className="mt-1 text-sm text-zinc-900">{userName(supplier.rejectedBy)}</dd>
            </div>
          )}
          {supplier.rejectionReason && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                Rejection reason
              </dt>
              <dd className="mt-1 text-sm text-zinc-900">{supplier.rejectionReason}</dd>
            </div>
          )}
        </dl>

        <SupplierActions supplier={supplier} />
      </div>

      <Link to="/" className="mt-4 inline-block text-sm text-zinc-500 no-underline hover:text-zinc-800">
        Back to suppliers
      </Link>
    </section>
  );
}
