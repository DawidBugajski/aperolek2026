export type FoodItem = {
  name: string;
  emoji: string;
  desc: string;
};

export type FoodRegion = {
  region: string;
  items: FoodItem[];
};

export const food: FoodRegion[] = [
  {
    region: "Rzym",
    items: [
      { name: "Cacio e pepe", emoji: "🧀", desc: "Makaron z pecorino i pieprzem - klasyk rzymski." },
      { name: "Carbonara", emoji: "🍳", desc: "Prawdziwa: jajko, guanciale, pecorino - bez śmietany!" },
      { name: "Supplì", emoji: "🍙", desc: "Smażone ryżowe kuleczki z mozzarellą w środku." },
      { name: "Pizza al taglio", emoji: "🍕", desc: "Pizza na kawałki sprzedawana na wagę - szybki street food." },
      { name: "Carciofi alla romana", emoji: "🌿", desc: "Karczochy po rzymsku - sezonowo, ale warto." },
      { name: "Gelato", emoji: "🍦", desc: "Szukajmy 'gelateria artigianale' - prawdziwe, rzemieślnicze lody." },
      { name: "Aperol Spritz", emoji: "🍹", desc: "Obowiązkowy aperitivo o zachodzie słońca. 🧡" },
    ],
  },
  {
    region: "Toskania (Piza / Lucca)",
    items: [
      { name: "Cantucci + Vin Santo", emoji: "🍪", desc: "Migdałowe ciasteczka maczane w słodkim winie." },
      { name: "Pici", emoji: "🍝", desc: "Grube, ręcznie robione toskańskie makarony." },
      { name: "Cecìna / Torta di ceci", emoji: "🫓", desc: "Placek z mąki z ciecierzycy - specjalność Pizy." },
      { name: "Tordelli lucchesi", emoji: "🥟", desc: "Nadziewane mięsem pierożki z Lukki w sosie mięsnym." },
      { name: "Bistecca / dania mięsne", emoji: "🥩", desc: "Toskania słynie z mięs i prostych, wyrazistych smaków." },
      { name: "Buccellato", emoji: "🍞", desc: "Słodki chleb z Lukki z rodzynkami i anyżem." },
    ],
  },
];
