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

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  // 🔴 TOKEN EXPIRADO OU INVÁLIDO
  if (response.status === 401 || response.status === 403) {
    console.warn("Token expirado ou inválido, redirecionando para login");
    localStorage.removeItem("jwt");
    window.location.href = "/login.html";
    throw new Error("Unauthorized");
  }

  return response;
}
