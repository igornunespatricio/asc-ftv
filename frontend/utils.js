const baseUrl = window.APP_CONFIG.apiUrl;

function authFetch(path, options = {}) {
  const token = localStorage.getItem("jwt");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
}
