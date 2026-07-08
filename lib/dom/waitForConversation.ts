export function waitForConversation(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const check = (): HTMLElement | null => {
      const feed = document.querySelector<HTMLElement>('[role="feed"]');

      if (!feed) {
        return null;
      }

      const messages = feed.querySelectorAll("[data-index]");

      return messages.length > 0 ? feed : null;
    };

    const existing = check();

    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const feed = check();

      if (!feed) {
        return;
      }

      observer.disconnect();
      resolve(feed);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
}