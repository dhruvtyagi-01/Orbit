export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function getConversation(): Message[] {
  const feed = document.querySelector<HTMLElement>('[role="feed"]');

  if (!feed) {
    console.log("[Orbit Parser] No feed found");
    return [];
  }

  // Get all message containers with data-index
  const messageNodes = feed.querySelectorAll<HTMLElement>("[data-index]");

  console.log("[Orbit Parser] Found messageNodes:", messageNodes.length);

  // Safety check: if feed is empty, return empty array
  if (messageNodes.length === 0) {
    console.log("[Orbit Parser] No message nodes, returning empty");
    return [];
  }

  const conversation: Message[] = [];

  for (const node of messageNodes) {
    // Check if the node actually has visible content
    const textContent = node.innerText?.trim();
    console.log("[Orbit Parser] Node text content length:", textContent?.length, "isEmpty:", !textContent);

    if (!textContent) {
      console.log("[Orbit Parser] Skipping empty node");
      continue;
    }

    const user = node.querySelector<HTMLElement>(
      '[data-testid="user-message"]'
    );

    if (user) {
      const userContent = user.innerText.trim();
      console.log("[Orbit Parser] Found user message:", userContent.length, "chars");
      if (userContent) {
        conversation.push({
          role: "user",
          content: userContent,
        });
      }
      continue;
    }

    const assistant = node.querySelector<HTMLElement>(
      ".font-claude-response"
    );

    if (assistant) {
      const assistantContent = assistant.innerText.trim();
      console.log("[Orbit Parser] Found assistant message:", assistantContent.length, "chars");
      if (assistantContent) {
        conversation.push({
          role: "assistant",
          content: assistantContent,
        });
      }
    }
  }

  console.log("[Orbit Parser] Final conversation length:", conversation.length);
  return conversation;
}