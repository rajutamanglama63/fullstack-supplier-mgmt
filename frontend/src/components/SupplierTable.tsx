import { useNavigate } from "react-router-dom";
import { APP_USERS } from "../context/UserContext";
import type { Supplier } from "../types";
import { StatusBadge } from "./StatusBadge";

function creatorName(userId: string): string {
  return APP_USERS.find((user) => user.id === userId)?.name ?? userId;
}

export function SupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  const navigate = useNavigate();

  if (suppliers.length === 0) {
    return (
      <p className="rounded-xl border border-black/10 bg-white px-4 py-8 text-center text-sm text-zinc-500">
        No suppliers yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-black/10 bg-stone-50 text-xs font-medium tracking-wide text-zinc-500 uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">VAT ID</th>
            <th className="px-4 py-3 font-medium">Country</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Creator</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="cursor-pointer border-b border-black/5 last:border-b-0 hover:bg-stone-50"
              onClick={() => navigate(`/suppliers/${supplier.id}`)}
            >
              <td className="px-4 py-3 font-medium text-zinc-900">{supplier.companyName}</td>
              <td className="px-4 py-3 text-zinc-600">{supplier.vatId}</td>
              <td className="px-4 py-3 text-zinc-600">{supplier.country}</td>
              <td className="px-4 py-3">
                <StatusBadge status={supplier.status} />
              </td>
              <td className="px-4 py-3 text-zinc-600">{creatorName(supplier.createdBy)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
