type NavigationListener = () => void;

const listeners = new Set<NavigationListener>();

let started = false;
let currentUrl = location.href;

function notify() {
  console.log("[Orbit] notify()");

  for (const listener of listeners) {
    listener();
  }
}

export function startNavigationObserver() {
  if (started) {
    return;
  }

  started = true;

  const handleNavigation = () => {
    console.log("[Orbit] handleNavigation()", location.href);

    if (location.href === currentUrl) {
      console.log("[Orbit] URL unchanged");
      return;
    }

    console.log("[Orbit] URL changed");
    console.log("[Orbit] Old:", currentUrl);
    console.log("[Orbit] New:", location.href);

    currentUrl = location.href;

    notify();
  };

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    console.log("[Orbit] history.pushState()");

    const result = originalPushState.apply(this, args);

    handleNavigation();

    return result;
  };

  history.replaceState = function (...args) {
    console.log("[Orbit] history.replaceState()");

    const result = originalReplaceState.apply(this, args);

    handleNavigation();

    return result;
  };

  window.addEventListener("popstate", () => {
    console.log("[Orbit] popstate");

    handleNavigation();
  });

  console.log("[Orbit] Navigation observer started");
}

export function onNavigation(listener: NavigationListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}