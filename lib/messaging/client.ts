import { MessageType } from "./types";

export async function sendMessage<T = unknown>(
  type: MessageType,
  payload?: unknown
): Promise<T> {
  return browser.runtime.sendMessage({
    type,
    payload,
  });
}