import { supabase } from "./supabaseClient";

export async function createSession(opts = {}) {
  const {
    routeId = "lunch_30",
    durationMin = null,
    players = null,
    stops = null,
  } = typeof opts === "string" ? { routeId: opts } : opts;

  const genCode = () => String(Math.floor(1000 + Math.random() * 9000));

  for (let i = 0; i < 5; i++) {
    const code = genCode();
    const payload = { code, route_id: routeId };
    if (durationMin != null) payload.duration_min = durationMin;
    if (players != null) payload.players = players;
    if (stops != null) payload.stops = stops;

    const { data, error } = await supabase
      .from("sessions")
      .insert(payload)
      .select()
      .single();

    if (!error && data) return data;

    const msg = (error?.message || "").toLowerCase();
    const pgcode = error?.code;
    const isUnique =
      pgcode === "23505" || msg.includes("duplicate") || msg.includes("unique");
    if (!isUnique) throw error;
  }

  throw new Error("Failed to create a unique session code. Please try again.");
}

export async function joinByCode(code, deviceId, displayName = "Guest") {
  const { data: sess, error: e1 } = await supabase
    .from("sessions")
    .select("*")
    .eq("code", code)
    .single();

  if (e1 || !sess) throw new Error("Session not found");

  const { error: e2 } = await supabase.from("participants").insert({
    session_id: sess.id,
    device_id: deviceId,
    display_name: displayName,
  });

  if (e2 && !/duplicate|unique/i.test(e2.message)) throw e2;

  return sess;
}

export async function getSession(sessionId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();
  if (error) throw error;
  return data;
}

export async function getSessionProgress(sessionId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, current_step")
    .eq("id", sessionId)
    .single();
  if (error) throw error;
  return data;
}

export async function setSessionStep(sessionId, step) {
  const { data, error } = await supabase
    .from("sessions")
    .update({ current_step: step })
    .eq("id", sessionId)
    .select("id, current_step")
    .single();
  if (error) throw error;
  return data;
}

export async function advanceSessionStep(sessionId) {
  const { data: s0, error: e0 } = await supabase
    .from("sessions")
    .select("current_step")
    .eq("id", sessionId)
    .single();
  if (e0) throw e0;

  const next = (s0?.current_step ?? 1) + 1;

  const { data, error } = await supabase
    .from("sessions")
    .update({ current_step: next })
    .eq("id", sessionId)
    .select("id, current_step")
    .single();
  if (error) throw error;
  return data;
}
