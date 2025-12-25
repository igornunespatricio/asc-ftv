function getToken() {
  return localStorage.getItem("jwt");
}

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
}

function hasRole(requiredRole) {
  const auth = getAuth();
  return auth?.role === requiredRole;
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return !payload.exp || payload.exp < now;
  } catch {
    return true;
  }
}

function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("auth");
  window.location.href = "/login.html";
}

function requireAuth() {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    logout();
  }
}

// Executa automaticamente ao carregar a página
requireAuth();
