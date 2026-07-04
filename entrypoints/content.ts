export default defineContentScript({
  matches: ["*://claude.ai/*"],

  async main() {
    console.log("🚀 Helix content script loaded!");

    const response = await browser.runtime.sendMessage({
      type: "HELIX_PING",
    });

    console.log("📨 Background replied:", response);
  },
});