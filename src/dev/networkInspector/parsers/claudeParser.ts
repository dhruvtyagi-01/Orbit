export interface ClaudeUsageWindow {
  status?: string;
  resetsAt?: string;
  utilization?: number;
}

export interface ClaudeUsage {
  session: ClaudeUsageWindow;
  weekly: ClaudeUsageWindow;

  percent?: number;
  severity?: string;

  model?: string;

  raw: unknown;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

export function parseClaudeUsage(payload: unknown): ClaudeUsage | null {
  if (!isObject(payload)) {
    return null;
  }

  const windows = isObject(payload.windows) ? payload.windows : {};

  const fiveHour = isObject(windows["5h"]) ? windows["5h"] : {};
  const weekly = isObject(windows["7d"]) ? windows["7d"] : {};

  const resolved = isObject(payload.resolved) ? payload.resolved : {};
  const limit = isObject(resolved.limit) ? resolved.limit : {};

  return {
    session: {
      status: fiveHour.status,
      resetsAt: fiveHour.resets_at,
      utilization: fiveHour.utilization,
    },

    weekly: {
      status: weekly.status,
      resetsAt: weekly.resets_at,
      utilization: weekly.utilization,
    },

    percent:
      typeof limit.percent === "number"
        ? limit.percent
        : undefined,

    severity:
      typeof limit.severity === "string"
        ? limit.severity
        : undefined,

    raw: payload,
  };
}