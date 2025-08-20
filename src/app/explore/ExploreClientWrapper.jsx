"use client";
import { useSearchParams } from "next/navigation";
import ExploreClient from "./ExploreClient";

export default function ExploreClientWrapper() {
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step")) || 1;

  return <ExploreClient currentStep={currentStep} />;
}
