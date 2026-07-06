export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function getConversation(): Message[] {
  const feed = document.querySelector<HTMLElement>('[role="feed"]');

  if (!feed) {
    return [];
  }

  const messageNodes = feed.querySelectorAll<HTMLElement>("[data-index]");

  const conversation: Message[] = [];

  for (const node of messageNodes) {
    const user = node.querySelector<HTMLElement>(
      '[data-testid="user-message"]'
    );

    if (user) {
      conversation.push({
        role: "user",
        content: user.innerText.trim(),
      });

      continue;
    }

    const assistant = node.querySelector<HTMLElement>(
      ".font-claude-response"
    );

    if (assistant) {
      conversation.push({
        role: "assistant",
        content: assistant.innerText.trim(),
      });
    }
  }

  return conversation;
}