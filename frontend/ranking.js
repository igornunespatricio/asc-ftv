import { clearTableBody, querySelector } from "./dom.js";

// ranking.js - Ranking display module
// Handles ranking data fetching and table display

const baseUrl = window.APP_CONFIG.apiUrl;
const rankingUrl = `${baseUrl}/ranking`;

/* ============================================================
   CARREGAR RANKING MENSAL
   ============================================================ */
async function loadRanking(month) {
  try {
    const response = await authFetch(`/ranking?month=${month}`);
    const ranking = await response.json();

    // Use DOM utility to clear table
    clearTableBody("ranking-table");

    // Create custom row processor for ranking data
    const tableBody = querySelector("#ranking-table tbody");
    if (!tableBody) return;

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

export function loadRankingForMonth(month) {
  loadRanking(month);
}
