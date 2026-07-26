"use client";

import { useEffect } from "react";

import { clearDrafts } from "@/lib/draft";

/**
 * Rendered once the listing exists. The draft has done its job by then, and
 * it holds a phone number — on a shared phone it should not sit there
 * waiting for the next person.
 */
export function ClearDraft() {
  useEffect(() => {
    clearDrafts();
  }, []);
  return null;
}
