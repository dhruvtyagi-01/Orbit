import {
  JSON_CONTENT_TYPE,
  PROVIDER_HOSTS,
} from "./constants";

import type {
  AIProvider,
  HttpMethod,
} from "./types";

export function detectProvider(
  url: string
): AIProvider {
  const providers = Object.keys(
    PROVIDER_HOSTS
  ) as AIProvider[];

  for (const provider of providers) {
    const hosts = PROVIDER_HOSTS[provider];

    if (hosts.some((host) => url.includes(host))) {
      return provider;
    }
  }

  return "unknown";
}

export function resolveUrl(
  input: RequestInfo | URL
): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  return input.url;
}

export function resolveMethod(
  input: RequestInfo | URL,
  init?: RequestInit
): HttpMethod {
  const method =
    init?.method ??
    (input instanceof Request
      ? input.method
      : "GET");

  return method.toUpperCase() as HttpMethod;
}

export function matchesFilter(
  url: string,
  filter?: string | RegExp
): boolean {
  if (!filter) {
    return true;
  }

  if (typeof filter === "string") {
    return url.includes(filter);
  }

  return filter.test(url);
}

export function getErrorMessage(
  error: unknown
): string {
  return error instanceof Error
    ? error.message
    : String(error);
}

export async function captureResponseBody(
  response: Response
): Promise<unknown> {
  const clone = response.clone();

  const contentType =
    clone.headers.get("content-type") ?? "";

  if (
    contentType.includes(
      JSON_CONTENT_TYPE
    )
  ) {
    return clone.json();
  }

  return clone.text();
}