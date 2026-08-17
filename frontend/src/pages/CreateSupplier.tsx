/**
 * Create-supplier form: company name, VAT ID, country, contact email.
 * Client-side validation; keeps field values on duplicate-VAT API errors.
 */

import { CreateSupplierForm } from "../components/CreateSupplierForm";

export function CreateSupplier() {
  return (
    <section>
      <h1 className="mb-6 text-xl font-semibold">Create supplier</h1>
      <CreateSupplierForm />
    </section>
  );
}
