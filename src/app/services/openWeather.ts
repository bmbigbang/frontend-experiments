import { openWeatherLayerId, OpenWeatherLayerId, OpenWeatherLayerName, WeatherLayerConfig } from "@/app/types";
import type { Map as LeafletMap, TileLayer } from "leaflet";


export async function getOpenWeatherLayerConfigs(
    layerIds: readonly OpenWeatherLayerId[] = openWeatherLayerId,
): Promise<WeatherLayerConfig[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error(
        "Missing OPENWEATHER_API_KEY. Please set it in your .env file.",
    );
  }

  return layerIds.map(
      (layerId) => ({
        id: layerId,
        urlTemplate: `https://tile.openweathermap.org/map/${ layerId }/{z}/{x}/{y}.png?appid=${ apiKey }`,
        opacity: 0.8,
        label: OpenWeatherLayerName[layerId]
      }),
  );
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