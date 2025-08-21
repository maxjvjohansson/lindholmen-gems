"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSessionProgress(
  sessionId,
  { enablePolling = true, pollingInterval = 2000 } = {}
) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const channelRef = useRef(null);
  const pollingRef = useRef(null);
  const lastStepRef = useRef(1);

  const loadCurrentStep = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("current_step")
        .eq("id", sessionId)
        .single();

      if (!error && data) {
        const newStep = data.current_step ?? 1;
        if (newStep !== lastStepRef.current) {
          setStep(newStep);
          lastStepRef.current = newStep;
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading current step:", err);
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    function startPolling() {
      if (pollingRef.current) clearInterval(pollingRef.current);

      pollingRef.current = setInterval(() => {
        if (!isRealtimeConnected && enablePolling) {
          loadCurrentStep();
        }
      }, pollingInterval);
    }

    function setupRealtimeSubscription() {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`session_progress_${sessionId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "sessions",
            filter: `id=eq.${sessionId}`,
          },
          (payload) => {
            if (payload.eventType === "UPDATE" && payload.new) {
              const newStep = payload.new.current_step;
              if (
                newStep !== undefined &&
                newStep !== null &&
                newStep !== lastStepRef.current
              ) {
                setStep(newStep);
                lastStepRef.current = newStep;
              }
            }
          }
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            setIsRealtimeConnected(true);
          } else if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT" ||
            status === "CLOSED"
          ) {
            setIsRealtimeConnected(false);
          }

          if (err) {
            console.error("Realtime error:", err);
            setIsRealtimeConnected(false);
          }
        });

      channelRef.current = channel;
    }

    loadCurrentStep();

    setupRealtimeSubscription();
    if (enablePolling) {
      startPolling();
    }

    return () => {
      cancelled = true;

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [
    sessionId,
    enablePolling,
    pollingInterval,
    isRealtimeConnected,
    loadCurrentStep,
  ]);

  const updateStep = useCallback(
    async (newStep) => {
      if (!sessionId) return;

      try {
        const { error } = await supabase
          .from("sessions")
          .update({ current_step: newStep })
          .eq("id", sessionId);

        if (error) throw error;

        setStep(newStep);
        lastStepRef.current = newStep;
      } catch (error) {
        console.error("Error updating step:", error);
      }
    },
    [sessionId]
  );

  return {
    step,
    loading,
    updateStep,
    isRealtimeConnected,
  };
}
