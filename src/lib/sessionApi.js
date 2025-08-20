import { supabase } from "./supabaseClient";

export async function joinByCode(code, deviceId, displayName = "Gäst") {
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
