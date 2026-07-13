"use client";

import { useState } from "react";

export type InquiryField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea";
  required?: boolean;
  halfWidth?: boolean;
};

type InquiryFormProps = {
  fields: InquiryField[];
  submitLabel?: string;
  confirmationMessage?: string;
};

export default function InquiryForm({
  fields,
  submitLabel = "Submit",
  confirmationMessage = "Thanks — we've got your message and someone from GTCIO will follow up soon.",
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border-2 border-brand-red bg-brand-white px-6 py-8 text-brand-black">
        <p className="font-heading text-lg font-bold">Message received</p>
        <p className="mt-2 text-brand-silver">{confirmationMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      {fields.map((field) => (
        <div key={field.name} className={field.halfWidth === false ? "sm:col-span-2" : ""}>
          <label htmlFor={field.name} className="font-heading mb-1 block text-xs font-bold tracking-wide text-brand-black">
            {field.label}
            {field.required && <span className="text-brand-red"> *</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
              className="w-full border border-brand-silver bg-brand-white px-3 py-2 text-brand-black focus:border-brand-red focus:outline-none"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              className="w-full border border-brand-silver bg-brand-white px-3 py-2 text-brand-black focus:border-brand-red focus:outline-none"
            />
          )}
        </div>
      ))}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="font-heading bg-brand-red px-8 py-3 text-sm font-bold tracking-wide text-brand-white transition-colors hover:bg-black"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
