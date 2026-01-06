import { getAuth, logout } from "./auth.js";

async function loadNavbar(): Promise<void> {
  const container = document.getElementById("navbar") as HTMLElement;
  if (!container) return;

  const res = await fetch("../partials/navbar.html");
  container.innerHTML = await res.text();

  const auth = getAuth();

  if (!auth?.username) {
    logout();
    return;
  }

  const usernameElement = document.getElementById("nav-username") as HTMLElement;
  const roleElement = document.getElementById("nav-role") as HTMLElement;
  const logoutBtn = document.getElementById("logout-btn") as HTMLElement;

  if (usernameElement) usernameElement.textContent = auth.username;
  if (roleElement) roleElement.textContent = auth.role;

  if (auth.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach((el: Element) => el.remove());
  }

  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", loadNavbar);
