import { waitForElement } from "../lib/dom/waitForElement";

import { createFloatingButton } from "../features/floatingButton/floatingButton";

import { startConversationObserver } from "../utils/conversationObserver";
import { startNavigationObserver } from "../utils/navigationObserver";

export default defineContentScript({
  matches: ["*://claude.ai/*"],

  async main() {
    if ((window as any).__ORBIT_INITIALIZED__) {
      return;
    }

    (window as any).__ORBIT_INITIALIZED__ = true;

    await waitForElement<HTMLDivElement>(
      '[data-testid="chat-input"]'
    );

    createFloatingButton();

    startNavigationObserver();

    startConversationObserver();
  },
});