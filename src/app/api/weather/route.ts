import { fetchWeather } from "@/lib/weather";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const weather = await fetchWeather();
    return NextResponse.json(weather);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
