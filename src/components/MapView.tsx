"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";

export type MapListing = {
  id: string;
  type: string;
  title: string;
  category: string;
  urgency: string;
  status: string;
  locationName: string;
  lat: number | null;
  lng: number | null;
};

export function MapView({ listings }: { listings: MapListing[] }) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;
      const map = L.map(mapEl.current).setView([20, 0], 2);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const bounds: [number, number][] = [];
      for (const l of listings) {
        if (l.lat == null || l.lng == null) continue;
        const isNeed = l.type === "NEED";
        const marker = L.circleMarker([l.lat, l.lng], {
          radius: l.urgency === "CRITICAL" ? 11 : 8,
          color: "#ffffff",
          weight: 2,
          fillColor: isNeed ? "#2996d9" : "#5fae33",
          fillOpacity: 0.95,
        }).addTo(map);
        marker.bindPopup(
          `<strong>${isNeed ? "Need" : "Offer"}:</strong> ${escapeHtml(l.title)}<br>` +
            `<small>📍 ${escapeHtml(l.locationName)}</small><br>` +
            `<a href="/listing/${l.id}">View listing →</a>`,
        );
        bounds.push([l.lat, l.lng]);
      }
      if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [listings]);

  return (
    <div
      ref={mapEl}
      className="h-[70vh] w-full rounded-lg border border-slate-300"
      role="region"
      aria-label="Map of needs and offers"
    />
  );
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
