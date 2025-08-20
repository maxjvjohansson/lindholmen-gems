import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = "force-dynamic";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-center">Loading Explore...</div>}
    >
      <ExploreClient />
    </Suspense>
  );
}
