// Usa a mesma configuração global do frontend
const baseUrl = window.APP_CONFIG.apiUrl;
const loginUrl = `${baseUrl}/login`;

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("login-status");

  status.innerText = "⏳ Entrando...";

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.status === 401) {
      status.innerText = "❌ Usuário ou senha inválidos";
      return;
    }

    if (!response.ok) {
      status.innerText = "❌ Erro ao efetuar login";
      return;
    }

    const data = await response.json();

    const token = data.token;
    // Salva o JWT
    localStorage.setItem("jwt", token);

    const payload = parseJwt(token);
    localStorage.setItem(
      "auth",
      JSON.stringify({
        email: payload.email,
        username: payload.username,
        role: payload.role,
      }),
    );

    // Redireciona para a home
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Usuário ou senha inválidos";
  }
}

function parseJwt(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}
