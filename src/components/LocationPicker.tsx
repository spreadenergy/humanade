"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, CircleMarker } from "leaflet";

export type PickerLabels = {
  addPin: string;
  useMyLocation: string;
  removePin: string;
  pinnedAt: string;
  tapMap: string;
};

/**
 * Optional map pin for a listing. Coordinates land in hidden lat/lng
 * inputs so the surrounding form stays a plain HTML form.
 */
export function LocationPicker({
  initialLat,
  initialLng,
  labels,
}: {
  initialLat?: string;
  initialLng?: string;
  labels: PickerLabels;
}) {
  const [open, setOpen] = useState(Boolean(initialLat && initialLng));
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng
      ? { lat: Number(initialLat), lng: Number(initialLng) }
      : null,
  );
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<CircleMarker | null>(null);

  useEffect(() => {
    if (!open || !mapEl.current || mapRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current) return;
      const start = coords ?? { lat: 20, lng: 0 };
      const map = L.map(mapEl.current).setView(
        [start.lat, start.lng],
        coords ? 12 : 2,
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const setPin = (lat: number, lng: number) => {
        setCoords({ lat, lng });
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else
          markerRef.current = L.circleMarker([lat, lng], {
            radius: 10,
            color: "#1b3a6b",
            fillColor: "#f6a800",
            fillOpacity: 0.9,
          }).addTo(map);
      };
      if (coords) setPin(coords.lat, coords.lng);
      map.on("click", (e) => setPin(e.latlng.lat, e.latlng.lng));
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lng: longitude });
      mapRef.current?.setView([latitude, longitude], 13);
      // Re-open effect places the marker on next open; place directly if map live.
      if (mapRef.current) {
        mapRef.current.fire("click", {
          latlng: { lat: latitude, lng: longitude },
        });
      }
    });
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name="lat" value={coords ? String(coords.lat) : ""} />
      <input type="hidden" name="lng" value={coords ? String(coords.lng) : ""} />
      {!open ? (
        <button
          type="button"
          className="btn btn-outline !py-1.5 text-sm"
          onClick={() => setOpen(true)}
        >
          {labels.addPin}
        </button>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-outline !py-1.5 text-sm"
              onClick={useMyLocation}
            >
              {labels.useMyLocation}
            </button>
            {coords && (
              <button
                type="button"
                className="btn btn-outline !py-1.5 text-sm"
                onClick={() => {
                  setCoords(null);
                  markerRef.current?.remove();
                  markerRef.current = null;
                }}
              >
                {labels.removePin}
              </button>
            )}
            <span className="text-xs text-slate-500">
              {coords
                ? `${labels.pinnedAt} ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                : labels.tapMap}
            </span>
          </div>
          <div
            ref={mapEl}
            className="h-64 w-full rounded-lg border border-slate-300"
          />
        </>
      )}
    </div>
  );
}
