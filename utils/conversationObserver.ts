import { getConversation } from "./parser";
import { calculateTokenStats } from "./tokenEstimator";
import { updateAnalytics } from "../features/sidebar/analytics";
import { onNavigation } from "./navigationObserver";

let pageObserver: MutationObserver | null = null;
let feedObserver: MutationObserver | null = null;

let currentFeed: HTMLElement | null = null;
let refreshTimeout: number | null = null;

function refreshAnalytics() {
  const conversation = getConversation();

  console.log("[Orbit] Conversation length:", conversation.length);

  if (conversation.length === 0) {
    console.log("[Orbit] No conversation, showing waiting state");
    updateAnalytics(null);
    return;
  }

  const stats = calculateTokenStats(conversation);

  console.log("[Orbit] Updating analytics:", stats);

  updateAnalytics(stats);
}

function scheduleRefresh() {
  if (refreshTimeout !== null) {
    clearTimeout(refreshTimeout);
  }

  refreshTimeout = window.setTimeout(() => {
    refreshAnalytics();
  }, 100);
}

function detachFeed() {
  if (feedObserver) {
    console.log("[Orbit] Detaching feed");
    feedObserver.disconnect();
  }

  feedObserver = null;
  currentFeed = null;
}

function attachFeed(feed: HTMLElement) {
  if (feed === currentFeed) {
    return;
  }

  console.log("[Orbit] Feed attached");

  detachFeed();

  currentFeed = feed;

  feedObserver = new MutationObserver(() => {
    console.log("[Orbit] Feed mutation");
    scheduleRefresh();
  });

  feedObserver.observe(feed, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  scheduleRefresh();
}

function tryAttachFeed(): boolean {
  const feed = document.querySelector<HTMLElement>('[role="feed"]');

  if (!feed) {
    console.log("[Orbit] Feed not found");
    return false;
  }

  console.log("[Orbit] Feed found");

  attachFeed(feed);

  return true;
}

export function startConversationObserver() {
  if (pageObserver) {
    console.log("[Orbit] Conversation observer already running");
    return;
  }

  console.log("[Orbit] Starting conversation observer");

  // Observe the whole page. As soon as Claude creates or replaces
  // the feed we'll attach automatically.
  pageObserver = new MutationObserver(() => {
    tryAttachFeed();
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Existing conversation
  tryAttachFeed();

  onNavigation(() => {
    console.log("[Orbit] Navigation");

    detachFeed();

    updateAnalytics(null);

    // No timeout here.
    // The page observer will automatically attach
    // when Claude creates the next feed.
  });
}

export function stopConversationObserver() {
  console.log("[Orbit] Stopping conversation observer");

  detachFeed();

  pageObserver?.disconnect();
  pageObserver = null;

  if (refreshTimeout !== null) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
}