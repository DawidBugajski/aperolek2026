// Informacje transportowe: transfery z lotnisk, pociągi, ZTL.

export type TransportTip = {
  title: string;
  emoji: string;
  body: string;
  link?: { label: string; url: string };
};

export const transportTips: TransportTip[] = [
  {
    title: "Z lotniska w Rzymie (Fiumicino, FCO) do centrum",
    emoji: "🚝",
    body: "Leonardo Express jedzie non-stop FCO → Roma Termini w ~32 min. Bilet kupimy w automacie lub w apce Trenitalia. Tańsza alternatywa: autobusy (Terravision/SIT) za kilka euro.",
    link: { label: "Trenitalia", url: "https://www.trenitalia.com/en.html" },
  },
  {
    title: "Pociąg Roma → Pisa Centrale (29.07, 12:00)",
    emoji: "🚄",
    body: "Bezpośrednie Intercity/Frecce jadą z Roma Termini do Pisa Centrale w ~2,5-3 h. Kupmy bilety wcześniej dla całej ekipy - w godzinach szczytu drożeją. Na stację bądźmy ~30 min przed odjazdem.",
    link: { label: "Trenitalia / Italo", url: "https://www.italotreno.com/en" },
  },
  {
    title: "Z lotniska w Pizie (PSA) do miasta",
    emoji: "🛤️",
    body: "PisaMover to automatyczna kolejka lotnisko ↔ Pisa Centrale, ~5 min. Lotnisko w Pizie jest bardzo blisko centrum - wielki plus przy porannych wylotach 31.07.",
  },
  {
    title: "Piza ↔ Lucca (wycieczka 30.07)",
    emoji: "🚲",
    body: "Pociąg regionalny (regionale) jedzie ~30 min i kursuje często. Bilet kupujemy na bieżąco; skasujmy go przed wejściem do pociągu, jeśli papierowy.",
  },
  {
    title: "ZTL - strefy ograniczonego ruchu",
    emoji: "🚫",
    body: "Centra Rzymu, Pizy i Lukki mają strefy ZTL z kamerami. Jeśli ktokolwiek planuje auto - NIE wjeżdżajmy w oznaczone strefy bez zezwolenia, bo mandaty przychodzą pocztą. Po miastach poruszamy się pieszo i komunikacją.",
  },
  {
    title: "Bilety komunikacji miejskiej w Rzymie",
    emoji: "🎫",
    body: "Bilet 100 min (BIT) ważny na metro/autobus/tramwaj. Są też bilety dzienne i Roma Pass (transport + wejścia do atrakcji). Kasujmy bilet przy wejściu.",
  },
];
