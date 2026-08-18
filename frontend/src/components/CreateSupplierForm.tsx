import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createSupplier } from "../api/suppliers";
import { useUser } from "../context/UserContext";
import { saveDraft } from "../storage/drafts";
import type { CreateSupplierInput } from "../types";

const fieldClass =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400";

function readForm(form: HTMLFormElement): CreateSupplierInput {
  const data = new FormData(form);
  return {
    companyName: String(data.get("companyName") ?? "").trim(),
    vatId: String(data.get("vatId") ?? "").trim(),
    country: String(data.get("country") ?? "").trim(),
    contactEmail: String(data.get("contactEmail") ?? "").trim(),
  };
}

export function CreateSupplierForm() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = readForm(event.currentTarget);
    setError(null);
    setSaving(true);

    try {
      await createSupplier(user.id, input);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create supplier.");
    } finally {
      setSaving(false);
    }
  }

  function handleDraft(form: HTMLFormElement) {
    saveDraft(user.id, readForm(form));
    navigate("/");
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

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          Request
        </button>
        <button
          type="button"
          disabled={saving}
          className="rounded-lg border border-black/15 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 hover:bg-stone-50 disabled:opacity-60"
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) handleDraft(form);
          }}
        >
          Save draft
        </button>
        <Link to="/" className="text-sm text-zinc-500 no-underline hover:text-zinc-800">
          Cancel
        </Link>
      </div>
    </form>
  );
}
