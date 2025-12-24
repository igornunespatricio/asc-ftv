function getToken() {
  return localStorage.getItem("jwt");
}

function isTokenExpired(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);

    return !payload.exp || payload.exp < now;
  } catch (err) {
    return true;
  }
}

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "login.html";
}

function requireAuth() {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    logout();
  }
}

// Executa automaticamente ao carregar a página
requireAuth();
