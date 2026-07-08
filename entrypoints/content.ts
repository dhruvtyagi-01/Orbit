import { waitForElement } from "../lib/dom/waitForElement";
import { waitForConversation } from "../lib/dom/waitForConversation";

import { createFloatingButton } from "../features/floatingButton/floatingButton";

import { startConversationObserver } from "../utils/conversationObserver";

export default defineContentScript({
  matches: ["*://claude.ai/*"],

  async main() {
    if ((window as any).__ORBIT_INITIALIZED__) {
      return;
    }

    (window as any).__ORBIT_INITIALIZED__ = true;

    // Wait until Claude UI is ready.
    await waitForElement<HTMLDivElement>(
      '[data-testid="chat-input"]'
    );

    createFloatingButton();

    // Wait until an actual conversation exists.
    await waitForConversation();

    // Start analytics.
    await startConversationObserver();
  },
});