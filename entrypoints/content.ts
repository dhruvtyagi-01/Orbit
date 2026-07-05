import { waitForElement } from "../lib/dom/waitForElement";
import { sendMessage, MessageType } from "../lib/messaging";
import { createBadge } from "../lib/ui/badge";

export default defineContentScript({
  matches: ["*://claude.ai/*"],

  async main() {
    console.log("🚀 Helix loaded!");

    await waitForElement('[data-testid="chat-input"]');

    createBadge();

    const response = await sendMessage(MessageType.PING);

    console.log(response);
  },
});