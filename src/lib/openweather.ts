import { supabase } from "@/integrations/supabase/client";

export type WeatherParams = {
  city?: string;
  lat?: number;
  lon?: number;
  endpoint?: "weather" | "forecast";
  units?: "metric" | "imperial";
};

export async function getWeather(params: WeatherParams) {
  const { data, error } = await supabase.functions.invoke("openweather", {
    body: params,
  });
  if (error) throw new Error(error.message || "Weather fetch failed");
  return data;
}

// Example usage:
// const data = await getWeather({ city: "London", endpoint: "weather", units: "metric" });
