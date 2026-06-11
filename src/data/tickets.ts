// Timed-entry tickets that must be booked in advance.

export type Ticket = {
  name: string;
  city: string;
  why: string;
  officialUrl: string;
  assignedTo: string | null; // who handles the booking
  status: "do-rezerwacji" | "zarezerwowane";
  bookedFor?: string; // e.g. "28.07, 10:30"
};

export const tickets: Ticket[] = [
  {
    name: "Koloseum + Forum Romanum + Palatyn",
    city: "Rzym",
    why: "Wejście na godzinę, potrafi wyprzedać się na kilka dni do przodu. Rozważmy bilet z wejściem na areny.",
    officialUrl: "https://colosseo.it/en/",
    assignedTo: null,
    status: "do-rezerwacji",
  },
  {
    name: "Muzea Watykańskie + Kaplica Sykstyńska",
    city: "Rzym",
    why: "Obowiązkowa rezerwacja slotu czasowego - inaczej gigantyczne kolejki.",
    officialUrl: "https://tickets.museivaticani.va/",
    assignedTo: null,
    status: "do-rezerwacji",
  },
  {
    name: "Bazylika św. Piotra - wejście na kopułę",
    city: "Rzym",
    why: "Wstęp do bazyliki darmowy, ale kopuła (taras widokowy) płatna; bilet na miejscu lub online.",
    officialUrl: "https://www.basilicasanpietro.va/",
    assignedTo: null,
    status: "do-rezerwacji",
  },
  {
    name: "Krzywa Wieża w Pizie",
    city: "Piza",
    why: "Limit osób i sloty czasowe; plecaki trzeba zostawić w depozycie. Kupmy razem z katedrą.",
    officialUrl: "https://www.opapisa.it/en/",
    assignedTo: null,
    status: "do-rezerwacji",
  },
];
