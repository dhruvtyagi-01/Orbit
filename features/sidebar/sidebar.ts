import "./sidebar.css";

let sidebar: HTMLDivElement | null = null;

export function toggleSidebar() {
  if (!sidebar) {
    sidebar = document.createElement("div");

    sidebar.id = "helix-sidebar";

    sidebar.innerHTML = `
      <div id="helix-sidebar-header">
        🧬 Project Helix
      </div>

      <div id="helix-sidebar-content">
        Welcome to Helix 👋
      </div>
    `;

    document.body.appendChild(sidebar);
  }

  sidebar.classList.toggle("open");
}
