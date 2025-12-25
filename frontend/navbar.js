async function loadNavbar() {
  const container = document.getElementById("navbar");
  if (!container) return;

  const res = await fetch("partials/navbar.html");
  container.innerHTML = await res.text();

  const auth = getAuth();

  if (!auth?.username) {
    logout();
    return;
  }

  document.getElementById("nav-username").textContent = auth.username;
  document.getElementById("nav-role").textContent = auth.role;

  if (auth.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach((el) => el.remove());
  }

  document.getElementById("logout-btn").addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", loadNavbar);
