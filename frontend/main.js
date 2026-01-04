import { initGames, loadGamesForMonth } from "./games.js";
import { loadRankingForMonth } from "./ranking.js";

// const baseUrl = window.APP_CONFIG.apiUrl;

/* ============================================================
   AO CARREGAR A PÁGINA
   ============================================================ */
window.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  await initGames(loadRankingForMonth);

  const currentMonth = document.getElementById("month-selector").value;
  loadRankingForMonth(currentMonth);
});

document.getElementById("month-selector").addEventListener("change", (e) => {
  const selectedMonth = e.target.value;
  loadGamesForMonth(selectedMonth);
  loadRankingForMonth(selectedMonth);
});
