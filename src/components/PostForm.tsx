"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createListing, type PostFormState } from "@/app/post/actions";
import {
  CATEGORY_ICONS,
  CATEGORY_KEYS,
  URGENCY_KEYS,
  type ListingType,
} from "@/lib/constants";
import type { Dict } from "@/lib/dictionaries/en";
import { restoreDraft, saveDraft } from "@/lib/draft";
import { LocationPicker } from "./LocationPicker";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}

export function PostForm({ type, d }: { type: ListingType; d: Dict }) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
    createListing,
    {},
  );
  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  const isNeed = type === "NEED";
  const formRef = useRef<HTMLFormElement>(null);

  // Bring back anything typed before a reload, and keep saving as they go.
  useEffect(() => {
    if (formRef.current) restoreDraft(type, formRef.current);
  }, [type]);

  // React resets a form once its action finishes, so a submit that came
  // back with an error quietly undid two choices: the category went back
  // to "Choose…" and the urgency back to "Normal" — someone marking a need
  // CRITICAL had it downgraded without being told. These values are what
  // was just sent, so they overwrite whatever the reset left behind.
  useEffect(() => {
    const form = formRef.current;
    if (!form || !state.values) return;
    for (const [name, value] of Object.entries(state.values)) {
      const field = form.elements.namedItem(name) as HTMLInputElement | null;
      if (field && "value" in field) field.value = value;
    }
  }, [state]);

  const [sameWhatsApp, setSameWhatsApp] = useState(false);

  function copyPhoneToWhatsApp() {
    const form = formRef.current;
    if (!form) return;
    const phone = form.elements.namedItem("phone") as HTMLInputElement | null;
    const wa = form.elements.namedItem("whatsapp") as HTMLInputElement | null;
    if (phone && wa) wa.value = phone.value;
  }

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function onInput() {
    if (sameWhatsApp) copyPhoneToWhatsApp();
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (formRef.current) saveDraft(type, formRef.current);
    }, 400);
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onInput={onInput}
      className="space-y-5"
    >
      <input type="hidden" name="type" value={type} />
      {/* Honeypot — hidden from humans, tempting for bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.formError && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.formError}
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block font-semibold text-navy">
          {isNeed ? d.form.whatNeed : d.form.whatOffer}
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          defaultValue={v.title}
          placeholder={isNeed ? d.form.needTitlePh : d.form.offerTitlePh}
          className="field"
        />
        <FieldError errors={e.title} />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block font-semibold text-navy"
        >
          {d.form.details}
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={4000}
          defaultValue={v.description}
          placeholder={isNeed ? d.form.needDetailsPh : d.form.offerDetailsPh}
          className="field"
        />
        <FieldError errors={e.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="category"
            className="mb-1 block font-semibold text-navy"
          >
            {d.form.category}
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={v.category ?? ""}
            className="field"
          >
            <option value="" disabled>
              {d.form.choose}
            </option>
            {CATEGORY_KEYS.map((k) => (
              <option key={k} value={k}>
                {CATEGORY_ICONS[k]} {d.categories[k].label}
              </option>
            ))}
          </select>
          <FieldError errors={e.category} />
        </div>
        <div>
          <label
            htmlFor="urgency"
            className="mb-1 block font-semibold text-navy"
          >
            {d.form.urgency}
          </label>
          <select
            id="urgency"
            name="urgency"
            defaultValue={v.urgency ?? "NORMAL"}
            className="field"
          >
            {URGENCY_KEYS.map((k) => (
              <option key={k} value={k}>
                {d.urgencies[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="mb-1 block font-semibold text-navy"
          >
            {d.form.quantity}{" "}
            <span className="font-normal text-slate-400">
              {d.form.optional}
            </span>
          </label>
          <input
            id="quantity"
            name="quantity"
            maxLength={120}
            defaultValue={v.quantity}
            placeholder={d.form.quantityPh}
            className="field"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="locationName"
          className="mb-1 block font-semibold text-navy"
        >
          {d.form.location}
        </label>
        <input
          id="locationName"
          name="locationName"
          required
          maxLength={160}
          defaultValue={v.locationName}
          placeholder={d.form.locationPh}
          className="field"
        />
        <FieldError errors={e.locationName} />
        <div className="mt-2">
          <LocationPicker
            initialLat={v.lat}
            initialLng={v.lng}
            labels={d.picker}
          />
        </div>
      </div>

      <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
        <legend className="px-1 font-semibold text-navy">
          {d.form.contactLegend}
        </legend>
        <p className="mb-1 text-sm text-slate-500">{d.form.contactSub}</p>
        {/* Said before the number is typed, not after the post is sent. */}
        <p className="mb-3 text-sm font-medium text-navy">
          {d.form.contactPublicNote}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contactName"
              className="mb-1 block text-sm font-semibold text-navy"
            >
              {d.form.yourName}
            </label>
            <input
              id="contactName"
              name="contactName"
              required
              maxLength={80}
              autoComplete="name"
              defaultValue={v.contactName}
              className="field"
            />
            <FieldError errors={e.contactName} />
          </div>
          <div>
            <label
              htmlFor="orgName"
              className="mb-1 block text-sm font-semibold text-navy"
            >
              {d.form.org}{" "}
              <span className="font-normal text-slate-400">
                {d.form.optional}
              </span>
            </label>
            <input
              id="orgName"
              name="orgName"
              maxLength={120}
              autoComplete="organization"
              defaultValue={v.orgName}
              placeholder={d.form.orgPh}
              className="field"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-navy"
            >
              {d.form.phone}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
              defaultValue={v.phone}
              placeholder="+58 412 000 0000"
              className="field"
            />
            <FieldError errors={e.phone} />
          </div>
          <div>
            <label
              htmlFor="whatsapp"
              className="mb-1 block text-sm font-semibold text-navy"
            >
              {d.form.whatsapp}
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
              readOnly={sameWhatsApp}
              defaultValue={v.whatsapp}
              placeholder="+58 412 000 0000"
              className={`field ${sameWhatsApp ? "bg-slate-100 text-slate-500" : ""}`}
            />
            {/* Here the two are almost always the same number, and typing a
                Venezuelan mobile twice on a phone is real friction. */}
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={sameWhatsApp}
                onChange={(ev) => {
                  setSameWhatsApp(ev.target.checked);
                  if (ev.target.checked) copyPhoneToWhatsApp();
                }}
                className="h-4 w-4 rounded border-slate-300"
              />
              {d.form.sameAsPhone}
            </label>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-navy"
            >
              {d.form.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={160}
              defaultValue={v.email}
              className="field"
            />
            <FieldError errors={e.email} />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className={`btn w-full sm:w-auto ${isNeed ? "btn-blue" : "btn-green"}`}
      >
        {pending
          ? d.form.posting
          : isNeed
            ? d.form.submitNeed
            : d.form.submitOffer}
      </button>
      <p className="text-xs text-slate-400">{d.form.afterNote}</p>
    </form>
  );
}
