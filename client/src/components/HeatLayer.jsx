import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatLayer({ points, options }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const layer = L.heatLayer(points, options).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, points, options]);

  return null;
}
