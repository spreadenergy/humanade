import type { Listing } from "@prisma/client";
import { updateListing } from "@/app/manage/[token]/actions";
import {
  CATEGORIES,
  CATEGORY_KEYS,
  URGENCIES,
  URGENCY_KEYS,
} from "@/lib/constants";
import { LocationPicker } from "./LocationPicker";

export function ManageEditForm({
  listing,
  token,
}: {
  listing: Listing;
  token: string;
}) {
  return (
    <form action={updateListing} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="edit-title" className="mb-1 block text-sm font-semibold text-navy">
          Title
        </label>
        <input
          id="edit-title"
          name="title"
          required
          maxLength={120}
          defaultValue={listing.title}
          className="field"
        />
      </div>
      <div>
        <label htmlFor="edit-description" className="mb-1 block text-sm font-semibold text-navy">
          Details
        </label>
        <textarea
          id="edit-description"
          name="description"
          required
          rows={5}
          maxLength={4000}
          defaultValue={listing.description}
          className="field"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="edit-category" className="mb-1 block text-sm font-semibold text-navy">
            Category
          </label>
          <select
            id="edit-category"
            name="category"
            defaultValue={listing.category}
            className="field"
          >
            {CATEGORY_KEYS.map((k) => (
              <option key={k} value={k}>
                {CATEGORIES[k].icon} {CATEGORIES[k].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="edit-urgency" className="mb-1 block text-sm font-semibold text-navy">
            Urgency
          </label>
          <select
            id="edit-urgency"
            name="urgency"
            defaultValue={listing.urgency}
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
          <label htmlFor="edit-quantity" className="mb-1 block text-sm font-semibold text-navy">
            Quantity / scale
          </label>
          <input
            id="edit-quantity"
            name="quantity"
            maxLength={120}
            defaultValue={listing.quantity ?? ""}
            className="field"
          />
        </div>
      </div>
      <div>
        <label htmlFor="edit-location" className="mb-1 block text-sm font-semibold text-navy">
          Location
        </label>
        <input
          id="edit-location"
          name="locationName"
          required
          maxLength={160}
          defaultValue={listing.locationName}
          className="field"
        />
        <div className="mt-2">
          <LocationPicker
            initialLat={listing.lat != null ? String(listing.lat) : undefined}
            initialLng={listing.lng != null ? String(listing.lng) : undefined}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-contactName" className="mb-1 block text-sm font-semibold text-navy">
            Your name
          </label>
          <input
            id="edit-contactName"
            name="contactName"
            required
            maxLength={80}
            defaultValue={listing.contactName}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="edit-orgName" className="mb-1 block text-sm font-semibold text-navy">
            Organization
          </label>
          <input
            id="edit-orgName"
            name="orgName"
            maxLength={120}
            defaultValue={listing.orgName ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="edit-phone" className="mb-1 block text-sm font-semibold text-navy">
            Phone
          </label>
          <input
            id="edit-phone"
            name="phone"
            type="tel"
            maxLength={40}
            defaultValue={listing.phone ?? ""}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="edit-whatsapp" className="mb-1 block text-sm font-semibold text-navy">
            WhatsApp
          </label>
          <input
            id="edit-whatsapp"
            name="whatsapp"
            type="tel"
            maxLength={40}
            defaultValue={listing.whatsapp ?? ""}
            className="field"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="edit-email" className="mb-1 block text-sm font-semibold text-navy">
            Email
          </label>
          <input
            id="edit-email"
            name="email"
            type="email"
            maxLength={160}
            defaultValue={listing.email ?? ""}
            className="field"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-navy">
        Save changes
      </button>
    </form>
  );
}
