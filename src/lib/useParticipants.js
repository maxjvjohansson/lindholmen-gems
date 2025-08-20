"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useParticipants(sessionId) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("session_id", sessionId);
      if (!cancelled && !error) setParticipants(data || []);
    }
    load();

    const channel = supabase
      .channel(`participants_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
          filter: `session_id=eq.${sessionId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return { participants, count: participants.length };
}
