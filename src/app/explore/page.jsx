import ExploreClient from "./ExploreClient";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-center">Loading Explore...</div>}
    >
      <ExploreClient />
    </Suspense>
  );
}
