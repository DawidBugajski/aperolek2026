// Praktyczne info o Włoszech.

export type InfoTip = {
  title: string;
  emoji: string;
  body: string;
};

export const infoTips: InfoTip[] = [
  {
    title: "Woda z fontann (nasoni)",
    emoji: "🚰",
    body: "Rzymskie żeliwne fontanny 'nasoni' lejące wodę to darmowa, zdatna do picia woda. Bierzmy butelkę wielorazową - w lipcu oszczędzimy fortunę i się nie odwodnimy.",
  },
  {
    title: "Dress code w kościołach",
    emoji: "⛪",
    body: "Bazylika św. Piotra i Watykan: zakryte ramiona i kolana - inaczej nie wpuszczą. Weźmy lekki szal lub koszulkę z rękawkiem na te wejścia.",
  },
  {
    title: "Napiwki",
    emoji: "💶",
    body: "Napiwki nie są obowiązkowe. Często doliczają 'coperto' (opłata za nakrycie). Zaokrąglenie rachunku w górę wystarcza.",
  },
  {
    title: "Godziny i sjesta",
    emoji: "🕐",
    body: "Wiele sklepów i mniejszych restauracji robi przerwę po południu (~13-16). Kolacje zaczynają się późno - kuchnie często otwierają o 19:30-20:00.",
  },
  {
    title: "Upał w lipcu",
    emoji: "🥵",
    body: "Bywa 30-35°C+. Planujmy zwiedzanie na rano i późne popołudnie, w południe szukajmy cienia/klimatyzacji. Filtr, woda, kapelusz - must have.",
  },
  {
    title: "Bezpieczeństwo i kieszonkowcy",
    emoji: "👜",
    body: "W zatłoczonych miejscach (Termini, metro, okolice Koloseum) uważajmy na kieszonkowców. Plecak z przodu, telefon w bezpiecznej kieszeni.",
  },
  {
    title: "Gniazdka",
    emoji: "🔌",
    body: "Włochy: typ F/L, 230V. Polskie wtyczki zazwyczaj pasują, ale część gniazd jest węższa - drobny adapter potrafi uratować.",
  },
  {
    title: "Płatności",
    emoji: "💳",
    body: "Karty akceptowane niemal wszędzie, ale w małych barach/trattoriach miejmy trochę gotówki. Bankomaty to 'bancomat'.",
  },
];
