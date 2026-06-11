export type Place = {
  name: string;
  city: "Rzym" | "Piza" | "Lucca";
  type: "nocleg" | "atrakcja" | "jedzenie";
  lat: number;
  lng: number;
  note?: string;
};

export const places: Place[] = [
  // Rome
  { name: "Nocleg w Rzymie", city: "Rzym", type: "nocleg", lat: 41.8967, lng: 12.4822, note: "do uzupełnienia po rezerwacji" },
  { name: "Koloseum", city: "Rzym", type: "atrakcja", lat: 41.8902, lng: 12.4922 },
  { name: "Forum Romanum", city: "Rzym", type: "atrakcja", lat: 41.8925, lng: 12.4853 },
  { name: "Panteon", city: "Rzym", type: "atrakcja", lat: 41.8986, lng: 12.4769 },
  { name: "Fontanna di Trevi", city: "Rzym", type: "atrakcja", lat: 41.9009, lng: 12.4833 },
  { name: "Piazza Navona", city: "Rzym", type: "atrakcja", lat: 41.8992, lng: 12.4731 },
  { name: "Bazylika św. Piotra (Watykan)", city: "Rzym", type: "atrakcja", lat: 41.9022, lng: 12.4539 },
  { name: "Muzea Watykańskie", city: "Rzym", type: "atrakcja", lat: 41.9065, lng: 12.4534 },
  { name: "Trastevere", city: "Rzym", type: "jedzenie", lat: 41.889, lng: 12.469, note: "dzielnica pełna trattorii" },
  // Pisa
  { name: "Nocleg w Pizie", city: "Piza", type: "nocleg", lat: 43.716, lng: 10.396, note: "do uzupełnienia po rezerwacji" },
  { name: "Krzywa Wieża", city: "Piza", type: "atrakcja", lat: 43.723, lng: 10.3966 },
  { name: "Piazza dei Miracoli", city: "Piza", type: "atrakcja", lat: 43.7232, lng: 10.3936 },
  { name: "Borgo Stretto", city: "Piza", type: "jedzenie", lat: 43.7185, lng: 10.4015, note: "uliczka z barami i lodami" },
  // Lucca
  { name: "Mury miejskie", city: "Lucca", type: "atrakcja", lat: 43.843, lng: 10.502, note: "spacer/rower wokół miasta" },
  { name: "Piazza dell'Anfiteatro", city: "Lucca", type: "atrakcja", lat: 43.8447, lng: 10.5065 },
  { name: "Torre Guinigi", city: "Lucca", type: "atrakcja", lat: 43.8432, lng: 10.5048, note: "wieża z dębami na szczycie" },
];

function mapsUrl(p: Place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.city}`)}`;
}

export type PlaceWithUrl = Place & { url: string };

export const placesWithUrl: PlaceWithUrl[] = places.map((p) => ({ ...p, url: mapsUrl(p) }));

export const cityOrder: Place["city"][] = ["Rzym", "Piza", "Lucca"];

export const mapCities = cityOrder.map((city) => ({
  city,
  pins: placesWithUrl.filter((p) => p.city === city),
}));
