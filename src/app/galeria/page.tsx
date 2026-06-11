import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Galeria" };

// Placeholder photos from Wikimedia Commons, hosted locally.
// After the trip, replace files in /public/gallery with your own shots.
const photos = [
  { src: "/gallery/koloseum.jpg", caption: "Koloseum", rotate: "-2deg" },
  { src: "/gallery/trevi.jpg", caption: "Fontanna di Trevi", rotate: "1.5deg" },
  { src: "/gallery/watykan.jpg", caption: "Watykan", rotate: "-1deg" },
  { src: "/gallery/panteon.jpg", caption: "Panteon", rotate: "2deg" },
  { src: "/gallery/ulice.jpg", caption: "Uliczki Rzymu", rotate: "-1.5deg" },
  { src: "/gallery/jedzenie.jpg", caption: "Cucina romana", rotate: "1deg" },
  { src: "/gallery/piza.jpg", caption: "Krzywa Wieża", rotate: "-2deg" },
  { src: "/gallery/lucca.jpg", caption: "Lucca", rotate: "1.5deg" },
  { src: "/gallery/aperol.jpg", caption: "Aperolek 🧡", rotate: "-1deg" },
];

export default function GaleriaPage() {
  return (
    <div>
      <PageHeader
        emoji="📸"
        title="Galeria"
        desc="Na razie zdjęcia poglądowe - po wyjeździe podmienimy je na własne kadry z Rzymu, Pizy i Lukki."
      />

      <div className="mb-6 rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
        📷 To placeholdery. Po powrocie wrzucimy tu nasze zdjęcia (albo podepniemy
        wspólny album Google Photos).
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {photos.map((p) => (
          <figure
            key={p.caption}
            className="bg-cream p-2.5 pb-8 shadow-md transition-transform hover:rotate-0 hover:scale-[1.03]"
            style={{
              transform: `rotate(${p.rotate})`,
              boxShadow: "2px 4px 10px rgba(58,44,29,0.25)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.caption}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="mt-2 text-center font-display text-sm font-semibold text-ink">
              {p.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
