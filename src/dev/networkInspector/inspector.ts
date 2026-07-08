import { DEFAULT_MAX_REQUESTS } from "./constants";

import {
  captureResponseBody,
  detectProvider,
  getErrorMessage,
  matchesFilter,
  resolveMethod,
  resolveUrl,
} from "./helpers";

import type {
  NetworkInspector,
  NetworkInspectorOptions,
  NetworkRequest,
  NetworkRequestListener,
} from "./types";

export function createNetworkInspector(
  options: NetworkInspectorOptions = {}
): NetworkInspector {
  let originalFetch: typeof fetch | null =
    null;

  let requests: NetworkRequest[] = [];

  const listeners = new Set<
    NetworkRequestListener
  >();

  let active = false;

  function notify(
    request: NetworkRequest
  ): void {
    listeners.forEach((listener) =>
      listener(request)
    );
  }

  function addRequest(
    request: NetworkRequest
  ): void {
    requests.push(request);

    const max =
      options.maxRequests ??
      DEFAULT_MAX_REQUESTS;

    if (requests.length > max) {
      requests = requests.slice(-max);
    }

    notify(request);
  }

  function updateRequest(
    request: NetworkRequest
  ): void {
    const index = requests.findIndex(
      (r) => r.id === request.id
    );

    if (index === -1) {
      return;
    }

    requests[index] = request;

    notify(request);
  }

  function patchFetch(): void {
    if (originalFetch) {
      return;
    }

    originalFetch =
      window.fetch.bind(window);

    window.fetch = async (
      input,
      init
    ) => {
      const url = resolveUrl(input);

      if (
        !matchesFilter(
          url,
          options.urlFilter
        )
      ) {
        return originalFetch!(input, init);
      }

      const request: NetworkRequest = {
        id: crypto.randomUUID(),

        provider: detectProvider(url),

        method: resolveMethod(
          input,
          init
        ),

        url,

        phase: "pending",

        startedAt: Date.now(),
      };

      if (
        options.captureBodies &&
        init?.body !== undefined
      ) {
        request.requestBody =
          init.body;
      }

      addRequest(request);

      const started =
        performance.now();

      try {
        const response =
          await originalFetch!(
            input,
            init
          );

        const completed = {
          ...request,

          phase: "completed" as const,

          httpStatus:
            response.status,

          statusText:
            response.statusText,

          durationMs:
            performance.now() -
            started,
        };

        if (
          options.captureBodies
        ) {
          try {
            completed.responseBody =
              await captureResponseBody(
                response
              );
          } catch {}
        }

        updateRequest(completed);

        return response;
      } catch (error) {
        updateRequest({
          ...request,

          phase: "failed",

          durationMs:
            performance.now() -
            started,

          error:
            getErrorMessage(error),
        });

        throw error;
      }
    };
  }

  function restoreFetch(): void {
    if (!originalFetch) {
      return;
    }

    window.fetch = originalFetch;

    originalFetch = null;
  }

  return {
    start() {
      if (active) {
        return;
      }

      active = true;

      patchFetch();
    },

    stop() {
      if (!active) {
        return;
      }

      active = false;

      restoreFetch();
    },

    getRequests() {
      return [...requests];
    },

    clear() {
      requests = [];
    },

    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
}