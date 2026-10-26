"use client";

import { useState } from "react";

// "Hear about drops". Not connected yet: Phase 7 sends it to Shopify (customer + email marketing consent).
export function NewsletterForm() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <form
      className="flex max-w-[480px] flex-[2_1_320px] flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setNote("Email sign-up isn’t connected yet.");
      }}
    >
      <h3 className="font-display text-h3 text-fg uppercase">Hear about drops</h3>
      <p className="text-body-s">One email per drop. Nothing else.</p>
      <div className="flex">
        <label className="flex min-w-0 flex-auto">
          <span className="sr-only">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Leave your email"
            className="h-12 min-w-0 flex-auto rounded-l-sm border border-r-0 border-border-2 bg-transparent px-4 text-body text-fg placeholder:text-muted"
          />
        </label>
        <button type="submit" className="sz-label h-12 cursor-pointer rounded-r-sm bg-fg px-6 text-bg">
          Sign up
        </button>
      </div>
      {note && (
        <p role="status" className="text-body-s text-muted">
          {note}
        </p>
      )}
    </form>
  );
}
