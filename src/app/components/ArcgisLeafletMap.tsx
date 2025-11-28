"use client";

import React, { useEffect, useRef } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { vectorBasemapLayer } from "esri-leaflet-vector";

type ArcgisLeafletMapProps = {
  height?: string;
  width?: string;
  /** [lat, lng] */
  center?: [number, number];
  zoom?: number;
  /** ArcGIS basemap id (e.g. "ArcGIS:Topographic", "ArcGIS:Streets", etc.) */
  basemapId?: string;
};

const ArcgisLeafletMap: React.FC<ArcgisLeafletMapProps> = ({
  height = "400px",
  width = "100%",
  center = [40.7128, -74.006],
  zoom = 10,
  basemapId = "ArcGIS:Streets",
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === "undefined") return;
    if (mapInstanceRef.current) return; // prevent re-init

    const apiKey = process.env
        .NEXT_PUBLIC_ARCGIS_LOCATION_API_KEY as string | undefined;

    if (!apiKey) {
      console.error(
          "Missing NEXT_PUBLIC_ARCGIS_LOCATION_API_KEY. Please set it in your .env file.",
      );
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
    });
    mapInstanceRef.current = map;

    vectorBasemapLayer(basemapId, {
      apiKey,
    }).addTo(map);

    map.zoomControl.setPosition("topright");

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom, basemapId]);

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