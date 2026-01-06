import { clearTableBody, querySelector } from "./dom.js";
import { authFetch } from "./utils.js";
import type { RankingEntry } from "./types/api.js";

const baseUrl = (window as any).APP_CONFIG.apiUrl;
const rankingUrl = `${baseUrl}/ranking`;

/* ============================================================
   CARREGAR RANKING MENSAL
   ============================================================ */
async function loadRanking(month: string): Promise<void> {
  try {
    const response = await authFetch(`/ranking?month=${month}`);
    const ranking: RankingEntry[] = await response.json();

    // Use DOM utility to clear table
    clearTableBody("ranking-table");

    // Create custom row processor for ranking data
    const tableBody = querySelector("#ranking-table tbody") as HTMLTableSectionElement;
    if (!tableBody) return;

    ranking.forEach((player: RankingEntry) => {
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

export function loadRankingForMonth(month: string): void {
  loadRanking(month);
}
