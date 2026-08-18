import { Link } from "react-router-dom";
import { SupplierTable } from "../components/SupplierTable";
import { DUMMY_SUPPLIERS } from "../data/dummySuppliers";

export function SupplierList() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Suppliers</h1>
        <Link
          to="/suppliers/new"
          className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white no-underline hover:bg-zinc-800"
        >
          Create supplier
        </Link>
      </div>
      <SupplierTable suppliers={DUMMY_SUPPLIERS} />
    </section>
  );
}
