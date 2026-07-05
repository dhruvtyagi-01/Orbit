export function createBadge() {
  const badge = document.createElement("div");

  badge.textContent = "🧬 Helix Active";

  badge.style.position = "fixed";
  badge.style.top = "20px";
  badge.style.right = "20px";
  badge.style.background = "#10b981";
  badge.style.color = "white";
  badge.style.padding = "8px 12px";
  badge.style.borderRadius = "8px";
  badge.style.zIndex = "999999";
  badge.style.fontWeight = "bold";

  document.body.appendChild(badge);
}