import AdventureListElement from "@/components/adventures/adventure-list-element";
import { MainCTA } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography/TypographyH3";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { TypographySmall } from "@/components/ui/typography/TypographySmall";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  CircleDollarSignIcon,
  FingerprintIcon,
  VenetianMaskIcon,
  WandIcon,
} from "lucide-react";
import { Cinzel } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import "./globals.css";

const font = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const features = [
  {
    name: "On the fly generation",
    description:
      "Everything is generated on the fly. No need to wait for a DM to create your adventure. This includes the story, images, and audio.",
    emoji: "🪄",
    icon: WandIcon,
  },
  {
    name: "Swappable Models",
    description:
      "Bring your own LLMs and Stable Diffusion + LORA Generators. Customize your adventure by swapping out models and prompts.",
    emoji: "🎭",
    icon: VenetianMaskIcon,
  },
  {
    name: "Payment Ready",
    description:
      "Stripe Integration is built in. You can charge your players to play your adventure.",
    emoji: "💰",
    icon: CircleDollarSignIcon,
  },
  {
    name: "Authentication Solved",
    description:
      "Simple integration setup with Clerk means you can focus on building your adventure, not authentication.",
    emoji: "🔑",
    icon: FingerprintIcon,
  },
];

const Section = ({ children }: { children: ReactNode }) => (
  <div className="">{children}</div>
);

const Title = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center w-full text-center mb-16">
    <TypographyH3 className="text-xl md:text-3xl">{title}</TypographyH3>
    <TypographyMuted className="text-lg md:text-xl mt-4 max-w-lg">
      {subtitle}
    </TypographyMuted>
  </div>
);

const Actions = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex items-center justify-center mb-24 gap-2">
    {children}
  </div>
);

export default async function Home() {
  const featuredAdventures = await prisma.adventure.findMany({
    where: {
      featured: true,
    },
    take: 3,
    orderBy: {
      createdAt: "asc",
    },
  });
  return (
    <main id="main-container" className={cn("h-full ", font.className)}>
      <MainCTA />
      <div className="relative flex-col w-full bg-gradient-to-b text-center from-transparent via-background/50 to-background flex h-1/3 md:h-1/2">
        <div className="flex w-full justify-end py-2 px-6">
          <div className="flex gap-2 items-center justify-center h-[32px]">
            <UserButton />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center items-center py-10">
          <div className="pb-12 px-6 md:px-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-10">
              Choose your Adventure
            </h1>
            <p className="text-lg md:text-2xl text-center">
              Explore community made adventures, or create your own.
            </p>
          </div>
          <Button asChild className="shadow-lg shadow-foreground/50 font-bold">
            <Link href="/adventures">Explore Adventures</Link>
          </Button>
        </div>
      </div>
      <div className="bg-background pb-12 md:pb-32 flex flex-col px-6 md:px-12">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-32 z-20">
          <Section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredAdventures.map((adventure) => (
                <AdventureListElement
                  key={adventure.id}
                  adventure={adventure}
                  link={true}
                />
              ))}
            </div>
          </Section>
          <Section>
            <Title
              title="Create your own Adventure"
              subtitle="Then share it with your friends"
            />
            <Actions>
              <Button asChild>
                <Link href="/adventures/create">Adventure Editor</Link>
              </Button>
            </Actions>
          </Section>
          <Section>
            <Title
              title="Host your own Adventure Game"
              subtitle="AI Adventure is open source. Fork the project and make it your
                own."
            />
            <Actions>
              <Button asChild>
                <a
                  href="https://github.com/steamship-core/ai-adventure"
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  <Image
                    src="/github.png"
                    width={24}
                    height={24}
                    alt="Github"
                  />
                  View on Github
                </a>
              </Button>
            </Actions>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <div>
                    <div className="absolute mt-3 left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg text-2xl bg-indigo-600 text-center">
                      <feature.icon />
                    </div>
                    <TypographySmall>{feature.name}</TypographySmall>
                  </div>
                  <TypographyMuted className="mt-2">
                    {feature.description}
                  </TypographyMuted>
                </div>
              ))}
            </dl>
          </Section>
        </div>
      </div>
    </main>
  );
}
