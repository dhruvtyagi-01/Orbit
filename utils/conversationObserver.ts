import { getConversation } from "./parser";
import { calculateTokenStats } from "./tokenEstimator";
import { updateAnalytics } from "../features/sidebar/analytics";

let observer: MutationObserver | null = null;

export function startConversationObserver() {
  if (observer) {
    return;
  }

  const feed = document.querySelector<HTMLElement>('[role="feed"]');

  if (!feed) {
    return;
  }

  let timeout: number | undefined;

  observer = new MutationObserver(() => {
    window.clearTimeout(timeout);

    timeout = window.setTimeout(() => {
      const conversation = getConversation();
      const stats = calculateTokenStats(conversation);

      updateAnalytics(stats);
    }, 200);
  });

  observer.observe(feed, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

export function stopConversationObserver() {
  observer?.disconnect();
  observer = null;
}