import type { AIProvider } from "./types";

type ProviderHosts = Record<
  AIProvider,
  readonly string[]
>;

export const DEFAULT_MAX_REQUESTS = 200;

export const JSON_CONTENT_TYPE =
  "application/json";

export const PROVIDER_HOSTS: ProviderHosts = {
  claude: ["claude.ai"],

  chatgpt: [
    "chatgpt.com",
    "chat.openai.com",
    "openai.com",
  ],

  gemini: ["gemini.google.com"],

  grok: ["grok"],

  unknown: [],
};