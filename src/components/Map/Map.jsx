"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix för marker-ikoner i Next.js
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

export default function Map({
  center = [57.706028, 11.936274],
  zoom = 15,
  minZoom = 3,
  maxZoom = 19,
  className,
  markerPosition,
  circleRadiusMeters = 50,
  markerPopup,
}) {
  const [userPosition, setUserPosition] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon2x?.src || icon2x,
      iconUrl: icon?.src || icon,
      shadowUrl: shadow?.src || shadow,
    });
  }, []);

  // Haversine-formeln för avstånd
  function getDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Följ användarens position
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition([latitude, longitude]);

        if (markerPosition) {
          const distance = getDistanceMeters(
            latitude,
            longitude,
            markerPosition[0],
            markerPosition[1]
          );
          setUnlocked(distance <= circleRadiusMeters);
        }
      },
      (err) => {
        if (err.code === 3) {
          console.warn("Geolocation timeout, trying again...");
        } else {
          console.error("Geolocation error:", err);
        }
      },
      {
        enableHighAccuracy: true, // kan sättas false om det tar för lång tid
        maximumAge: 5000, // accepterar positioner upp till 5 sek gamla
        timeout: 20000, // ökar timeout till 20 sekunder
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [markerPosition, circleRadiusMeters]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      scrollWheelZoom={true}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution="Tiles © Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={maxZoom}
        minZoom={minZoom}
      />

      {/* Target marker */}
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>{markerPopup || "Target location"}</Popup>
        </Marker>
      )}

      {/* Optional Circle */}
      {markerPosition && circleRadiusMeters && (
        <Circle
          center={markerPosition}
          radius={circleRadiusMeters}
          pathOptions={{ color: unlocked ? "green" : "red", fillOpacity: 0.1 }}
        />
      )}

      {/* User marker */}
      {userPosition && (
        <Marker position={userPosition}>
          <Popup>
            {unlocked
              ? "✅ You are at the target location!"
              : `❌ Move closer to unlock. Radius: ${circleRadiusMeters}m`}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
