"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copy link",
  copiedLabel = "✓ Copied",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline !py-1.5 text-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard unavailable (http / old browser) — select-and-copy manually.
          window.prompt("Copy:", text);
        }
      }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
