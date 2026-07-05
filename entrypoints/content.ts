import { waitForElement } from "../lib/dom/waitForElement";
import { sendMessage, MessageType } from "../lib/messaging";
import { createFloatingButton } from "../features/floatingButton/floatingButton";

export default defineContentScript({
  matches: ["*://claude.ai/*"],

  async main() {
    console.log("🚀 Helix loaded!");

    await waitForElement<HTMLDivElement>(
      '[data-testid="chat-input"]'
    );

    createFloatingButton();

    const response = await sendMessage(MessageType.PING);

    console.log(response);
  },
});