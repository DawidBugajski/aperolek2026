export type ShoppingItem = {
  text: string;
  detail?: string;
  done: boolean;
};

export type ShoppingGroup = {
  title: string;
  emoji: string;
  items: ShoppingItem[];
};

export const shopping: ShoppingGroup[] = [
  {
    title: "Nocleg",
    emoji: "🏨",
    items: [
      { text: "Nocleg w Rzymie (25-29.07, 4 noce)", detail: "Silvano's Home In Rome — Via Costantino Morin 12, Vaticano Prati, 00195 Rzym", done: true },
      { text: "Nocleg w Pizie (29-31.07, 2 noce)", detail: "Via Pasquale Landi 9, 56124 Piza", done: true },
    ],
  },
  {
    title: "Transport",
    emoji: "🚆",
    items: [
      { text: "Loty tam i z powrotem", detail: "Dawid+Karolina i Banan: powrót 9:25; Wiktoria osobno", done: false },
      { text: "Bilet pociąg Roma → Pisa Centrale (29.07, 12:00)", detail: "kupmy wcześniej dla całej ekipy", done: false },
      { text: "Transfer z lotniska w Rzymie do centrum", detail: "Leonardo Express z FCO lub bus", done: false },
    ],
  },
  {
    title: "Wejściówki / atrakcje",
    emoji: "🎟️",
    items: [
      { text: "Koloseum / Forum (slot czasowy)", detail: "patrz: Bilety czasowe", done: false },
      { text: "Muzea Watykańskie (slot czasowy)", detail: "patrz: Bilety czasowe", done: false },
      { text: "Krzywa Wieża + katedra w Pizie", detail: "patrz: Bilety czasowe", done: false },
    ],
  },
  {
    title: "Formalności",
    emoji: "🪪",
    items: [
      { text: "Ważny dowód osobisty / paszport", detail: "sprawdź datę ważności każdego z ekipy", done: false },
      { text: "Karta EKUZ (darmowa, z NFZ)", detail: "europejska karta ubezpieczenia zdrowotnego", done: false },
      { text: "Ubezpieczenie turystyczne", detail: "opcjonalnie, ponad EKUZ", done: false },
      { text: "Karta wielowalutowa / gotówka EUR", detail: "Revolut/Curve działają świetnie we Włoszech", done: false },
    ],
  },
];
