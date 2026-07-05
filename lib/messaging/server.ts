import { MessageType } from "./types";

type Handler = (payload: unknown) => unknown | Promise<unknown>;

const handlers = new Map<MessageType, Handler>();

export function registerHandler(
  type: MessageType,
  handler: Handler
) {
  handlers.set(type, handler);
}

export function startMessageServer() {
  browser.runtime.onMessage.addListener(async (message) => {
    const handler = handlers.get(message.type);

    if (!handler) {
      console.warn(`No handler for message: ${message.type}`);
      return;
    }

    return handler(message.payload);
  });
}