export const trip = {
  title: "Aperolek 2026",
  subtitle: "Rzym · Piza · Lucca",
  startDate: "2026-07-25",
  endDate: "2026-07-31",
  timezone: "Europe/Rome",
  cities: [
    { name: "Rzym", nights: 4, dates: "25-29 lipca", emoji: "🏛️" },
    { name: "Piza", nights: 2, dates: "29-31 lipca", emoji: "🗼" },
    { name: "Lucca", nights: 0, dates: "wycieczka 30 lipca", emoji: "🚲" },
  ],
} as const;
