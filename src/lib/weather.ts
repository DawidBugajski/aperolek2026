export type CityWeather = {
  city: string;
  emoji: string;
  tempC: number;
  feelsLikeC: number;
  desc: string;
};

type CityConfig = {
  name: string;
  lat: number;
  lon: number;
};

const CITIES: CityConfig[] = [
  { name: "Roma",  lat: 41.8967, lon: 12.4822 },
  { name: "Pisa",  lat: 43.7228, lon: 10.4017 },
  { name: "Lucca", lat: 43.8430, lon: 10.5050 },
];

function codeToEmoji(code: number): string {
  if (code === 0)                  return "☀️";
  if (code <= 2)                   return "⛅";
  if (code === 3)                  return "☁️";
  if (code === 45 || code === 48)  return "🌫️";
  if (code >= 51 && code <= 67)    return "🌧️";
  if (code >= 80 && code <= 82)    return "🌦️";
  if (code >= 95)                  return "⛈️";
  return "⛅";
}

function emojiToDesc(emoji: string, tempC: number): string {
  if (emoji === "☀️" && tempC >= 35) return "Upał, brak chmur";
  if (emoji === "☀️" && tempC >= 28) return "Słonecznie, gorąco";
  if (emoji === "☀️" && tempC >= 20) return "Słonecznie";
  if (emoji === "☀️")               return "Słonecznie, chłodniej";
  if (emoji === "⛅")               return "Częściowe zachmurzenie";
  if (emoji === "☁️")               return "Pochmurno";
  if (emoji === "🌧️" || emoji === "🌦️") return "Deszcz";
  if (emoji === "⛈️")              return "Burze";
  return "Zmienna pogoda";
}

async function fetchCurrentWeather(city: CityConfig): Promise<CityWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,apparent_temperature,weathercode` +
    `&timezone=Europe%2FRome`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const tempC = Math.round(data.current.temperature_2m);
  const feelsLikeC = Math.round(data.current.apparent_temperature);
  const emoji = codeToEmoji(data.current.weathercode);

  return { city: city.name, emoji, tempC, feelsLikeC, desc: emojiToDesc(emoji, tempC) };
}

export async function fetchWeather(): Promise<CityWeather[] | null> {
  const results = await Promise.allSettled(CITIES.map(fetchCurrentWeather));
  const cities = results
    .filter((r): r is PromiseFulfilledResult<CityWeather> => r.status === "fulfilled")
    .map((r) => r.value);
  return cities.length > 0 ? cities : null;
}
