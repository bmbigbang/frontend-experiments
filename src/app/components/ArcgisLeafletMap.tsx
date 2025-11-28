"use client";

import React, { useEffect, useRef } from "react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import type { WeatherLayerConfig } from "../services/types";
import {
  addOpenWeatherLayers,
  removeOpenWeatherLayers,
} from "../services/openWeather";

type ArcgisLeafletMapProps = {
  height?: string;
  width?: string;
  /** [lat, lng] */
  center?: [number, number];
  zoom?: number;
  /** ArcGIS basemap id (e.g. "ArcGIS:Topographic", "ArcGIS:Streets", etc.) */
  basemapId?: string;
  /** OpenWeather tile layers passed from the server */
  weatherLayers?: WeatherLayerConfig[];
};

const ArcgisLeafletMap: React.FC<ArcgisLeafletMapProps> = ({
  height = "400px",
  width = "100%",
  center = [37.7749, -122.4194], // San Francisco
  zoom = 6,
  basemapId = "ArcGIS:Streets",
  weatherLayers = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const weatherTileLayersRef = useRef<TileLayer[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === "undefined") return;
    if (mapInstanceRef.current) return; // prevent re-init

    // Dynamically import Leaflet only on the client
    let isCancelled = false;

    (async () => {
      const [leafletModule, esriVectorModule] = await Promise.all([
        import("leaflet"),
        import("esri-leaflet-vector"),
      ]);
      const L = leafletModule.default ?? leafletModule;
      const { vectorBasemapLayer } = esriVectorModule as typeof import("esri-leaflet-vector");

      if (!mapContainerRef.current || isCancelled) return;

      const apiKey = process.env
          .NEXT_PUBLIC_ARCGIS_LOCATION_API_KEY as string | undefined;

      if (!apiKey) {
        // eslint-disable-next-line no-console
        console.error(
            "Missing NEXT_PUBLIC_ARCGIS_LOCATION_API_KEY. Please set it in your .env file.",
        );
        return;
      }

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
      }) as LeafletMap;
      mapInstanceRef.current = map;

      vectorBasemapLayer(basemapId, {
        apiKey,
      }).addTo(map);

      if (weatherLayers.length > 0) {
        weatherTileLayersRef.current = addOpenWeatherLayers(
            map,
            weatherLayers,
            (urlTemplate, opacity) =>
                L.tileLayer(urlTemplate, {
                  opacity,
                  attribution:
                      '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
                }) as TileLayer,
        );
      }

      map.zoomControl.setPosition("topright");
    })();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        removeOpenWeatherLayers(
            mapInstanceRef.current,
            weatherTileLayersRef.current,
        );
        weatherTileLayersRef.current = [];
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.[0], center?.[1], zoom, basemapId, weatherLayers]);

  return (
      <div
          ref={mapContainerRef}
          style={{
            height,
            width,
          }}
      />
  );
};

export default ArcgisLeafletMap;