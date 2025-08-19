"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Best-effort fix to ensure default marker icons load correctly in Next.js
// by explicitly providing the asset URLs bundled by the build tool.
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

export default function Map({
  center = [57.706028, 11.936274],
  zoom = 15,
  minZoom = 3,
  maxZoom = 19,
  className,
}) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon2x?.src || icon2x,
      iconUrl: icon?.src || icon,
      shadowUrl: shadow?.src || shadow,
    });
  }, []);

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
        attribution="Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={maxZoom}
        minZoom={minZoom}
      />
    </MapContainer>
  );
}
