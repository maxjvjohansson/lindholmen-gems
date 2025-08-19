"use client";

import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-md" />,
});

export default function ExplorePage() {
  return (
    <section className="w-full p-0">
      <div className="w-full max-w-2xl mx-auto px-6 mt-10">
        <div className="w-full h-[180px]">
          <Map
            className="w-full h-full"
            zoom={15}
            minZoom={15}
            restrictPanning
            restrictToInitialView
          />
        </div>
      </div>
    </section>
  );
}
