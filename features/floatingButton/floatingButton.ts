import "./floatingButton.css";
import { toggleSidebar } from "../sidebar/sidebar";
import orbitIcon from "../../assets/logo/orbit-icon.svg";

export function createFloatingButton() {
  if (document.getElementById("helix-floating-button")) {
    return;
  }

  const button = document.createElement("button");

  button.id = "helix-floating-button";
  button.title = "Orbit";

  button.innerHTML = `
    <img
      src="${orbitIcon}"
      alt="Orbit"
      width="34"
      height="34"
    />
  `;

  button.addEventListener("click", toggleSidebar);

  document.body.appendChild(button);
}
