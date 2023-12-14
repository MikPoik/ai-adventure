import { auth } from "@clerk/nextjs";
import { log } from "next-axiom";

export default async function AccountPlanPage() {
  const { userId } = auth();

  if (!userId) {
    log.error("No user");
    throw new Error("no user");
  }

  return (
    <main className="w-full p-6 sm:p-16 flex-1 flex flex-col">
      Migrating your Adventures into your new account..
    </main>
  );
}
