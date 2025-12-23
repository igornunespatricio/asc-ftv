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

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const data = await response.json();

    // Salva o JWT
    localStorage.setItem("jwt", data.token);

    // Redireciona para a home
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Usuário ou senha inválidos";
  }
}
