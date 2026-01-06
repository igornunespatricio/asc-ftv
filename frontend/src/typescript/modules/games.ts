// games.ts - Game management module
// Handles game CRUD operations, form interactions, and game display logic

import { showStatusMessage } from "../forms.js";
import {
  getElement,
  querySelector,
  clearTableBody,
  enableElement,
  addClass,
  setText,
} from "../dom.js";
import { authFetch } from "../utils.js";
import { canManageGames } from "../auth.js";
import type { Game, User, GameFormData } from "../types/api.js";

const baseUrl = (window as any).APP_CONFIG.apiUrl;
const gamesUrl = `${baseUrl}/games`;
const usersUrl = `${baseUrl}/users`;

/* ============================================================
   CARREGAR OPÇÕES DE MESES
   ============================================================ */
function generateMonthOptions(): void {
  const select = getElement("month-selector") as HTMLSelectElement;
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
async function loadGames(month: string): Promise<void> {
  try {
    const response = await authFetch(`/games?month=${month}`);
    const games: Game[] = await response.json();

    // Use DOM utility to clear table
    clearTableBody("games-table");

    // Create custom row processor for games data
    const tableBody = querySelector("#games-table tbody") as HTMLTableSectionElement;
    if (!tableBody) return;

    games.forEach((game: Game) => {
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
   CARREGAR USERS NOS SELECTS DO FORMULÁRIO
   ============================================================ */
async function loadUsersForSelects(): Promise<void> {
  const selects = [
    getElement("winner1") as HTMLSelectElement,
    getElement("winner2") as HTMLSelectElement,
    getElement("loser1") as HTMLSelectElement,
    getElement("loser2") as HTMLSelectElement,
  ];

  try {
    const response = await authFetch(`/users`);
    let users: User[] = await response.json();

    users.sort((a: User, b: User) => a.username.localeCompare(b.username));

    selects.forEach(
      (sel: HTMLSelectElement) => (sel.innerHTML = '<option value="">Selecione</option>'),
    );

    users.forEach((user: User) => {
      selects.forEach((select: HTMLSelectElement) => {
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

function setupUserDuplicateBlocking(): void {
  userSelectIds.forEach((id: string) => {
    const select = getElement(id) as HTMLSelectElement;
    select.addEventListener("change", updateUserOptions);
  });
  updateUserOptions();
}

function updateUserOptions(): void {
  const submitBtn = querySelector("button[type='submit']") as HTMLButtonElement;
  const status = getElement("status") as HTMLElement;

  const selectedValues = userSelectIds
    .map((id: string) => (getElement(id) as HTMLSelectElement).value)
    .filter((v: string) => v !== "");

  const hasDuplicates = selectedValues.length !== new Set(selectedValues).size;

  userSelectIds.forEach((id: string) => {
    const select = getElement(id) as HTMLSelectElement;
    Array.from(select.options).forEach((option: HTMLOptionElement) => {
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

function applyPermissions(): void {
  const form = getElement("game-form") as HTMLFormElement;
  const container = getElement("add-game-container") as HTMLElement;
  const content = container?.querySelector(".form-content") as HTMLElement;

  if (!form || !container || !content) return;
  if (canManageGames()) return;

  /* 1️⃣ Bloqueio funcional */
  form.querySelectorAll("input, select, button").forEach((el: Element) => {
    (el as HTMLInputElement).disabled = true;
  });

  /* 2️⃣ Blur apenas no conteúdo */
  addClass("add-game-container", "blurred");

  container.style.position = "relative";

  /* 3️⃣ Overlay sem blur */
  if (!container.querySelector(".form-overlay")) {
    const overlay = document.createElement("div");
    overlay.className = "form-overlay";
    overlay.innerHTML = `
      <div class="overlay-message">
        🔒 Apenas usuários autorizados podem adicionar partidas
      </div>
    `;
    container.appendChild(overlay);
  }
}

/* ============================================================
   ADICIONAR NOVA PARTIDA
   ============================================================ */
function setupGameForm(loadRankingCallback: (month: string) => void): void {
  getElement("game-form")?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const picks = [
      formData.get("winner1") as string,
      formData.get("winner2") as string,
      formData.get("loser1") as string,
      formData.get("loser2") as string,
    ];

    const filled = picks.filter((v: string) => v !== "");
    const duplicatesExist = new Set(filled).size !== filled.length;

    if (duplicatesExist) {
      showStatusMessage(
        "⚠️ Existem jogadores duplicados — revise os seletores.",
        "error",
      );
      return;
    }

    const data: GameFormData = {
      match_date: (form.match_date as HTMLInputElement).value,
      winner1: (form.winner1 as HTMLSelectElement).value,
      winner2: (form.winner2 as HTMLSelectElement).value,
      loser1: (form.loser1 as HTMLSelectElement).value,
      loser2: (form.loser2 as HTMLSelectElement).value,
      score_winner: (form.score_winner as HTMLInputElement).value,
      score_loser: (form.score_loser as HTMLInputElement).value,
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

        const selectedMonth = (getElement("month-selector") as HTMLSelectElement).value;
        loadGames(selectedMonth);
        loadRankingCallback(selectedMonth);
        return;
      }

      if (response.status === 403) {
        showStatusMessage(
          "⛔ Você não tem permissão para adicionar partidas.",
          "error",
        );
        return;
      }

      showStatusMessage(`Erro: ${result.message}`, "error");
    } catch (err: any) {
      if (err.message === "NetworkError") {
        showStatusMessage("❌ Erro de rede. Verifique sua conexão.", "error");
      } else {
        showStatusMessage("❌ Erro inesperado.", "error");
      }
    }
  });
}

// Exported functions for main.js
export async function initGames(loadRankingCallback: (month: string) => void): Promise<void> {
  generateMonthOptions();
  await loadUsersForSelects();
  setupUserDuplicateBlocking();
  applyPermissions();
  setupGameForm(loadRankingCallback);

  const currentMonth = (document.getElementById("month-selector") as HTMLSelectElement).value;
  loadGames(currentMonth);
}

export function loadGamesForMonth(month: string): void {
  loadGames(month);
}
