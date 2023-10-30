import SettingGroupForm from "@/components/editor/setting-group-form";
import { getAdventure } from "@/lib/adventure/adventure.server";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { log } from "next-axiom";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

export default async function EditorPage({
  params,
}: {
  params: { adventureId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  const adventure = await getAdventure(userId, params.adventureId);

  if (!adventure) {
    redirect("/adventures");
  }

  let config = {
    adventure_name: adventure.name,
    adventure_description: adventure.description,
    ...((adventure.agentDevConfig as any) || {}),
  };

  return <SettingGroupForm existing={config} />;
}
