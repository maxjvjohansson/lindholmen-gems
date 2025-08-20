import { Suspense } from "react";
import ExploreClientWrapper from "./ExploreClientWrapper";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="w-full h-screen bg-gray-100 animate-pulse" />}
    >
      <ExploreClientWrapper />
    </Suspense>
  );
}
