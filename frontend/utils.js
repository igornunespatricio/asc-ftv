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

async function publicFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

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

  // For public endpoints, return response and let caller handle status codes
  return response;
}
