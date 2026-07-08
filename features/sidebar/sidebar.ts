import "./sidebar.css";
import orbitIcon from "../../assets/logo/orbit-icon.svg";

let sidebar: HTMLDivElement | null = null;
let content: HTMLDivElement | null = null;

export function getSidebarContent(): HTMLDivElement {
  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "helix-sidebar";

    sidebar.innerHTML = `
      <div id="helix-sidebar-header">
        <img src="${orbitIcon}" width="26" height="26" alt="Orbit" />
        <span>Orbit</span>
      </div>

      <div id="helix-sidebar-content">
        <div class="helix-waiting">
          <div class="helix-waiting-icon">⏳</div>
          <div class="helix-waiting-text">Waiting for first message...</div>
        </div>
      </div>
    `;

    document.body.appendChild(sidebar);

    content = sidebar.querySelector(
      "#helix-sidebar-content"
    ) as HTMLDivElement;
  }

  return content!;
}

export function toggleSidebar() {
  getSidebarContent();
  sidebar!.classList.toggle("open");
}