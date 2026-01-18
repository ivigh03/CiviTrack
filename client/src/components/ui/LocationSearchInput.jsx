import { useState } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";
import Input from "./Input";

// Standalone Geoapify address search — sets {lat, lng} on selection.
// Mirrors the inline location-search pattern in ComplaintForm.jsx, kept
// separate so this component can be reused without touching that flow.
export default function LocationSearchInput({ value, onChange, label = "Location", placeholder = "Search location..." }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = async (text) => {
    setQuery(text);

    if (!text) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://api.geoapify.com/v1/geocode/autocomplete", {
        params: {
          text,
          apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
        },
      });

      setSuggestions(res.data.features);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (place) => {
    const lat = place.geometry.coordinates[1];
    const lng = place.geometry.coordinates[0];

    onChange({ lat, lng });
    setQuery(place.properties.formatted);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <Input
        label={label}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">
          {suggestions.map((place, index) => (
            <div
              key={index}
              className="cursor-pointer px-3.5 py-2.5 text-sm text-foreground hover:bg-elevated"
              onClick={() => handleSelect(place)}
            >
              {place.properties.formatted}
            </div>
          ))}
        </div>
      )}

      {value?.lat != null && value?.lng != null && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
