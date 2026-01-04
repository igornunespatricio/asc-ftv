// ranking.js - Ranking display module
// Handles ranking data fetching and table display

const baseUrl = window.APP_CONFIG.apiUrl;
const rankingUrl = `${baseUrl}/ranking`;

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

export function loadRankingForMonth(month) {
  loadRanking(month);
}
