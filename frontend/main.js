const baseUrl = window.APP_CONFIG.apiUrl;
const gamesUrl = `${baseUrl}/games`;
const rankingUrl = `${baseUrl}/ranking`;
const playersUrl = `${baseUrl}/players`;

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
async function loadGames(month) {
  const tableBody = document.querySelector("#games-table tbody");
  const url = `${gamesUrl}?month=${month}`;
  try {
    const response = await fetch(url);
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
  const url = `${rankingUrl}?month=${month}`;
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
  const status = document.getElementById("status");

  // ================================
  // BLOQUEIO DE SUBMISSÃO SE HÁ DUPLICADOS
  // ================================
  const picks = [
    form.winner1.value,
    form.winner2.value,
    form.loser1.value,
    form.loser2.value,
  ];

  const filled = picks.filter((v) => v !== "");
  const duplicatesExist = new Set(filled).size !== filled.length;

  if (duplicatesExist) {
    status.textContent =
      "⚠️ Existem jogadores duplicados — revise os seletores.";
    status.className = "status-message error";
    return;
  }
  // ================================

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
      status.textContent = `Jogo adicionado com sucesso! ID: ${result.id}`;
      status.className = "status-message success";

      form.reset();

      // limpa bloqueio visual após reset
      updatePlayerOptions();

      // Recarrega tabelas
      const selectedMonth = document.getElementById("month-selector").value;
      loadGames(selectedMonth);
      loadRanking(selectedMonth);
    } else {
      status.textContent = `Erro: ${result.message}`;
      status.className = "status-message error";
    }
  } catch (err) {
    status.textContent = `Erro de rede: ${err.message}`;
    status.className = "status-message error";
  }
});

/* ============================================================
   CARREGAR JOGADORES NOS SELECTS DO FORMULÁRIO
   ============================================================ */
async function loadPlayersForSelects() {
  const selects = [
    document.getElementById("winner1"),
    document.getElementById("winner2"),
    document.getElementById("loser1"),
    document.getElementById("loser2"),
  ];

  try {
    const response = await fetch(playersUrl);
    let players = await response.json();

    // Ordenar
    players.sort((a, b) => a.name.localeCompare(b.name));

    // Limpar selects
    selects.forEach(
      (sel) => (sel.innerHTML = '<option value="">Selecione</option>'),
    );

    // Preencher
    players.forEach((player) => {
      selects.forEach((select) => {
        const opt = document.createElement("option");
        opt.value = player.name; // mantém compatibilidade com backend atual
        opt.textContent = player.name; // exibe o nome
        select.appendChild(opt);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar jogadores nos selects:", err);
  }
}

/* ============================================================
   EVITAR SELEÇÃO DUPLICADA DE JOGADORES
   ============================================================ */

// IDs dos selects de jogadores
const playerSelectIds = ["winner1", "winner2", "loser1", "loser2"];

// Adiciona listeners após carregar as opções dos jogadores
function setupPlayerDuplicateBlocking() {
  playerSelectIds.forEach((id) => {
    const select = document.getElementById(id);
    select.addEventListener("change", updatePlayerOptions);
  });

  // Atualiza estado inicial
  updatePlayerOptions();
}

function updatePlayerOptions() {
  // Pega referência ao botão de submit (classe .btn-submit)
  const submitBtn = document.querySelector(".btn-submit");
  const status = document.getElementById("status");
  // Coletar todos os jogadores já selecionados
  const selectedValues = playerSelectIds
    .map((id) => document.getElementById(id).value)
    .filter((v) => v !== "");

  // Verifica se existem duplicados
  const hasDuplicates = selectedValues.length !== new Set(selectedValues).size;

  // Atualiza cada select
  playerSelectIds.forEach((id) => {
    const select = document.getElementById(id);

    Array.from(select.options).forEach((option) => {
      if (option.value === "") return; // deixa o "Selecione" livre

      // Se este option é o próprio selecionado, mantenha habilitado
      if (option.value === select.value) {
        option.disabled = false;
        return;
      }

      // Desabilita se já foi escolhido em outro select
      option.disabled = selectedValues.includes(option.value);
    });
  });

  // Habilita/desabilita o botão de submit conforme duplicidade
  if (submitBtn) {
    submitBtn.disabled = hasDuplicates;
  }
  // Mostra ou limpa mensagem
  // Atualiza mensagem visual de duplicidade
  if (hasDuplicates) {
    status.textContent =
      "⚠️ Existem jogadores duplicados — revise os seletores.";
    status.className = "status-message error";
  } else {
    // Só apaga mensagem se o status atual for de erro
    if (status.classList.contains("error")) {
      status.textContent = "";
      status.className = "";
    }
  }
}

/* ============================================================
   AO CARREGAR A PÁGINA
   ============================================================ */
window.addEventListener("DOMContentLoaded", async () => {
  generateMonthOptions();
  const currentMonth = document.getElementById("month-selector").value;
  await loadPlayersForSelects();
  setupPlayerDuplicateBlocking();
  loadGames(currentMonth);
  loadRanking(currentMonth);
});

document.getElementById("month-selector").addEventListener("change", (e) => {
  const selectedMonth = e.target.value;
  loadGames(selectedMonth);
  loadRanking(selectedMonth);
});
