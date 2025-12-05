import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Or .css if not using webpack
import 'leaflet-defaulticon-compatibility'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

const geocodeCache = JSON.parse(localStorage.getItem("geocodeCache") || "{}");

function AutoFitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;


    const latLngs = positions.map(item => L.latLng(item.pos.lat, item.pos.lng));

    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [40, 40] }); // Add some padding

  }, [positions, map]);

  return null;
}


export async function geocodeRegion(region) {

  const key = region.trim().toLowerCase();

  if (key in geocodeCache) {
    return geocodeCache[key];
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(region)}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "YourApp/1.0" }
  });
  const data = await res.json();

  if (!data || data.length === 0) {
    console.warn("No geocode results for:", region);
    return null;
  }

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);

  geocodeCache[key] = { lat, lng };
  localStorage.setItem("geocodeCache", JSON.stringify(geocodeCache));

  return {
    lat: lat,
    lng: lng
  };
}

export default function MapView({ houses }) {

  const [positions, setPositions] = useState([]);

useEffect(() => {
  if (!houses.length) return;

  const load = async () => {
    const posArray = await Promise.all(
      houses.map(h => geocodeRegion(h.region))
    );
    const validPositions = posArray
      .map((pos, index) => (pos ? { pos, index } : null))
      .filter(item => item !== null);

    setPositions(validPositions);
  };

  load();
}, [houses]);

return (
  <>
    {positions.length > 0 && (
      <MapContainer
        center={[positions[0].pos.lat, positions[0].pos.lng]}
        zoom={12}
        style={{ height: "500px", width: "50%", margin: "0 auto" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AutoFitBounds positions={positions} />

        {positions.map(({pos, index}) => (
          <Marker key={`map-${index}`} position={[pos.lat, pos.lng]}>
            <Popup>{houses[index]?.region}</Popup>
          </Marker>
        ))}
      </MapContainer>
    )}
  </>
);

}
