// Plan dzień po dniu. Propozycja do swobodnej edycji - pozycje są tylko sugestiami.

export type DayPlan = {
  date: string; // ISO
  weekday: string;
  city: string;
  emoji: string;
  title: string;
  items: { time?: string; text: string }[];
};

export const itinerary: DayPlan[] = [
  {
    date: "2026-07-25",
    weekday: "sobota",
    city: "Rzym",
    emoji: "🛬",
    title: "Przyloty i pierwszy wieczór",
    items: [
      { time: "10:35", text: "Wylot Dawid + Karolina z Krakowa" },
      { time: "13:05", text: "Ląduje Wiktoria (z Edynburga)" },
      { text: "Zakwaterowanie, zostawienie bagaży" },
      { text: "Lekki spacer - Trastevere, pierwsza pizza/aperol" },
    ],
  },
  {
    date: "2026-07-26",
    weekday: "niedziela",
    city: "Rzym",
    emoji: "⛲",
    title: "Centro storico + odbiór Banana",
    items: [
      { text: "Panteon" },
      { text: "Fontanna di Trevi (wrzućmy monetę!)" },
      { text: "Piazza Navona, Schody Hiszpańskie" },
      { time: "wieczór", text: "Przylatuje Banan - wspólna kolacja, ekipa w komplecie 🎉" },
    ],
  },
  {
    date: "2026-07-27",
    weekday: "poniedziałek",
    city: "Rzym",
    emoji: "⛪",
    title: "Watykan",
    items: [
      { text: "Bazylika św. Piotra (wejście za darmo, ale kolejki - rano!)" },
      { text: "Muzea Watykańskie + Kaplica Sykstyńska - BILETY na godzinę z wyprzedzeniem" },
      { text: "Zakryte ramiona i kolana - dress code obowiązkowy" },
      { text: "Ew. wejście na kopułę bazyliki (taras widokowy)" },
    ],
  },
  {
    date: "2026-07-28",
    weekday: "wtorek",
    city: "Rzym",
    emoji: "🏛️",
    title: "Antyczny Rzym",
    items: [
      { text: "Koloseum - BILET na godzinę (warto z wejściem na areny)" },
      { text: "Forum Romanum + Palatyn (zwykle wspólny bilet)" },
      { text: "Vittoriano / Kapitol, Piazza Venezia" },
      { text: "Wieczór: ostatnia kolacja w Rzymie" },
    ],
  },
  {
    date: "2026-07-29",
    weekday: "środa",
    city: "Rzym → Piza",
    emoji: "🚄",
    title: "Przejazd do Pizy",
    items: [
      { text: "Rano: śniadanie, spakowanie, wymeldowanie" },
      { time: "12:00", text: "Pociąg Roma → Pisa Centrale (bądźmy na stacji ~30 min wcześniej)" },
      { text: "Zakwaterowanie w Pizie" },
      { text: "Po południu: Piazza dei Miracoli - Krzywa Wieża, katedra, baptysterium" },
    ],
  },
  {
    date: "2026-07-30",
    weekday: "czwartek",
    city: "Piza / Lucca",
    emoji: "🚲",
    title: "Wycieczka do Lukki",
    items: [
      { text: "Pociąg regionalny Piza → Lucca (~30 min, kursuje często)" },
      { text: "Przejażdżka rowerem po renesansowych murach miejskich" },
      { text: "Piazza dell'Anfiteatro, wieża Torre Guinigi z dębami na szczycie" },
      { text: "Powrót do Pizy na wieczór - ostatni wspólny aperol" },
    ],
  },
  {
    date: "2026-07-31",
    weekday: "piątek",
    city: "Wyloty",
    emoji: "🛫",
    title: "Powroty do domu",
    items: [
      { time: "~06:00", text: "Wiktoria - wylot (wcześnie rano)" },
      { time: "09:25", text: "Dawid + Karolina + Banan - wylot, ląd. 11:20" },
      { text: "Dzień wylotowy - bez zwiedzania, dojazd na lotnisko z zapasem" },
    ],
  },
];
