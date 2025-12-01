import React, { RefObject, useEffect, useState } from "react";
import { ArcgisPlace, MapBoundingBox } from "@/app/types";
import type { LayerGroup, Map as LeafletMap } from "leaflet";


export const usePlaces = (mapInstanceRef: RefObject<LeafletMap | null>,
    placesLayerRef: RefObject<LayerGroup | null>, mapBounds: MapBoundingBox | null) => {

  const [placesError, setPlacesError] = useState<string | null>(null);

  useEffect(() => {
    const map = mapInstanceRef?.current;
    if (!map) return;

    (async () => {
      const bounds = map.getBounds();
      if (Math.abs(bounds.getWest() - bounds.getEast()) >= 0.17996 || Math.abs(bounds.getSouth() - bounds.getNorth()) >= 0.17996) {
        setPlacesError("Cannot retrieve places due to large zoom level")
        return;
      }

      const leafletModule = await import("leaflet");
      const L = leafletModule.default ?? leafletModule;

      if (!placesLayerRef.current) {
        placesLayerRef.current = L.layerGroup().addTo(map);
      }

      placesLayerRef.current.clearLayers();

      setPlacesError(null)
      const url = `/api/places?xmin=${ bounds.getWest() }&xmax=${ bounds.getEast() }&ymin=${ bounds.getSouth() }&ymax=${ bounds.getNorth() }`;

      const places = await (await fetch(url)).json();

      places.results.forEach((place: ArcgisPlace) => {
        const lat = place.location.y;
        const lng = place.location.x;

        const primaryCategory = place.categories?.[0]?.label;

        const popupHtml = `
          <div>
            <strong>${ place.name }</strong><br/>
            ${ primaryCategory ? `<span>${ primaryCategory }</span><br/>` : "" }
            <small>${ lat.toFixed(5) }, ${ lng.toFixed(5) }</small>
          </div>
        `;

        const zoom = map.getZoom();
        const baseSize = 22;
        const iconSize = baseSize * Math.pow(1.1, zoom - 13);

        const marker = L.marker(
            [lat, lng],
            {icon: L.icon({iconUrl: place.icon.url, iconSize: [iconSize, iconSize], iconAnchor: [iconSize / 2, iconSize / 2] })}
        ).bindPopup(popupHtml);

        placesLayerRef.current!.addLayer(marker);
      });
    })()
  }, [mapBounds]);

  return placesError
}

export const updateBounds = (map: LeafletMap, setMapBounds: React.Dispatch<MapBoundingBox>) => {
  const b = map.getBounds();
  setMapBounds({
    west: b.getWest(),
    east: b.getEast(),
    south: b.getSouth(),
    north: b.getNorth(),
  });
};
