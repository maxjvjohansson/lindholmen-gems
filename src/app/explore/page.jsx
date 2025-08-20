import ExploreClient from "./ExploreClient";

export default function ExplorePage({ searchParams }) {
  const step = Number(searchParams?.step) || 1;

  return <ExploreClient currentStep={step} />;
}
