"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { redirect } from "next/navigation";



// Custom type for Server Action Responses
export type ActionResponse =
  | { success: true; message?: string; email?: string }
  | { success: false; error: string; code?: string }
  | { unverified: true; email: string };

// Password complexity regex
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

// Zod schemas for strict validation
const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    role: z.enum(["student", "graduate", "job_seeker", "admin"], {
      message: "Please select a valid role.",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(passwordRegex, "Password must contain at least one uppercase letter and one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  token: z
    .string()
    .length(6, "Verification code must be exactly 6 digits.")
    .regex(/^\d+$/, "Verification code must contain digits only."),
  type: z.enum(["signup", "recovery", "email_change"], {
    message: "Invalid verification type.",
  }),
});

const resendOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  type: z.enum(["signup", "email_change", "recovery"], {
    message: "Invalid verification type.",
  }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(passwordRegex, "Password must contain at least one uppercase letter and one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Server Action: Sign Up
 */
export async function signUpAction(formData: z.infer<typeof signUpSchema>): Promise<ActionResponse> {
  try {
    // 1. Zod Validation
    const validatedFields = signUpSchema.safeParse(formData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0].message };
    }

    const { fullName, email, password, role } = validatedFields.data;

    // 2. Rate Limiting (10 signups / hour / IP)
    const ip = await getClientIp();
    const signupLimit = rateLimit(`signup:${ip}`, 10, 60 * 60 * 1000);
    if (!signupLimit.success) {
      return {
        success: false,
        error: "Too many sign up requests. Please try again in an hour.",
      };
    }

    // 3. Supabase Auth Call
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Check if email confirmation is required (Supabase defaults to this)
    // If not immediately confirmed and user isn't logged in, redirect to verify
    if (data.user && !data.session) {
      return { success: true, email };
    }

    return { success: true, message: "Registration successful!" };
  } catch (error: unknown) {
    console.error("signUpAction critical failure:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Sign In
 */
export async function signInAction(formData: z.infer<typeof signInSchema>): Promise<ActionResponse> {
  try {
    // 1. Zod Validation
    const validatedFields = signInSchema.safeParse(formData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0].message };
    }

    const { email, password } = validatedFields.data;

    // 2. Rate Limiting
    const ip = await getClientIp();
    // Max 10 attempts / minute / IP
    const ipLimit = rateLimit(`signin:ip:${ip}`, 10, 60 * 1000);
    if (!ipLimit.success) {
      return { success: false, error: "Too many login attempts. Please wait a minute." };
    }
    // Max 5 attempts / 5 minutes / Email
    const emailLimit = rateLimit(`signin:email:${email}`, 5, 5 * 60 * 1000);
    if (!emailLimit.success) {
      return {
        success: false,
        error: "Too many failed attempts for this email. Please try again in 5 minutes.",
      };
    }

    // 3. Supabase Auth Call
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return { unverified: true, email };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("signInAction critical failure:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Verify Email OTP
 */
export async function verifyEmailOtpAction(
  formData: z.infer<typeof verifyOtpSchema>
): Promise<ActionResponse> {
  try {
    // 1. Zod Validation
    const validatedFields = verifyOtpSchema.safeParse(formData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0].message };
    }

    const { email, token, type } = validatedFields.data;

    // 2. Rate Limiting (5 verification attempts / 5 minutes / email+IP)
    const ip = await getClientIp();
    const verifyLimit = rateLimit(`verify:${email}:${ip}`, 5, 5 * 60 * 1000);
    if (!verifyLimit.success) {
      return {
        success: false,
        error: "Too many incorrect OTP attempts. Please wait 5 minutes.",
      };
    }

    // 3. Supabase Auth Call
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("verifyEmailOtpAction critical failure:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Resend OTP
 */
export async function resendOtpAction(formData: z.infer<typeof resendOtpSchema>): Promise<ActionResponse> {
  try {
    // 1. Zod Validation
    const validatedFields = resendOtpSchema.safeParse(formData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0].message };
    }

    const { email, type } = validatedFields.data;

    // 2. Rate Limiting (3 resends / 10 minutes / email+IP)
    const ip = await getClientIp();
    const resendLimit = rateLimit(`resend:${email}:${ip}`, 3, 10 * 60 * 1000);
    if (!resendLimit.success) {
      return {
        success: false,
        error: "Too many resend requests. Please wait a few minutes.",
      };
    }

    // 3. Supabase Auth Call
    const supabase = await createServerSupabaseClient();

    if (type === "recovery") {
      // Recovery uses resetPasswordForEmail to resend the OTP
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase.auth.resend({
        email,
        type,
      });
      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true, message: "A new verification code has been sent." };
  } catch (error: unknown) {
    console.error("resendOtpAction critical failure:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Forgot Password
 */
export async function forgotPasswordAction(
  formData: z.infer<typeof forgotPasswordSchema>
): Promise<ActionResponse> {
  try {
    // 1. Zod Validation
    const validatedFields = forgotPasswordSchema.safeParse(formData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0].message };
    }

    const { email } = validatedFields.data;

    // 2. Rate Limiting (3 requests / hour / email+IP)
    const ip = await getClientIp();
    const forgotLimit = rateLimit(`forgot:${email}:${ip}`, 3, 60 * 60 * 1000);
    if (!forgotLimit.success) {
      return {
        success: false,
        error: "Too many password reset requests. Please try again later.",
      };
    }

    // 3. Supabase Auth Call — send OTP code (not a link)
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      // Return success even on error (e.g. user not found) to prevent email enumeration
      console.error("Supabase Reset Error (hidden from client):", error.message);
    }

    return {
      success: true,
      email,
      message: "If an account exists with that email, a verification code has been sent.",
    };
  } catch (error: unknown) {
    // Return a generic success to hide server issues/account presence details
    console.error("Forgot password server error:", error);
    return {
      success: true,
      email: formData.email,
      message: "If an account exists with that email, a verification code has been sent.",
    };
  }
}

/**
 * Server Action: Reset Password
 */
export async function resetPasswordAction(
  formData: z.infer<typeof resetPasswordSchema>
): Promise<ActionResponse> {
  try {
    // 1. Zod Validation
    const validatedFields = resetPasswordSchema.safeParse(formData);
    if (!validatedFields.success) {
      return { success: false, error: validatedFields.error.issues[0].message };
    }

    const { password } = validatedFields.data;

    // 2. Supabase Auth Call
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: "Your password has been successfully updated." };
  } catch (error: unknown) {
    console.error("resetPasswordAction critical failure:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Server Action: Sign Out
 */
export async function signOutAction(): Promise<never> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Signout error:", error);
  }

  redirect("/");
}
