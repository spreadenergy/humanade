/**
 * A half-written post, kept in the browser so a reload, a dead battery or a
 * dropped connection does not cost someone the paragraph they just wrote
 * describing what they need. Server-side failures are handled separately in
 * the post action; this covers everything that happens before the form is
 * ever submitted.
 *
 * Contact details live in here too, which is the reason for both the expiry
 * and the clearing on success: phones get shared, and a draft holding a
 * stranger's number should not outlive the visit.
 */
const PREFIX = "humanade:draft:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
/** Never persisted: the bot honeypot and the hidden type marker. */
const SKIP = new Set(["website", "type"]);

function key(type: string) {
  return `${PREFIX}${type}`;
}

export function saveDraft(type: string, form: HTMLFormElement): void {
  try {
    const values: Record<string, string> = {};
    for (const el of form.elements) {
      const field = el as HTMLInputElement;
      if (!field.name || SKIP.has(field.name) || !field.value) continue;
      values[field.name] = field.value;
    }
    if (!Object.keys(values).length) {
      localStorage.removeItem(key(type));
      return;
    }
    localStorage.setItem(key(type), JSON.stringify({ at: Date.now(), values }));
  } catch {
    // Private browsing or a full quota: losing the draft is not worth an error.
  }
}

export function restoreDraft(type: string, form: HTMLFormElement): void {
  try {
    const raw = localStorage.getItem(key(type));
    if (!raw) return;
    const { at, values } = JSON.parse(raw) as {
      at?: number;
      values?: Record<string, string>;
    };
    if (!values || !at || Date.now() - at > MAX_AGE_MS) {
      localStorage.removeItem(key(type));
      return;
    }
    for (const [name, value] of Object.entries(values)) {
      const field = form.elements.namedItem(name) as HTMLInputElement | null;
      // Only fill what is still blank: values handed back by a failed
      // submit are fresher than the draft and must win.
      if (field && !field.value) field.value = value;
    }
  } catch {
    // Unparseable draft: ignore it rather than block the form.
  }
}

export function clearDrafts(): void {
  try {
    for (const type of ["NEED", "OFFER"]) localStorage.removeItem(key(type));
  } catch {
    // Nothing to do.
  }
}
