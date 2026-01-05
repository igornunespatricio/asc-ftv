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

async function loadPublicRanking() {
  const loading = document.getElementById("ranking-loading");
  const table = document.getElementById("ranking-table");
  const error = document.getElementById("ranking-error");

  try {
    loading.style.display = "block";
    table.style.display = "none";
    error.style.display = "none";

    const response = await publicFetch("/ranking");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const ranking = await response.json();

    // Clear table
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    // Populate table
    ranking.forEach((player) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Posição">${player.position}</td>
        <td data-label="Jogador">${player.player}</td>
        <td data-label="Pontos">${player.points}</td>
        <td data-label="Partidas">${player.matches}</td>
        <td data-label="Vitórias">${player.wins}</td>
        <td data-label="Derrotas">${player.losses}</td>
        <td data-label="Eficiência">${player.efficiency}%</td>
      `;
      tbody.appendChild(row);
    });

    loading.style.display = "none";
    table.style.display = "table";
  } catch (err) {
    console.error("Error loading ranking:", err);
    loading.style.display = "none";
    error.style.display = "block";
  }
}

// Load ranking on page load
document.addEventListener("DOMContentLoaded", () => {
  loadPublicRanking();
});
