function getToken() {
  return localStorage.getItem("jwt");
}

function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
  }
}

// Executa automaticamente ao carregar a página
requireAuth();
