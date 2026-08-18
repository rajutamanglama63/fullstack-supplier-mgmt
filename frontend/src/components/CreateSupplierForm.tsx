import { type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { CreateSupplierInput } from "../types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400";

export function CreateSupplierForm() {
  /** Reads named inputs via FormData, logs the payload, then clears the form. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Keep the single-page application from reloading on submit.
    const form = new FormData(event.currentTarget); // Collect each input's name and value.
    const data: CreateSupplierInput = { // Trimmed fields keyed by each input's name, to avoid whitespace.
      companyName: String(form.get("companyName") ?? "").trim(),
      vatId: String(form.get("vatId") ?? "").trim(),
      country: String(form.get("country") ?? "").trim(),
      contactEmail: String(form.get("contactEmail") ?? "").trim(),
    };

    console.log(data);
    event.currentTarget.reset(); // Empty the inputs after the values are captured.
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 rounded-xl border border-black/10 bg-white p-5"
    >
      <label className="block text-sm font-medium text-zinc-700">
        Company name
        <input className={fieldClass} name="companyName" type="text" required />
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        VAT ID
        <input className={fieldClass} name="vatId" type="text" required />
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Country
        <input className={fieldClass} name="country" type="text" required />
      </label>
      <label className="block text-sm font-medium text-zinc-700">
        Contact email
        <input className={fieldClass} name="contactEmail" type="email" required />
      </label>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Save
        </button>
        <Link to="/" className="text-sm text-zinc-500 no-underline hover:text-zinc-800">
          Cancel
        </Link>
      </div>
    </form>
  );
}
