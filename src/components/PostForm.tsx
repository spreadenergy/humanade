"use client";

import { useActionState } from "react";
import { createListing, type PostFormState } from "@/app/post/actions";
import {
  CATEGORY_ICONS,
  CATEGORY_KEYS,
  URGENCY_KEYS,
  type ListingType,
} from "@/lib/constants";
import type { Dict } from "@/lib/dictionaries/en";
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

  return (
    <form action={formAction} className="space-y-5">
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
        <p className="mb-3 text-sm text-slate-500">{d.form.contactSub}</p>
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
              maxLength={40}
              defaultValue={v.whatsapp}
              placeholder="+58 412 000 0000"
              className="field"
            />
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
