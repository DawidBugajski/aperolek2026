// Travelers and flights. Fill in missing times/numbers (fields with null).

export type Flight = {
  direction: "tam" | "powrót";
  date: string; // ISO YYYY-MM-DD
  from: string;
  to: string;
  depart: string | null; // "HH:MM" or null if unknown
  arrive: string | null;
  note?: string;
};

export type Traveler = {
  id: string;
  name: string;
  emoji: string;
  homeCity: string;
  flights: Flight[];
};

export const travelers: Traveler[] = [
  {
    id: "dawid",
    name: "Dawid",
    emoji: "🧔",
    homeCity: "Kraków",
    flights: [
      { direction: "tam", date: "2026-07-25", from: "Kraków (KRK)", to: "Rzym", depart: "10:35", arrive: null },
      { direction: "powrót", date: "2026-07-31", from: "Piza", to: "Kraków (KRK)", depart: "09:25", arrive: "11:20" },
    ],
  },
  {
    id: "karolina",
    name: "Karolina",
    emoji: "👩",
    homeCity: "Kraków",
    flights: [
      { direction: "tam", date: "2026-07-25", from: "Kraków (KRK)", to: "Rzym", depart: "10:35", arrive: null },
      { direction: "powrót", date: "2026-07-31", from: "Piza", to: "Kraków (KRK)", depart: "09:25", arrive: "11:20" },
    ],
  },
  {
    id: "wiktoria",
    name: "Wiktoria",
    emoji: "👩‍🦰",
    homeCity: "Edynburg",
    flights: [
      { direction: "tam", date: "2026-07-25", from: "Edynburg (EDI)", to: "Rzym", depart: "09:05", arrive: "13:05" },
      { direction: "powrót", date: "2026-07-31", from: "Piza", to: "Edynburg (EDI)", depart: "06:00", arrive: null, note: "godzina przybliżona - do potwierdzenia" },
    ],
  },
  {
    id: "banan",
    name: "Banan",
    emoji: "🍌",
    homeCity: "Sofia",
    flights: [
      { direction: "tam", date: "2026-07-26", from: "Sofia (SOF)", to: "Rzym", depart: null, arrive: null, note: "niedziela wieczorem - godzina do uzupełnienia" },
      { direction: "powrót", date: "2026-07-31", from: "Piza", to: "Kraków (KRK)", depart: "09:25", arrive: "11:20", note: "leci z Dawidem i Karoliną" },
    ],
  },
];
