import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { motion } from "framer-motion";
import HeatLayer from "./HeatLayer";
import { getComplaintLocations } from "../api/complaintApi";

const SEVERITY_INTENSITY = {
  low: 0.3,
  medium: 0.6,
  high: 1,
};

export default function HeatmapView() {
  const [points, setPoints] = useState(null); // null = loading

  useEffect(() => {
    getComplaintLocations()
      .then((locations) => {
        const valid = (locations || []).filter(
          (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)
        );
        setPoints(valid);
      })
      .catch((err) => {
        console.error("HEATMAP FETCH ERROR:", err);
        setPoints([]);
      });
  }, []);

  if (points === null) {
    return <p>Loading heatmap...</p>;
  }

  if (points.length === 0) {
    return <p>No location data yet — submit a complaint with a location to see it here.</p>;
  }

  const center = [
    points.reduce((sum, p) => sum + p.lat, 0) / points.length,
    points.reduce((sum, p) => sum + p.lng, 0) / points.length,
  ];

  const heatPoints = points.map((p) => [
    p.lat,
    p.lng,
    SEVERITY_INTENSITY[p.severity] || 0.5,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer points={heatPoints} options={{ radius: 25, blur: 15 }} />
      </MapContainer>
    </motion.div>
  );
}
