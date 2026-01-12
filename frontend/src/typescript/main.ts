import { initGames, loadGamesForMonth } from "./modules/games.js";
import { loadRankingForMonth } from "./ranking.js";
import { requireAuth } from "./auth.js";

/* ============================================================
   AO CARREGAR A PÁGINA
   ============================================================ */
window.addEventListener("DOMContentLoaded", async () => {
  requireAuth();

  await initGames(loadRankingForMonth);

  const currentMonth = (document.getElementById("month-selector") as HTMLSelectElement).value;
  loadRankingForMonth(currentMonth);
});

document.getElementById("month-selector")?.addEventListener("change", (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const selectedMonth = target.value;
  loadGamesForMonth(selectedMonth);
  loadRankingForMonth(selectedMonth);
});
