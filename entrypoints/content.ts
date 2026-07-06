import { waitForElement } from "../lib/dom/waitForElement";
import { createFloatingButton } from "../features/floatingButton/floatingButton";
import { getConversation } from "../utils/parser";
import { calculateTokenStats } from "../utils/tokenEstimator";
import { updateAnalytics } from "../features/sidebar/analytics";
import { startConversationObserver } from "../utils/conversationObserver";

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

    const conversation = getConversation();
    const stats = calculateTokenStats(conversation);

    updateAnalytics(stats);

    startConversationObserver();
  },
});