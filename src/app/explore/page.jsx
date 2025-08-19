"use client";

import dynamic from "next/dynamic";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

// Dynamically import to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-md" />,
});

export default function ExplorePage() {
  return (
    <section className="w-full p-0">
      <div
        className="relative w-full p-0 mt-[72px]"
        style={{ height: "calc(100vh - 72px)" }}
      >
        <Map
          className="w-full h-full"
          zoom={16}
          minZoom={16}
          restrictPanning
          restrictToInitialView
        />
      </div>
      <div className="fixed top-0 left-0 right-0 z-10 p-4 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <ProgressBar value={30} label="1/4" />
        </div>
      </div>
    </section>
  );
}
