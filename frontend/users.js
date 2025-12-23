const usersUrl = `${baseUrl}/users`;

/* ============================================================
   FUNÇÃO: LISTAR USERS
   ============================================================ */
async function loadUsers() {
  const tableBody = document.querySelector("#users-table tbody");

  try {
    const response = await authFetch(`/users`);
    const users = await response.json();

    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Nome">${user.name}</td>
        <td data-label="Apelido">${user.nickname || ""}</td>
        <td data-label="Criado em">${new Date(user.createdAt).toLocaleString()}</td>
        <td data-label="Ações">
          <button class="btn-edit" data-id="${user.id}" data-name="${user.name}" data-nickname="${user.nickname || ""}">Editar</button>
          <button class="btn-delete" data-id="${user.id}">Deletar</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    attachUserButtons();
  } catch (err) {
    console.error("Erro ao carregar users:", err);
  }
}

/* ============================================================
   FUNÇÃO: ADICIONAR OU ATUALIZAR USER
   ============================================================ */
document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const id = form.user_id.value;
  const data = {
    name: form.user_name.value,
    nickname: form.user_nickname.value || undefined,
  };

  try {
    const response = await authFetch(id ? `/users/${id}` : `/users`, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("status").textContent = id
        ? `Usuário atualizado!`
        : `Usuário criado! ID: ${result.id}`;

      form.reset();
      form.user_id.value = "";

      loadUsers();
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
function attachUserButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("user_id").value = btn.dataset.id;
      document.getElementById("user_name").value = btn.dataset.name;
      document.getElementById("user_nickname").value = btn.dataset.nickname;
      document.getElementById("status").textContent = "Editando usuário...";
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Deseja realmente deletar este usuário?")) return;

      const id = btn.dataset.id;

      try {
        const response = await authFetch(`/users/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          document.getElementById("status").textContent = "Usuário deletado!";
          loadUsers();
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
  loadUsers();
});
