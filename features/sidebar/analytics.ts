import { TokenStats } from "../../utils/tokenEstimator";
import { getSidebarContent } from "./sidebar";

export function updateAnalytics(stats: TokenStats | null) {
  const container = getSidebarContent();

  // Show "waiting" state when no stats or no messages
  if (!stats || stats.totalMessages === 0) {
    container.innerHTML = `
      <div class="helix-waiting">
        <div class="helix-waiting-icon">⏳</div>
        <div class="helix-waiting-text">Waiting for first message...</div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="helix-section">
      <div class="helix-title">Conversation</div>

      <div class="helix-row">
        <span>Messages</span>
        <span>${stats.totalMessages}</span>
      </div>

      <div class="helix-row">
        <span>Estimated Tokens</span>
        <span>${stats.totalTokens}</span>
      </div>

      <div class="helix-row">
        <span>User Tokens</span>
        <span>${stats.userTokens}</span>
      </div>

      <div class="helix-row">
        <span>Claude Tokens</span>
        <span>${stats.assistantTokens}</span>
      </div>

      <div class="helix-row">
        <span>Average</span>
        <span>${stats.averageTokens}</span>
      </div>

      <div class="helix-row">
        <span>Largest</span>
        <span>${stats.largestMessageTokens}</span>
      </div>
    </div>
  `;
}