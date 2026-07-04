export default defineBackground(() => {
  console.log("🚀 Helix background started!", {
    id: browser.runtime.id,
  });

browser.runtime.onMessage.addListener(async (message, sender) => {
  console.log("📩 Background received:", message);

  return {
    success: true,
    reply: "Hello from the background!",
  };
});
})