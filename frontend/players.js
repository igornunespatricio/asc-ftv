const baseUrl = window.APP_CONFIG.apiUrl;
const playersUrl = `${baseUrl}/players`;

/* ============================================================
   FUNÇÃO: LISTAR PLAYERS
   ============================================================ */
async function loadPlayers() {
  const tableBody = document.querySelector("#players-table tbody");

  try {
    const response = await fetch(playersUrl);
    const players = await response.json();

    tableBody.innerHTML = "";

    players.forEach((player) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Nome">${player.name}</td>
        <td data-label="Apelido">${player.nickname || ""}</td>
        <td data-label="Criado em">${new Date(player.createdAt).toLocaleString()}</td>
        <td data-label="Ações">
          <button class="btn-edit" data-id="${player.id}" data-name="${player.name}" data-nickname="${player.nickname || ""}">Editar</button>
          <button class="btn-delete" data-id="${player.id}">Deletar</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    attachPlayerButtons();
  } catch (err) {
    console.error("Erro ao carregar players:", err);
  }
}

/* ============================================================
   FUNÇÃO: ADICIONAR OU ATUALIZAR PLAYER
   ============================================================ */
document.getElementById("player-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const id = form.player_id.value;
  const data = {
    name: form.player_name.value,
    nickname: form.player_nickname.value || undefined,
  };

  try {
    const response = await fetch(id ? `${playersUrl}/${id}` : playersUrl, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("status").textContent = id
        ? `Jogador atualizado!`
        : `Jogador criado! ID: ${result.id}`;

      form.reset();
      form.player_id.value = "";

      loadPlayers();
    } else {
      document.getElementById("status").textContent = `Erro: ${result.message}`;
    }
  } catch (err) {
    document.getElementById("status").textContent =
      `Erro de rede: ${err.message}`;
  }
});

/* ============================================================
   FUNÇÃO: BOTÕES DE EDITAR E DELETAR
   ============================================================ */
function attachPlayerButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("player_id").value = btn.dataset.id;
      document.getElementById("player_name").value = btn.dataset.name;
      document.getElementById("player_nickname").value = btn.dataset.nickname;
      document.getElementById("status").textContent = "Editando jogador...";
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Deseja realmente deletar este jogador?")) return;

      const id = btn.dataset.id;

      try {
        const response = await fetch(`${playersUrl}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          document.getElementById("status").textContent = "Jogador deletado!";
          loadPlayers();
        } else {
          const result = await response.json();
          document.getElementById("status").textContent =
            `Erro: ${result.message}`;
        }
      } catch (err) {
        document.getElementById("status").textContent =
          `Erro de rede: ${err.message}`;
      }
    });
  });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  loadPlayers();
});
