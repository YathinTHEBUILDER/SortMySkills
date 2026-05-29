import { getCurrentUser } from "@/lib/auth/get-user";
import LandingClient from "@/components/landing/LandingClient";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return <LandingClient user={user} />;
}
