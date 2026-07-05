import "./floatingButton.css";
import { toggleSidebar } from "../sidebar/sidebar";

export function createFloatingButton() {
  if (document.getElementById("helix-floating-button")) {
    return;
  }

  const button = document.createElement("button");

  button.id = "helix-floating-button";

  button.innerHTML = "🧬";

  button.title = "Project Helix";

  button.addEventListener("click", () => {
    toggleSidebar();
  });

  document.body.appendChild(button);
}