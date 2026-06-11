"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PlaceWithUrl } from "@/data/places";

const COLORS: Record<PlaceWithUrl["type"], string> = {
  nocleg: "#8a2f33",
  atrakcja: "#bf5a34",
  jedzenie: "#6f7a3a",
};

const SVGS: Record<PlaceWithUrl["type"], string> = {
  nocleg:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/></svg>',
  atrakcja:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.8 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>',
  jedzenie:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v5M5 3v4M9 3v4M7 8v13"/><path d="M16 3c-1.6 0-2.5 2-2.5 5S15 12 16 12M16 3v18"/></svg>',
};

function iconFor(type: PlaceWithUrl["type"]) {
  return L.divIcon({
    className: "trip-pin-wrap",
    html: `<div class="trip-pin"><div class="trip-pin-dot" style="background:${COLORS[type]}">${SVGS[type]}</div><div class="trip-pin-tip" style="background:${COLORS[type]}"></div></div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 38],
    popupAnchor: [0, -36],
  });
}

// Dopasowuje widok do aktualnych pinezek po zmianie miasta.
function FitBounds({ pins }: { pins: PlaceWithUrl[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }, [pins, map]);
  return null;
}

export default function TripMap({ pins }: { pins: PlaceWithUrl[] }) {
  const center: [number, number] = pins.length
    ? [pins[0].lat, pins[0].lng]
    : [41.9, 12.49];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds pins={pins} />
      {pins.map((p) => (
        <Marker key={p.name} position={[p.lat, p.lng]} icon={iconFor(p.type)}>
          <Tooltip direction="top" offset={[0, -34]}>
            {p.name}
          </Tooltip>
          <Popup>
            <span className="block font-semibold">{p.name}</span>
            {p.note && <span className="block text-xs opacity-70">{p.note}</span>}
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2f6f86", fontWeight: 600 }}
            >
              Otwórz w Mapach ↗
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
