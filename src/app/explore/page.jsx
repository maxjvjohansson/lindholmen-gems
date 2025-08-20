import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

// Simpler approach: let the client handle search params
export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="w-full h-screen bg-gray-100 animate-pulse" />}
    >
      <ExploreClient />
    </Suspense>
  );
}
