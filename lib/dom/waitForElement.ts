export function waitForElement<T extends Element>(
  selector: string
): Promise<T> {
  return new Promise((resolve) => {
    const existing = document.querySelector<T>(selector);

    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector<T>(selector);

      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}