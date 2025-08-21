"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import { useParticipants } from "@/lib/useParticipants";
import { useSessionProgress } from "@/lib/useSessionProgress";

export default function ProgressOverlay({ total = 4 }) {
  return (
    <Suspense fallback={null}>
      <OverlayContent total={total} />
    </Suspense>
  );
}

function OverlayContent({ total }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  if (!sessionId) {
    router.replace("/");
    return null;
  }

  const { count } = useParticipants(sessionId);
  const { step, loading } = useSessionProgress(sessionId);

  if (loading) return null;

  const percent = Math.min(100, Math.max(0, (step / total) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <ProgressBar value={percent} label={`${step}/${total}`} />
      </div>
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <span className="rounded-full bg-white/90 border px-3 py-1 text-sm shadow">
          {count} People
        </span>
      </div>
    </div>
  );
}
