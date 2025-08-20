"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinByCode } from "@/lib/sessionApi";
import { getOrCreateDeviceId } from "@/lib/deviceId";
import Button from "../Button/Button";

export default function JoinLobby() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleJoin(e) {
    e?.preventDefault();
    if (code.length < 4) return;
    setLoading(true);
    setErr("");
    try {
      const sess = await joinByCode(code, getOrCreateDeviceId());
      router.push(`/quest?session=${sess.id}`);
    } catch {
      setErr("No active session found with that code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          size="lg"
          className="w-full cursor-pointer"
        >
          Join a walk
        </Button>
      ) : (
        <form onSubmit={handleJoin} className="grid gap-2">
          <label htmlFor="join-code" className="text-sm text-slate-600">
            Enter team code
          </label>
          <input
            id="join-code"
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="4 digits"
            className="rounded-xl border border-slate-300 px-3 py-2 text-center tracking-widest text-lg"
            aria-invalid={!!err}
            aria-describedby={err ? "join-error" : undefined}
          />
          {err && (
            <p id="join-error" className="text-sm text-red-600">
              {err}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setErr("");
                setCode("");
              }}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 cursor-pointer font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || code.length < 4}
              className={`flex-1 rounded-xl py-2.5 font-semibold cursor-pointer ${
                loading || code.length < 4
                  ? "bg-slate-200 text-slate-500"
                  : "text-white bg-gradient-to-r from-[#449467] to-[#357450] hover:opacity-90 transition"
              }`}
              aria-disabled={loading || code.length < 4}
            >
              {loading ? "Joining…" : "Join"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
