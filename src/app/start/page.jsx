"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button/Button";
import RefreshIcon from "@/assets/icons/refresh.svg";
import BackIcon from "@/assets/icons/back_icon.svg";

export default function StartPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <StartPageContent />
    </Suspense>
  );
}

function StartPageContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const sessionId = sp.get("session");
  const code = sp.get("code") || "----";

  const players = Number(sp.get("players")) || 1;
  const stops = Number(sp.get("stops")) || 4;
  const [durationMin] = useState(30);
  const [distanceKm] = useState(1.5);
  const [spin, setSpin] = useState(false);

  const shareUrl = useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/join?code=${code}`;
  }, [code]);

  function copy(val) {
    navigator.clipboard?.writeText(val);
  }

  async function regenerateRoute() {
    setSpin(true);
    setTimeout(() => setSpin(false), 600);
  }

  return (
    <section className="min-h-[88vh] h-screen flex items-start bg-gradient-to-b from-[#FAF3EB]/50 to-[#FFE3CA]">
      <div className="mx-auto w-full max-w-sm p-6 grid gap-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full border-0 text-slate-700 hover:bg-slate-50"
          >
            <BackIcon />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#1F2937]">Team code</span>
            <button
              onClick={() => copy(code)}
              className="w-20 h-7 bg-gradient-to-r from-[#FFA656] to-[#CF711C] rounded-2xl text-sm text-orange-50"
              title="Copy team code"
            >
              {code}
            </button>
          </div>
        </div>
        <div className="text-center justify-start text-gray-800 text-2xl font-normal font-['Quicksand'] leading-loose">
          You have chosen
        </div>
        <div className="grid grid-cols-2 gap-6 text-center">
          <Stat top={players} label="Players" />
          <Stat top={`${durationMin} min`} label="Walking time" />
          <Stat top={stops} label="Stops" />
          <Stat top={`${distanceKm}km`} label="Total distance" />
        </div>
        <div className="flex flex-col items-center">
          <div className="aspect-square w-[250px] h-[250px] bg-[url('/map_preview.png')] bg-cover bg-center" />
        </div>

        <div className="flex items-center justify-end gap-2 text-slate-700">
          <button
            onClick={regenerateRoute}
            className="inline-flex items-center gap-3"
          >
            <span>Generate new route</span>
            <RefreshIcon
              className={spin ? "animate-spin" : ""}
              fontSize="small"
            />
          </button>
        </div>

        <div className="mt-2">
          <Button
            href={`/explore?session=${sessionId}`}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Start
          </Button>
        </div>
      </div>
    </section>
  );
}

function Stat({ top, label }) {
  return (
    <div className="grid">
      <div className="text-2xl">{top}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
