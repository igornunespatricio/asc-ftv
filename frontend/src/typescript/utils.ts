const apiBaseUrl = (window as any).APP_CONFIG.apiUrl;

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("jwt");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
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

async function publicFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
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

// Export functions for use in other modules
export { authFetch, publicFetch };
