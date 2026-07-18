"use client";

import { useActionState } from "react";
import { createListing, type PostFormState } from "@/app/post/actions";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  URGENCIES,
  URGENCY_KEYS,
  type ListingType,
} from "@/lib/constants";
import { LocationPicker } from "./LocationPicker";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}

export function PostForm({ type }: { type: ListingType }) {
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
          {isNeed ? "What do you need?" : "What can you offer?"}
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          defaultValue={v.title}
          placeholder={
            isNeed
              ? "e.g. Drinking water for 30 families"
              : "e.g. Doctor available for remote consultations"
          }
          className="field"
        />
        <FieldError errors={e.title} />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block font-semibold text-navy">
          Details
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={4000}
          defaultValue={v.description}
          placeholder={
            isNeed
              ? "What exactly is needed, for how many people, by when, and any important context."
              : "What you can provide, how much, when it's available, and any conditions."
          }
          className="field"
        />
        <FieldError errors={e.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className="mb-1 block font-semibold text-navy">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={v.category ?? ""}
            className="field"
          >
            <option value="" disabled>
              Choose…
            </option>
            {CATEGORY_KEYS.map((k) => (
              <option key={k} value={k}>
                {CATEGORIES[k].icon} {CATEGORIES[k].label}
              </option>
            ))}
          </select>
          <FieldError errors={e.category} />
        </div>
        <div>
          <label htmlFor="urgency" className="mb-1 block font-semibold text-navy">
            Urgency
          </label>
          <select
            id="urgency"
            name="urgency"
            defaultValue={v.urgency ?? "NORMAL"}
            className="field"
          >
            {URGENCY_KEYS.map((k) => (
              <option key={k} value={k}>
                {URGENCIES[k].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="mb-1 block font-semibold text-navy">
            Quantity / scale{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            maxLength={120}
            defaultValue={v.quantity}
            placeholder="e.g. 200 liters, 5 beds, 3 volunteers"
            className="field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="locationName" className="mb-1 block font-semibold text-navy">
          Location
        </label>
        <input
          id="locationName"
          name="locationName"
          required
          maxLength={160}
          defaultValue={v.locationName}
          placeholder="City, town, neighborhood, or area"
          className="field"
        />
        <FieldError errors={e.locationName} />
        <div className="mt-2">
          <LocationPicker initialLat={v.lat} initialLng={v.lng} />
        </div>
      </div>

      <fieldset className="rounded-lg border border-slate-200 bg-white p-4">
        <legend className="px-1 font-semibold text-navy">Contact</legend>
        <p className="mb-3 text-sm text-slate-500">
          People will contact you directly. Provide at least one channel.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contactName" className="mb-1 block text-sm font-semibold text-navy">
              Your name
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
            <label htmlFor="orgName" className="mb-1 block text-sm font-semibold text-navy">
              Organization{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="orgName"
              name="orgName"
              maxLength={120}
              defaultValue={v.orgName}
              placeholder="NGO, church, shelter, business…"
              className="field"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-navy">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={40}
              defaultValue={v.phone}
              placeholder="+1 555 000 0000"
              className="field"
            />
            <FieldError errors={e.phone} />
          </div>
          <div>
            <label htmlFor="whatsapp" className="mb-1 block text-sm font-semibold text-navy">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              maxLength={40}
              defaultValue={v.whatsapp}
              placeholder="+1 555 000 0000"
              className="field"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-navy">
              Email
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
          ? "Posting…"
          : isNeed
            ? "Post my request"
            : "Post my offer"}
      </button>
      <p className="text-xs text-slate-400">
        After posting you&apos;ll get a private management link to edit, mark
        fulfilled, or close your listing. Your contact details are shown
        publicly on the listing so helpers can reach you.
      </p>
    </form>
  );
}
