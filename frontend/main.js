const apiUrl = window.APP_CONFIG.apiUrl;

async function loadGames() {
  const tableBody = document.querySelector("#games-table tbody");

  try {
    const response = await fetch(apiUrl); // GET no mesmo endpoint
    const games = await response.json();

    // Limpa a tabela
    tableBody.innerHTML = "";

    games.forEach(game => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${game.match_date}</td>
        <td>${game.winner1} / ${game.winner2}</td>
        <td>${game.loser1} / ${game.loser2}</td>
        <td>${game.scores || "-"}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Erro ao carregar jogos:", err);
  }
}

document.getElementById("game-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    match_date: form.match_date.value,
    winner1: form.winner1.value,
    winner2: form.winner2.value,
    loser1: form.loser1.value,
    loser2: form.loser2.value,
    scores: form.scores.value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("status").textContent = `Jogo adicionado com sucesso! ID: ${result.id}`;
      form.reset();
      loadGames();
    } else {
      document.getElementById("status").textContent = `Erro: ${result.message}`;
    }
  } catch (err) {
    document.getElementById("status").textContent = `Erro de rede: ${err.message}`;
  }
});

window.addEventListener("DOMContentLoaded", loadGames);
