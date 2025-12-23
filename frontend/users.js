// const usersUrl = `${baseUrl}/users`;
const usersPath = "/users";
/* ============================================================
   FUNÇÃO: LISTAR USERS
   ============================================================ */
async function loadUsers() {
  const tableBody = document.querySelector("#users-table tbody");

  try {
    const response = await authFetch(usersPath);
    const users = await response.json();

    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Nome de usuário">${user.username}</td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Função">${user.role}</td>
        <td data-label="Ativo">${user.active ? "Sim" : "Não"}</td>
        <td data-label="Criado em">${new Date(user.createdAt).toLocaleString()}</td>
        <td data-label="Ações">
          <button class="btn-edit"
                  data-id="${user.id}"
                  data-username="${user.username}"
                  data-email="${user.email}"
                  data-role="${user.role}"
                  data-active="${user.active}">Editar</button>
          <button class="btn-delete" data-id="${user.id}">Deletar</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    attachUserButtons();
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
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
    username: form.user_username.value,
    email: form.user_email.value,
    role: form.user_role.value,
    active: form.user_active.checked,
  };

  try {
    const response = await authFetch(id ? `${usersPath}/${id}` : `/users`, {
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
      document.getElementById("user_username").value = btn.dataset.username;
      document.getElementById("user_email").value = btn.dataset.email;
      document.getElementById("user_role").value = btn.dataset.role;
      document.getElementById("user_active").checked =
        btn.dataset.active === "true";
      document.getElementById("status").textContent = "Editando usuário...";
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Deseja realmente deletar este usuário?")) return;

      const id = btn.dataset.id;

      try {
        const response = await authFetch(`${usersPath}/${id}`, {
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
