// const baseUrl = window.APP_CONFIG.apiUrl;
const gamesUrl = `${baseUrl}/games`;
const rankingUrl = `${baseUrl}/ranking`;
const usersUrl = `${baseUrl}/users`;

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
    if (i === 0) option.selected = true;

    select.appendChild(option);
  }
}

/* ============================================================
   CARREGAR HISTÓRICO DE JOGOS
   ============================================================ */
async function loadGames(month) {
  const tableBody = document.querySelector("#games-table tbody");

  try {
    const response = await authFetch(`/games?month=${month}`);
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

  try {
    const response = await authFetch(`/ranking?month=${month}`);
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
  const status = document.getElementById("status");

  const picks = [
    form.winner1.value,
    form.winner2.value,
    form.loser1.value,
    form.loser2.value,
  ];

  const filled = picks.filter((v) => v !== "");
  const duplicatesExist = new Set(filled).size !== filled.length;

  if (duplicatesExist) {
    showStatusMessage(
      "⚠️ Existem jogadores duplicados — revise os seletores.",
      "error",
    );
    return;
  }

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
    const response = await authFetch(`/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showStatusMessage(
        `Jogo adicionado com sucesso! ID: ${result.id}`,
        "success",
      );
      form.reset();
      updateUserOptions();

      const selectedMonth = document.getElementById("month-selector").value;
      loadGames(selectedMonth);
      loadRanking(selectedMonth);
    } else {
      showStatusMessage(`Erro: ${result.message}`, "error");
    }
  } catch (err) {
    showStatusMessage(`Erro de rede: ${err.message}`, "error");
  }
});

/* ============================================================
   CARREGAR USERS NOS SELECTS DO FORMULÁRIO
   ============================================================ */
async function loadUsersForSelects() {
  const selects = [
    document.getElementById("winner1"),
    document.getElementById("winner2"),
    document.getElementById("loser1"),
    document.getElementById("loser2"),
  ];

  try {
    const response = await authFetch(`/users`);
    let users = await response.json();

    users.sort((a, b) => a.username.localeCompare(b.username));

    selects.forEach(
      (sel) => (sel.innerHTML = '<option value="">Selecione</option>'),
    );

    users.forEach((user) => {
      selects.forEach((select) => {
        const opt = document.createElement("option");
        opt.value = user.username;
        opt.textContent = user.username;
        select.appendChild(opt);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar usuários nos selects:", err);
  }
}

/* ============================================================
   EVITAR SELEÇÃO DUPLICADA DE USERS
   ============================================================ */
const userSelectIds = ["winner1", "winner2", "loser1", "loser2"];

function setupUserDuplicateBlocking() {
  userSelectIds.forEach((id) => {
    const select = document.getElementById(id);
    select.addEventListener("change", updateUserOptions);
  });
  updateUserOptions();
}

function updateUserOptions() {
  const submitBtn = document.querySelector(".btn-submit");
  const status = document.getElementById("status");

  const selectedValues = userSelectIds
    .map((id) => document.getElementById(id).value)
    .filter((v) => v !== "");

  const hasDuplicates = selectedValues.length !== new Set(selectedValues).size;

  userSelectIds.forEach((id) => {
    const select = document.getElementById(id);
    Array.from(select.options).forEach((option) => {
      if (option.value === "") return;
      if (option.value === select.value) {
        option.disabled = false;
        return;
      }
      option.disabled = selectedValues.includes(option.value);
    });
  });

  if (submitBtn) submitBtn.disabled = hasDuplicates;

  if (hasDuplicates) {
    showStatusMessage(
      "⚠️ Existem jogadores duplicados — revise os seletores.",
      "error",
      false,
    );
  } else if (status.classList.contains("error")) {
    status.textContent = "";
    status.className = "";
  }
}

function showStatusMessage(message, type, autoClear = true) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status-message ${type}`;
  if (autoClear) {
    setTimeout(() => {
      status.textContent = "";
      status.className = "";
    }, 10000);
  }
}

/* ============================================================
   AO CARREGAR A PÁGINA
   ============================================================ */
window.addEventListener("DOMContentLoaded", async () => {
  generateMonthOptions();
  const currentMonth = document.getElementById("month-selector").value;
  await loadUsersForSelects();
  setupUserDuplicateBlocking();
  loadGames(currentMonth);
  loadRanking(currentMonth);
});

document.getElementById("month-selector").addEventListener("change", (e) => {
  const selectedMonth = e.target.value;
  loadGames(selectedMonth);
  loadRanking(selectedMonth);
});
