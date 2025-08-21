"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession, joinByCode } from "@/lib/sessionApi";
import { getOrCreateDeviceId } from "@/lib/deviceId";
import Button from "@/components/Button/Button";

import MinusIcon from "@/assets/icons/minus.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import BackIcon from "@/assets/icons/back_icon.svg";
import Header from "@/components/Header/Header";
import Image from "next/image";

function Row({ label, sub, value, onInc, onDec }) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={onDec}
        className="p-0 m-0 bg-transparent border-none"
      >
        <MinusIcon
          className="w-11 h-11 block pointer-events-none"
          aria-hidden="true"
        />
      </button>

      <div className="text-center">
        <div className="text-2xl">{value}</div>
        <div className="text-sm text-slate-500">{sub}</div>
      </div>

      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={onInc}
        className="p-0 m-0 bg-transparent border-none"
      >
        <PlusIcon
          className="w-11 h-11 block pointer-events-none"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default function ConfigPage() {
  const router = useRouter();

  const [duration, setDuration] = useState(30);
  const [players, setPlayers] = useState(5);
  const [stops, setStops] = useState(4);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  async function handleGenerate() {
    setLoading(true);
    setErr("");
    try {
      const session = await createSession({
        routeId: "lunch_30",
        durationMin: duration,
        players,
        stops,
      });
      await joinByCode(session.code, getOrCreateDeviceId(), "Leader");
      router.push(
        `/start?session=${session.id}&code=${session.code}&players=${players}&stops=${stops}`
      );
    } catch (e) {
      console.error(e);
      setErr("Could not create session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-[88vh] h-screen flex flex-col items-center bg-gradient-to-b from-[#FAF3EB]/50 to-[#FFE3CA]">
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="absolute top-4 left-4 grid h-9 w-9 place-items-center rounded-full border-0 text-slate-700 hover:bg-slate-50"
      >
        <BackIcon />
      </button>

      <Header />

      <div className="mx-auto w-full max-w-sm px-12">
        <div className="text-center justify-start text-gray-800 text-2xl font-normal font-['Quicksand'] leading-loose">
          Set up your perfect walk
        </div>

        <Image
          src="/progress_bar.svg"
          alt="Image of a progress bar"
          width={300}
          height={300}
        />

        <form className="grid gap-6">
          <Row
            label="Players"
            sub="Players"
            value={players}
            onInc={() => setPlayers((v) => clamp(v + 1, 2, 8))}
            onDec={() => setPlayers((v) => clamp(v - 1, 2, 8))}
          />
          <Row
            label="Stops"
            sub="Stops"
            value={stops}
            onInc={() => setStops((v) => clamp(v + 1, 3, 6))}
            onDec={() => setStops((v) => clamp(v - 1, 3, 6))}
          />

          {err && <p className="text-sm text-red-600">{err}</p>}

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            variant="primary"
            size="lg"
            className="mt-2 w-full rounded-xl py-3 font-semibold"
          >
            {loading ? "Generating…" : "Generate Walk"}
          </Button>

          <p className="text-center text-xs text-slate-500">
            A 4-digit team code will be generated and shared with your group.
          </p>
        </form>
      </div>
    </section>
  );
}
