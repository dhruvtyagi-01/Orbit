import {
  registerHandler,
  startMessageServer,
  MessageType,
} from "../lib/messaging";

export default defineBackground(() => {
  console.log("🚀 Helix background started!");

  registerHandler(MessageType.PING, () => {
    return {
      success: true,
      reply: "Hello from the background!",
    };
  });

  startMessageServer();
});