import { waitForElement } from "../lib/dom/waitForElement";
import { getConversation } from "../utils/parser";
import { calculateTokenStats } from "../utils/tokenEstimator";
import { updateAnalytics } from "../features/sidebar/analytics";

let feedObserver: MutationObserver | null = null;
let pageObserver: MutationObserver | null = null;

let currentFeed: HTMLElement | null = null;

let timeout: number | undefined;

function refreshAnalytics() {
  const conversation = getConversation();
  const stats = calculateTokenStats(conversation);

  updateAnalytics(stats);
}

async function waitForConversation(feed: HTMLElement): Promise<void> {
  const hasMessages = () =>
    feed.querySelectorAll("[data-is-streaming], [data-testid]").length > 0 ||
    feed.textContent!.trim().length > 0;

  if (hasMessages()) {
    return;
  }

  await new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!hasMessages()) {
        return;
      }

      observer.disconnect();
      resolve();
    });

    observer.observe(feed, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
}

function attachFeedObserver(feed: HTMLElement) {
  feedObserver?.disconnect();

  currentFeed = feed;

  feedObserver = new MutationObserver(() => {
    window.clearTimeout(timeout);

    timeout = window.setTimeout(() => {
      refreshAnalytics();
    }, 200);
  });

  feedObserver.observe(feed, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  console.log("[Orbit] Attached to conversation feed.");
}

async function connectToFeed(feed: HTMLElement) {
  if (currentFeed === feed) {
    return;
  }

  attachFeedObserver(feed);

  await waitForConversation(feed);

  refreshAnalytics();
}

export async function startConversationObserver() {
  if (pageObserver) {
    return;
  }

  const feed = await waitForElement<HTMLElement>('[role="feed"]');

  await connectToFeed(feed);

  pageObserver = new MutationObserver(async () => {
    const latestFeed = document.querySelector<HTMLElement>('[role="feed"]');

    if (!latestFeed || latestFeed === currentFeed) {
      return;
    }

    console.log("[Orbit] Conversation feed changed.");

    await connectToFeed(latestFeed);
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function stopConversationObserver() {
  feedObserver?.disconnect();
  pageObserver?.disconnect();

  feedObserver = null;
  pageObserver = null;
  currentFeed = null;

  if (timeout) {
    window.clearTimeout(timeout);
  }
}