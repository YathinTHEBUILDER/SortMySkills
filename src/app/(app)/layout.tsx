import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/get-user";
import { ResumeProvider } from "@/context/ResumeContext";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  let roleText = "MEMBER";
  let maskedEmail = "";

  if (user) {
    roleText = user.user_metadata?.role
      ? (user.user_metadata.role as string).replace("_", " ").toUpperCase()
      : "MEMBER";

    if (user.email) {
      const parts = user.email.split("@");
      maskedEmail = `${parts[0]}@...`;
    }
  }

  return (
    <DashboardShell
      roleText={roleText}
      maskedEmail={maskedEmail}
    >
      <ResumeProvider>
        {children}
      </ResumeProvider>
    </DashboardShell>
  );
}
