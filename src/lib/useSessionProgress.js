"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSessionProgress(sessionId) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("sessions")
        .select("current_step")
        .eq("id", sessionId)
        .single();
      if (!cancelled && !error && data) {
        setStep(data.current_step ?? 1);
        setLoading(false);
      }
    }
    load();

    const ch = supabase
      .channel(`sess_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => setStep(payload.new.current_step ?? 1)
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [sessionId]);

  const updateStep = useCallback(
    async (newStep) => {
      if (!sessionId) return;
      const { error } = await supabase
        .from("sessions")
        .update({ current_step: newStep })
        .eq("id", sessionId);

      if (!error) {
        setStep(newStep);
      } else {
        console.error("Failed to update step", error);
      }
    },
    [sessionId]
  );

  return { step, loading, updateStep };
}
