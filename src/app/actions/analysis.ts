"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";

export async function deleteMyAnalysisSessionsAction() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("analysis_sessions")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/career-analyser");
  revalidatePath("/dashboard");

  return { success: true };
}
