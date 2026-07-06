import type { Message } from "./parser";

export interface TokenStats {
  totalMessages: number;
  totalTokens: number;
  userTokens: number;
  assistantTokens: number;
  averageTokens: number;
  largestMessageTokens: number;
}

function estimateTokens(text: string): number {
  // GPT/Claude average ≈ 1 token per 4 characters
  return Math.ceil(text.length / 4);
}

export function calculateTokenStats(messages: Message[]): TokenStats {
  let userTokens = 0;
  let assistantTokens = 0;
  let largestMessageTokens = 0;

  for (const message of messages) {
    const tokens = estimateTokens(message.content);

    if (message.role === "user") {
      userTokens += tokens;
    } else {
      assistantTokens += tokens;
    }

    if (tokens > largestMessageTokens) {
      largestMessageTokens = tokens;
    }
  }

  const totalTokens = userTokens + assistantTokens;

  return {
    totalMessages: messages.length,
    totalTokens,
    userTokens,
    assistantTokens,
    averageTokens:
      messages.length > 0
        ? Math.round(totalTokens / messages.length)
        : 0,
    largestMessageTokens,
  };
}