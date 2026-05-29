"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { revalidatePath } from "next/cache";

// Define strict validation schema for profile updates
const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name cannot exceed 50 characters.")
    .trim(),
  targetRole: z
    .string()
    .min(1, "Please select a target career role.")
    .trim(),
  role: z.enum(["student", "graduate", "job_seeker", "admin"], {
    message: "Please select a valid membership role.",
  }),
});

export type UpdateProfileResponse =
  | { success: true; message: string }
  | { success: false; error: string };

/**
 * Server Action: Update User Profile
 * Updates both public.profiles and auth.users metadata.
 */
export async function updateProfileAction(
  formData: z.infer<typeof updateProfileSchema>
): Promise<UpdateProfileResponse> {
  // 1. Zod Validation
  const validatedFields = updateProfileSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.issues[0].message };
  }

  const { displayName, targetRole, role } = validatedFields.data;

  // 2. Authentication check
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  try {
    const supabase = await createServerSupabaseClient();

    // 3. Update Supabase Auth User Metadata (to keep session/avatar in sync)
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: displayName,
        role: role,
      },
    });

    if (authError) {
      console.error("Auth metadata update failed:", authError.message);
      return { success: false, error: `Auth sync error: ${authError.message}` };
    }

    // 4. Update or Upsert the public.profiles database table (handles missing rows gracefully)
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName,
        target_role: targetRole,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Database profile update failed:", dbError.message);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    // 5. Revalidate target page caches so that all layouts reflect updates immediately
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, message: "Profile successfully updated!" };
  } catch (error: unknown) {
    console.error("Unexpected error in updateProfileAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return { success: false, error: errorMessage };
  }
}
