function getToken(): string | null {
  return localStorage.getItem("jwt");
}

function getAuth(): any {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
}

function hasRole(requiredRole: string): boolean {
  const auth = getAuth();
  return auth?.role === requiredRole;
}

function canManageGames(): boolean {
  const auth = getAuth();
  return auth?.role === "admin" || auth?.role === "game_inputer";
}

function canManageUsers(): boolean {
  const auth = getAuth();
  return auth?.role === "admin";
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return !payload.exp || payload.exp < now;
  } catch {
    return true;
  }
}

function logout(): void {
  localStorage.removeItem("jwt");
  localStorage.removeItem("auth");
  window.location.href = "../pages/login.html";
}

function requireAuth(): void {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    logout();
  }
}

function requireAdmin(): void {
  requireAuth();

  const auth = getAuth();

  if (!auth || auth.role !== "admin") {
    logout();
  }
}

// Executa automaticamente ao carregar a página
requireAuth();

// Check if current page requires admin access
if (window.location.pathname.includes('users.html')) {
  requireAdmin();
}

// Export functions for use in other modules
export { getToken, getAuth, hasRole, canManageGames, canManageUsers, logout, requireAuth, requireAdmin };
