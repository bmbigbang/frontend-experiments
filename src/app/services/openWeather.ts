import { WeatherLayerConfig } from "@/app/services/types";
import type { Map as LeafletMap, TileLayer } from "leaflet";


const OPENWEATHER_LAYERS = [
  "precipitation_new",
  "pressure_new",
  "wind_new",
] as const;

export async function getOpenWeatherLayerConfigs(): Promise<
    WeatherLayerConfig[]
> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error(
        "Missing OPENWEATHER_API_KEY. Please set it in your .env file.",
    );
  }

  const testUrl = `https://tile.openweathermap.org/map/${OPENWEATHER_LAYERS[0]}/0/0/0.png?appid=${apiKey}`;
  const response = await fetch(testUrl, { method: "GET" });

  if (!response.ok) {
    console.error(
        "Failed to validate OpenWeather API key",
        response.status,
        response.statusText,
    );
  }

  const weatherLayers: WeatherLayerConfig[] = OPENWEATHER_LAYERS.map(
      (layerId) => ({
        id: layerId,
        urlTemplate: `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${apiKey}`,
        opacity: 0.6,
      }),
  );

  return weatherLayers;
}


export function addOpenWeatherLayers(
    map: LeafletMap,
    layers: WeatherLayerConfig[],
    createTileLayer: (urlTemplate: string, opacity: number) => TileLayer,
): TileLayer[] {
  return layers.map((layerConfig) => {
    const { urlTemplate, opacity = 0.6 } = layerConfig;

    const tileLayer = createTileLayer(urlTemplate, opacity);
    tileLayer.addTo(map);

    return tileLayer;
  });
}

export function removeOpenWeatherLayers(
    map: LeafletMap,
    tileLayers: TileLayer[],
): void {
  tileLayers.forEach((layer) => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
}