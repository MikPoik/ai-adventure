"use client";

import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyH4 } from "../ui/typography/TypographyH4";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const ManageAccount = () => {
  const clerk = useClerk();
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-12 border rounded-md p-6">
        <Image
          src={user.imageUrl}
          width={128}
          height={128}
          className="rounded-full aspect-square"
          alt="Profile picture"
        />
        <div className="flex flex-col gap-4">
          <TypographyH2 className="border-none p-0">
            {user.emailAddresses[0].emailAddress}
          </TypographyH2>
          <Button variant="outline" onClick={() => clerk.openUserProfile()}>
            Manage Account
          </Button>
        </div>
      </div>
      <div className="p-6 rounded-md border-muted border flex flex-col gap-8">
        <div className="gap-2 flex flex-col">
          <TypographyMuted>Rank</TypographyMuted>
          <TypographyH3>Wanderer</TypographyH3>
        </div>
        <div className="gap-2 flex flex-col">
          <TypographyMuted>Progress</TypographyMuted>
          <TypographyH3>
            <Progress value={0.5} />
          </TypographyH3>
        </div>
        <div className="gap-2 flex flex-col">
          <TypographyMuted>Awards</TypographyMuted>
          <div className="flex gap-12 overflow-x-scroll">
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((award, i) => (
              <div
                key={award}
                className={cn(
                  "rounded-lg  min-w-[250px] p-8 border",
                  i < 2 ? " bg-gradient-to-r from-indigo-500 to-blue-500" : ""
                )}
              >
                <TypographyH4>Award {award}</TypographyH4>
                <TypographyMuted
                  className={cn(
                    "text-white",
                    i < 2 ? "text-white" : "text-gray-500"
                  )}
                >
                  This is where the award description goes
                </TypographyMuted>
                <div className="mt-8 text-sm">
                  Unlocked at <b>Level 1</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Button variant="outline" onClick={() => clerk.signOut()}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default ManageAccount;
