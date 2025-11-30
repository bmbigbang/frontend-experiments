"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer } from "leaflet";
import { WeatherLayerConfig, OpenWeatherLayerId } from "@/app/services/types";
import { WeatherLayerLegend } from "./WeatherLayerLegend";
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
  zoom = 5,
  basemapId = "ArcGIS:Streets",
  weatherLayers = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const weatherTileLayersRef = useRef<TileLayer[]>([]);

  const [activeLayerIds, setActiveLayerIds] = useState<OpenWeatherLayerId[]>([]);

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
      const { vectorBasemapLayer } = esriVectorModule;

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

      map.zoomControl.setPosition("topright");

      // set default active layers
      setActiveLayerIds(["precipitation_new", "clouds_new"])
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
  }, [center?.[0], center?.[1], zoom, basemapId]);

  // Effect to apply OpenWeather layers whenever:
  // - the map is ready
  // - the list of available weatherLayers changes
  // - the activeLayerIds state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing OpenWeather tile layers from the map
    removeOpenWeatherLayers(map, weatherTileLayersRef.current);
    weatherTileLayersRef.current = [];

    if (!weatherLayers.length || !activeLayerIds.length) return;

    (async () => {
      const leafletModule = await import("leaflet");
      const L = leafletModule.default ?? leafletModule;

      // Only add tile layers for the currently active IDs
      const activeConfigs = weatherLayers.filter((layer) =>
          activeLayerIds.includes(layer.id),
      );

      if (!activeConfigs.length) return;

      weatherTileLayersRef.current = addOpenWeatherLayers(
          map,
          activeConfigs,
          (urlTemplate, opacity) =>
              L.tileLayer(urlTemplate, {
                opacity,
                attribution:
                    '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
              }) as TileLayer,
      );
    })();
  }, [weatherLayers, activeLayerIds]);

  const handleToggleLayer = useCallback(
      (layerId: OpenWeatherLayerId) => {
        setActiveLayerIds((prev) =>
            prev.includes(layerId)
                ? prev.filter((id) => id !== layerId)
                : [...prev, layerId],
        );
      },
      [],
  );

  return (
      <div style={{ width }}>

        <div className="pointer-events-none left-1/2 flex pb-8 justify-center">
          <div className="pointer-events-auto">
            <WeatherLayerLegend
                layers={weatherLayers}
                activeLayerIds={activeLayerIds}
                onToggleLayer={handleToggleLayer}
            />
          </div>
        </div>

        <div
            ref={mapContainerRef}
            style={{
              height,
              width: "100%",
            }}
        />
      </div>
  );
};

export default ArcgisLeafletMap;