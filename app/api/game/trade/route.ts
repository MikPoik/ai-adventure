import { getAgent } from "@/lib/agent/agent.server";
import { tradeItems } from "@/lib/game/trade";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const agent = await getAgent(userId);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const { counter_party, sell, buy } = await request.json();

  try {
    const tradeResult = await tradeItems(agent!.agentUrl, {
      counter_party,
      sell,
      buy,
    });
    return tradeResult;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}