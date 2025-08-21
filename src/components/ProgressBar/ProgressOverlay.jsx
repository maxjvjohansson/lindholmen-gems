"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import { useParticipants } from "@/lib/useParticipants";
import { useSessionProgress } from "@/lib/useSessionProgress";
import { supabase } from "@/lib/supabaseClient";
import PlayerIcon from "@/assets/icons/player.svg";
import HashtagIcon from "@/assets/icons/hash.svg";

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
  const codeFromUrl = searchParams.get("code");

  useEffect(() => {
    if (!sessionId) router.replace("/");
  }, [sessionId, router]);
  if (!sessionId) return null;

  const { count } = useParticipants(sessionId);
  const { step, loading } = useSessionProgress(sessionId);

  const [code, setCode] = useState(codeFromUrl || "----");
  useEffect(() => {
    let cancelled = false;
    if (codeFromUrl) {
      setCode(codeFromUrl);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("code")
        .eq("id", sessionId)
        .single();
      if (!cancelled && !error && data?.code) setCode(data.code);
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, codeFromUrl]);

  if (loading) return null;

  const percent = Math.min(100, Math.max(0, (step / total) * 100));

  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-4 bg-orange-50 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <ProgressBar key={step} value={percent} label={`${step}/${total}`} />
      </div>
      <div className="absolute top-3 right-3 z-10 flex flex-row items-center gap-3">
        <span className="text-sm flex items-center gap-1">
          <PlayerIcon /> {count}
        </span>
        <span className="text-sm flex items-center gap-1">
          <HashtagIcon /> {code}
        </span>
      </div>
    </div>
  );
}
