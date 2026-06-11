// Przydatne aplikacje we Włoszech.

export type AppTip = {
  name: string;
  emoji: string;
  what: string;
};

export const apps: AppTip[] = [
  { name: "Google Maps", emoji: "🗺️", what: "Nawigacja pieszo + pobierzmy mapy Rzymu/Pizy offline przed wyjazdem." },
  { name: "Trenitalia", emoji: "🚄", what: "Bilety i rozkład pociągów krajowych (Roma → Pisa, regionale do Lukki)." },
  { name: "Italo Treno", emoji: "🚅", what: "Druga sieć szybkich pociągów - czasem taniej niż Trenitalia." },
  { name: "FreeNow / Uber", emoji: "🚕", what: "Zamawianie taksówek w dużych miastach (Uber działa ograniczenie - często to taxi)." },
  { name: "Moovit", emoji: "🚌", what: "Komunikacja miejska Rzymu - trasy autobusów, metra i tramwajów." },
  { name: "Revolut / Curve", emoji: "💳", what: "Płatności bez prowizji za przewalutowanie, podział kosztów w grupie." },
  { name: "Google Translate", emoji: "🌐", what: "Tłumacz z aparatem (menu, tabliczki) - pobierzmy włoski offline." },
  { name: "TheFork", emoji: "🍽️", what: "Rezerwacje stolików w restauracjach, czasem ze zniżkami." },
  { name: "WhatsApp", emoji: "💬", what: "Podstawowy komunikator we Włoszech - przyda się do kontaktu z noclegiem." },
];
