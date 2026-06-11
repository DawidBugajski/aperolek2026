// Lista pakowania. Odhaczanie zapisuje się w przeglądarce (per urządzenie).

export type PackingGroup = {
  title: string;
  emoji: string;
  items: string[];
};

export const packing: PackingGroup[] = [
  {
    title: "Dokumenty i pieniądze",
    emoji: "🪪",
    items: [
      "Dowód osobisty / paszport",
      "Karta EKUZ",
      "Karta płatnicza + trochę gotówki EUR",
      "Bilety lotnicze i pociągowe (offline w telefonie)",
      "Potwierdzenia rezerwacji noclegów",
    ],
  },
  {
    title: "Ubrania (lipiec, upał ~30-35°C)",
    emoji: "👕",
    items: [
      "Lekkie, przewiewne ubrania",
      "Coś z zakrytymi ramionami i kolanami (kościoły/Watykan!)",
      "Wygodne buty na dużo chodzenia",
      "Klapki / sandały",
      "Strój kąpielowy (na wszelki wypadek)",
      "Lekka kurtka / bluza na wieczór",
      "Nakrycie głowy + okulary przeciwsłoneczne",
    ],
  },
  {
    title: "Apteczka i kosmetyki",
    emoji: "🧴",
    items: [
      "Krem z wysokim filtrem SPF",
      "Leki własne + podstawowa apteczka",
      "Plastry na odciski (dużo chodzenia!)",
      "Środek na komary",
      "Kosmetyki podróżne (do 100 ml w bagażu podręcznym)",
    ],
  },
  {
    title: "Elektronika",
    emoji: "🔌",
    items: [
      "Ładowarka + kabel do telefonu",
      "Powerbank",
      "Słuchawki",
      "Adapter (Włochy mają gniazda typu F/L - polskie wtyczki zwykle pasują)",
    ],
  },
];
