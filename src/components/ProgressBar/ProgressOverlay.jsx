"use client";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

export default function ProgressOverlay({
  total = 4,
  storageKey = "progressStep",
}) {
  const searchParams = useSearchParams();
  const stepFromUrl = Number(searchParams.get("step"));
  const stored =
    typeof window !== "undefined"
      ? Number(localStorage.getItem(storageKey))
      : NaN;
  const step = useMemo(() => stepFromUrl || stored || 1, [stepFromUrl, stored]);

  useEffect(() => {
    if (!isNaN(stepFromUrl))
      localStorage.setItem(storageKey, String(stepFromUrl));
  }, [stepFromUrl]);

  const percent = Math.min(100, Math.max(0, (step / total) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <ProgressBar value={percent} label={`${step}/${total}`} />
      </div>
    </div>
  );
}
