"use client";

import { QuestNarrativeContainer } from "@/components/quest/shared/components";
import { Input } from "@/components/ui/input";
import { Block } from "@/lib/streaming-client/src";
import { useChat } from "ai/react";
import { SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import EndSheet from "../shared/end-sheet";
import { NarrativeBlock } from "./narrative-block";
import { UserInputBlock } from "./user-input-block";
import { ExtendedBlock, getFormattedBlocks } from "./utils";

export default function QuestNarrative({
  id,
  onSummary,
  onComplete,
  isComplete,
  summary,
  agentBaseUrl,
  completeButtonText,
}: {
  id: string;
  summary: Block | null;
  onSummary: (block: Block) => void;
  onComplete: () => void;
  isComplete: boolean;
  agentBaseUrl: string;
  completeButtonText?: string;
}) {
  const initialized = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [priorBlocks, setPriorBlocks] = useState<ExtendedBlock[] | undefined>();

  const {
    messages,
    append,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    body: {
      context_id: id,
      agentBaseUrl,
    },
    id,
  });

  useEffect(() => {
    // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
    // This suppresses the double-loading. My hypothesis is that this is happening in dev as a result of strict mode, but
    // even in dev it messes with the remote agent.
    if (!initialized.current) {
      initialized.current = true;
      // On the first load, get the quest history
      fetch(`/api/game/quest?questId=${id}`).then(async (response) => {
        if (response.ok) {
          let blocks = ((await response.json()) || {})
            .blocks as ExtendedBlock[];
          if (blocks && blocks.length > 0) {
            for (let block of blocks) {
              block.historical = true;
            }
            setPriorBlocks(blocks.reverse());
          } else {
            // Only once the priorBlocks have been loaded, append a message to chat history to kick off the quest
            // if it hasn't already been started.
            // TODO: We could find a way to kick off the quest proactively.
            append({
              id: "000-000-000",
              content: "Let's go on an adventure!",
              role: "user",
            });
          }
        }
      });
    }
  }, []);

  let nonPersistedUserInput: string | null = null;
  return (
    <>
      <div className="flex basis-11/12 overflow-hidden">
        <QuestNarrativeContainer>
          {messages
            .map((message) => {
              if (message.role === "user") {
                nonPersistedUserInput = message.content;
                return (
                  <UserInputBlock text={message.content} key={message.id} />
                );
              }
              return (
                <NarrativeBlock
                  key={message.id}
                  blocks={getFormattedBlocks(message, nonPersistedUserInput)}
                  onSummary={onSummary}
                  onComplete={onComplete}
                />
              );
            })
            .reverse()}
          {priorBlocks && (
            <NarrativeBlock
              blocks={priorBlocks.reverse()}
              onSummary={onSummary}
              onComplete={onComplete}
            />
          )}
        </QuestNarrativeContainer>
      </div>
      <div className="flex items-end flex-col w-full gap-2 basis-1/12 pb-4 pt-1 relative">
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full animate-spin border-2 border-dashed border-green-500 border-t-transparent"></div>
          </div>
        )}
        {isComplete ? (
          <EndSheet
            isEnd={true}
            summary={summary}
            completeButtonText={completeButtonText}
          />
        ) : (
          <form
            className="flex gap-2 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inputRef?.current?.focus();
              handleSubmit(e);
            }}
          >
            <Input
              className="w-full"
              value={input}
              onChange={handleInputChange}
              ref={inputRef}
              disabled={isLoading || isComplete}
            />
            <Button type="submit" disabled={isLoading || isComplete}>
              <SendIcon size={16} />
            </Button>
          </form>
        )}
      </div>
    </>
  );
}