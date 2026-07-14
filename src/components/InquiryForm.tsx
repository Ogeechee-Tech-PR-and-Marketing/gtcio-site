"use client";

import { useState } from "react";

export type InquiryField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea" | "select";
  required?: boolean;
  halfWidth?: boolean;
  options?: string[];
  placeholder?: string;
};

type InquiryFormProps = {
  formType: "partner" | "contact" | "tour";
  fields: InquiryField[];
  submitLabel?: string;
  confirmationMessage?: string;
};

const FIELD_CLASSES =
  "w-full border border-brand-silver bg-brand-white px-3 py-2 text-brand-black focus:border-brand-red focus:outline-none";

export default function InquiryForm({
  formType,
  fields,
  submitLabel = "Submit",
  confirmationMessage = "Thanks! We've got your message and someone from GTCIO will follow up soon.",
}: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const payload = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, formType }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="border-2 border-brand-red bg-brand-white px-6 py-8 text-brand-black">
        <p className="font-heading text-lg font-bold">Message received</p>
        <p className="mt-2 text-brand-silver">{confirmationMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Honeypot: hidden from people, catnip for bots. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {fields.map((field) => (
        <div key={field.name} className={field.halfWidth === false ? "sm:col-span-2" : ""}>
          <label
            htmlFor={field.name}
            className="font-heading mb-1 block text-xs font-bold tracking-wide text-brand-black"
          >
            {field.label}
            {field.required && <span className="text-brand-red"> *</span>}
          </label>

          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              defaultValue=""
              className={FIELD_CLASSES}
            >
              <option value="" disabled>
                {field.placeholder ?? "Select one…"}
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
              className={FIELD_CLASSES}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              className={FIELD_CLASSES}
            />
          )}
        </div>
      ))}

      {error && (
        <p role="alert" className="text-sm font-bold text-brand-red sm:col-span-2">
          {error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="font-ui bg-brand-red px-8 py-3 text-sm text-brand-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "SENDING…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
