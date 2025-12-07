const baseUrl = window.APP_CONFIG.apiUrl;
const gamesUrl = `${baseUrl}/games`;
const rankingUrl = `${baseUrl}/ranking`;

/* ============================================================
   CARREGAR OPÇÕES DE MESES
   ============================================================ */
function generateMonthOptions() {
  const select = document.getElementById("month-selector");

  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    if (i === 0) option.selected = true; // mês atual

    select.appendChild(option);
  }
}

/* ============================================================
   CARREGAR HISTÓRICO DE JOGOS
   ============================================================ */
async function loadGames() {
  const tableBody = document.querySelector("#games-table tbody");

  try {
    const response = await fetch(gamesUrl);
    const games = await response.json();

    tableBody.innerHTML = "";

    games.forEach((game) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Data">${game.match_date}</td>
        <td data-label="Vencedores">${game.winner1} / ${game.winner2}</td>
        <td data-label="Perdedores">${game.loser1} / ${game.loser2}</td>
        <td data-label="Placar">${game.score_winner} x ${game.score_loser}</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao carregar jogos:", err);
  }
}

/* ============================================================
   CARREGAR RANKING MENSAL
   ============================================================ */
async function loadRanking(month) {
  const tableBody = document.querySelector("#ranking-table tbody");
  const url = month ? `${rankingUrl}?month=${month}` : rankingUrl;
  try {
    const response = await fetch(url);
    const ranking = await response.json();

    tableBody.innerHTML = "";

    ranking.forEach((player) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Position">${player.position}</td>
        <td data-label="Player">${player.player}</td>
        <td data-label="Points">${player.points}</td>
        <td data-label="Matches">${player.matches}</td>
        <td data-label="Wins">${player.wins}</td>
        <td data-label="Losses">${player.losses}</td>
        <td data-label="Efficiency">${player.efficiency}%</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading ranking:", err);
  }
}

/* ============================================================
   ADICIONAR NOVA PARTIDA
   ============================================================ */
document.getElementById("game-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    match_date: form.match_date.value,
    winner1: form.winner1.value,
    winner2: form.winner2.value,
    loser1: form.loser1.value,
    loser2: form.loser2.value,
    score_winner: form.score_winner.value,
    score_loser: form.score_loser.value,
  };

  try {
    const response = await fetch(gamesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("status").textContent =
        `Jogo adicionado com sucesso! ID: ${result.id}`;

      form.reset();

      // Recarrega tabelas
      loadGames();
      const selectedMonth = document.getElementById("month-selector").value;
      loadRanking(selectedMonth);
    } else {
      document.getElementById("status").textContent = `Erro: ${result.message}`;
    }
  } catch (err) {
    document.getElementById("status").textContent =
      `Erro de rede: ${err.message}`;
  }
});

/* ============================================================
   AO CARREGAR A PÁGINA
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  generateMonthOptions();
  const currentMonth = document.getElementById("month-selector").value;
  loadGames();
  loadRanking(currentMonth);
});

document.getElementById("month-selector").addEventListener("change", (e) => {
  const selectedMonth = e.target.value;
  loadRanking(selectedMonth);
});
