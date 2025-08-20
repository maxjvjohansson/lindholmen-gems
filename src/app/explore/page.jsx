// app/explore/page.jsx
import ExploreClient from "./ExploreClient";
import { Suspense } from "react";

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Loading Explore...</div>}>
      <ExploreClient />
    </Suspense>
  );
}
