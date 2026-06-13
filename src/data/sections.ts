// Single source of truth for navigation and home page tiles.
// title  -> full name (headings, tiles)
// short  -> short label for the nav bar

export type Section = {
  slug: string;
  href: string;
  title: string;
  short: string;
  emoji: string;
  desc: string;
};

export const sections: Section[] = [
  { slug: "plan", href: "/plan", title: "Plan zwiedzania", short: "Plan", emoji: "🗺️", desc: "Dzień po dniu: Rzym, Piza, Lucca" },
  { slug: "bilety", href: "/bilety", title: "Bilety czasowe", short: "Bilety", emoji: "🎟️", desc: "Koloseum, Watykan, Krzywa Wieża - rezerwacje" },
  { slug: "do-kupienia", href: "/do-kupienia", title: "Do kupienia", short: "Zakupy", emoji: "🛒", desc: "Nocleg, wejściówki, rzeczy przed wyjazdem" },
  { slug: "transport", href: "/transport", title: "Transport", short: "Transport", emoji: "🚆", desc: "Loty, transfery, pociągi, ZTL" },
  { slug: "budzet", href: "/budzet", title: "Budżet", short: "Budżet", emoji: "💸", desc: "Kto za co zapłacił i podział kosztów" },
  { slug: "podsumowanie", href: "/podsumowanie", title: "Podsumowanie", short: "Podsumowanie", emoji: "📊", desc: "Koszty wg kategorii i finalne rozliczenie" },
  { slug: "pakowanie", href: "/pakowanie", title: "Pakowanie", short: "Pakowanie", emoji: "🧳", desc: "Lista wspólna i indywidualna" },
  { slug: "aplikacje", href: "/aplikacje", title: "Aplikacje", short: "Aplikacje", emoji: "📱", desc: "Co zainstalować przed wyjazdem" },
  { slug: "jedzenie", href: "/jedzenie", title: "Jedzenie", short: "Jedzenie", emoji: "🍝", desc: "Co koniecznie spróbować" },
  { slug: "info", href: "/info", title: "Info o Włoszech", short: "Info", emoji: "ℹ️", desc: "Praktyczne zasady i ciekawostki" },
  { slug: "sos", href: "/sos", title: "SOS / kontakty", short: "SOS", emoji: "🆘", desc: "Numery, adresy, dokumenty" },
  { slug: "galeria", href: "/galeria", title: "Galeria", short: "Galeria", emoji: "📸", desc: "Zdjęcia - po powrocie" },
];
