"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { Block } from "@/lib/streaming-client/src";
import { ArrowLeftIcon, PackageIcon } from "lucide-react";
import Link from "next/link";
import AudioSheet from "../audio-sheet";
import { CharacterSheet } from "../camp/character-sheet";
import InventorySheet from "../inventory-sheet";
import { Button } from "../ui/button";

export const QuestHeader = ({
  gameState,
  id,
  summary,
  isComplete,
}: {
  gameState: GameState;
  id: string;
  summary: Block | null;
  isComplete: boolean;
}) => {
  return (
    <div className="flex justify-between items-center border-b border-b-foreground/10 pb-2 basis-1/12">
      <div className="flex items-center justify-center">
        {!isComplete ? (
          <Button asChild variant="link" className="pl-0">
            <Link href="/play/camp">
              <ArrowLeftIcon size={16} />
            </Link>
          </Button>
        ) : (
          <span />
        )}
        <CharacterSheet mini={true} />
      </div>
      <div className="flex items-center justify-center">
        <AudioSheet text="" /> &nbsp;
        <InventorySheet>
          <Button variant="outline" size="icon">
            <PackageIcon size={16} />
          </Button>
        </InventorySheet>
      </div>
    </div>
  );
};
