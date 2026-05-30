"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, User, Briefcase, Mail, ShieldCheck } from "lucide-react";
import { ROLES_DATABASE } from "@/data/roles";
import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  initialDisplayName: string;
  initialTargetRole: string;
  initialRole: "student" | "graduate" | "job_seeker" | "admin";
  email: string;
}

export default function ProfileForm({
  initialDisplayName,
  initialTargetRole,
  initialRole,
  email,
}: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    displayName: initialDisplayName || "",
    targetRole: initialTargetRole || ROLES_DATABASE[0]?.id || "",
    role: initialRole || "student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "Display name must be at least 2 characters.";
    }
    if (formData.displayName.trim().length > 50) {
      newErrors.displayName = "Display name cannot exceed 50 characters.";
    }
    if (!formData.targetRole) {
      newErrors.targetRole = "Please select a target career role.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      try {
        const response = await updateProfileAction(formData);

        if (response.success) {
          toast.success(response.message || "Profile updated successfully!");
          router.refresh(); // Refresh layouts and page queries
        } else {
          toast.error(response.error || "Failed to update profile.");
        }
      } catch (err: unknown) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error(err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-accent-primary" />
          <span>Full Name / Display Name</span>
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => {
            setFormData({ ...formData, displayName: e.target.value });
            if (errors.displayName) {
              setErrors({ ...errors, displayName: "" });
            }
          }}
          disabled={isPending}
          className={`w-full rounded-lg border bg-[var(--surface-soft)]/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all ${
            errors.displayName
              ? "border-red-500/50 focus:border-red-500"
              : "border-[var(--border-muted)] focus:border-accent-primary"
          }`}
          placeholder="e.g. Sarah Connor"
        />
        {errors.displayName && (
          <p className="text-[11px] text-red-400 font-mono mt-1">{errors.displayName}</p>
        )}
      </div>

      {/* Target Career Role Select */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-accent-primary" />
          <span>Target Career Placement</span>
        </label>
        <select
          value={formData.targetRole}
          onChange={(e) => {
            setFormData({ ...formData, targetRole: e.target.value });
            if (errors.targetRole) {
              setErrors({ ...errors, targetRole: "" });
            }
          }}
          disabled={isPending}
          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all cursor-pointer"
        >
          {ROLES_DATABASE.map((role) => (
            <option key={role.id} value={role.id} className="bg-surface-card text-text-primary">
              {role.title} ({role.difficulty} difficulty)
            </option>
          ))}
        </select>
        {errors.targetRole && (
          <p className="text-[11px] text-red-400 font-mono mt-1">{errors.targetRole}</p>
        )}
        <p className="text-[10px] text-text-muted mt-1 leading-snug">
          Choosing a target role links your placement analysis, Coursera skill guides, and interview prep packages.
        </p>
      </div>

      {/* Current Academic/Career Status */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
          <span>Membership Status</span>
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as "student" | "graduate" | "job_seeker" | "admin",
            })
          }
          disabled={isPending}
          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all cursor-pointer"
        >
          <option value="student" className="bg-surface-card">Student</option>
          <option value="graduate" className="bg-surface-card">Recent Graduate</option>
          <option value="job_seeker" className="bg-surface-card">Job Seeker</option>
          <option value="admin" className="bg-surface-card">Administrator</option>
        </select>
      </div>

      {/* Email Address (Read-only) */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-text-muted" />
          <span>Account Email (Verified)</span>
        </label>
        <div className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 px-4 py-2.5 text-sm text-text-muted select-none flex items-center justify-between">
          <span>{email}</span>
          <span className="font-mono text-[9px] text-accent-primary uppercase tracking-widest px-2 py-0.5 rounded border border-accent-primary/20 bg-accent-primary/5">
            Security Locked
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-11 mt-4"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#F6F1E8]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Saving changes...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </>
        )}
      </Button>
    </form>
  );
}
