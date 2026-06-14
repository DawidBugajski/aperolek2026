import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aperolek 2026 — Rzym · Piza · Lucca",
    short_name: "Aperolek",
    description: "Prywatne centrum dowodzenia wyjazdem ekipy do Włoch.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pl",
    background_color: "#f4ead3",
    theme_color: "#bf5a34",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
