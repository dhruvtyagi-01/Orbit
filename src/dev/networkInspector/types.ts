export type AIProvider =
  | "claude"
  | "chatgpt"
  | "gemini"
  | "grok"
  | "unknown";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type NetworkRequestPhase =
  | "pending"
  | "completed"
  | "failed";

export interface NetworkRequest {
  id: string;

  provider: AIProvider;

  method: HttpMethod;
  url: string;

  phase: NetworkRequestPhase;

  httpStatus?: number;
  statusText?: string;

  requestBody?: unknown;
  responseBody?: unknown;

  startedAt: number;
  durationMs?: number;

  error?: string;
}

export type NetworkRequestListener = (
  request: NetworkRequest
) => void;

export interface NetworkInspectorOptions {
  urlFilter?: string | RegExp;

  captureBodies?: boolean;

  maxRequests?: number;
}

export interface NetworkInspector {
  start(): void;

  stop(): void;

  getRequests(): readonly NetworkRequest[];

  clear(): void;

  subscribe(
    listener: NetworkRequestListener
  ): () => void;
}