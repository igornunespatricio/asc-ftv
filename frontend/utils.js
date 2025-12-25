const baseUrl = window.APP_CONFIG.apiUrl;

async function authFetch(path, options = {}) {
  const token = localStorage.getItem("jwt");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    // Erro REAL de rede (offline, DNS, CORS, etc)
    throw new Error("NetworkError");
  }

  // 🔴 Não autenticado → logout
  if (response.status === 401) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("auth");
    window.location.href = "/login.html";
    throw new Error("Unauthorized");
  }

  // ⛔ Não tem permissão → caller decide
  return response;
}

let statusTimeout;

function showStatus(message, type = "info", autoClear = true, duration = 5000) {
  const statusEl = document.getElementById("status");

  // limpa timeout anterior
  if (statusTimeout) {
    clearTimeout(statusTimeout);
  }

  statusEl.textContent = message;
  statusEl.className = "status-message " + type;

  if (autoClear) {
    statusTimeout = setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "";
    }, duration);
  }
}
