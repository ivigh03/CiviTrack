import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

function MapView({ lat, lng }) {
  const position = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
      <ChangeView center={position} />
    </MapContainer>
  );
}

export default MapView;