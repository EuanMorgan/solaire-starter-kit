import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SettingsContent } from "./_components/settings-content";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <SettingsContent user={session.user} />;
}
