const apiUrl = window.APP_CONFIG.apiUrl;

document.getElementById("game-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    match_date: form.match_date.value,
    winner1: form.winner1.value,
    winner2: form.winner2.value,
    loser1: form.loser1.value,
    loser2: form.loser2.value,
    scores: form.scores.value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("status").textContent = `Jogo adicionado com sucesso! ID: ${result.id}`;
      form.reset();
    } else {
      document.getElementById("status").textContent = `Erro: ${result.message}`;
    }
  } catch (err) {
    document.getElementById("status").textContent = `Erro de rede: ${err.message}`;
  }
});
