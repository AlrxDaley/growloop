// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured: missing OPENWEATHER_API_KEY" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => ({}));

    const endpoint = (body.endpoint ?? "weather") as string; // "weather" | "forecast"
    const units = (body.units ?? "metric") as string; // "metric" | "imperial"
    const { city, lat, lon } = body as { city?: string; lat?: number; lon?: number };

    if (!city && (lat === undefined || lon === undefined)) {
      return new Response(
        JSON.stringify({ error: "Provide either 'city' or both 'lat' and 'lon'." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const base = endpoint === "forecast"
      ? "https://api.openweathermap.org/data/2.5/forecast"
      : "https://api.openweathermap.org/data/2.5/weather";

    const params = new URLSearchParams({ appid: apiKey, units });
    if (city) params.set("q", city);
    else {
      params.set("lat", String(lat));
      params.set("lon", String(lon));
    }

    const url = `${base}?${params.toString()}`;
    const owRes = await fetch(url);
    const text = await owRes.text();

    return new Response(text, {
      status: owRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: String(err?.message ?? err) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
