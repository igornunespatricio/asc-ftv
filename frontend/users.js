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
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>${user.active ? "Sim" : "Não"}</td>
        <td>${new Date(user.createdAt).toLocaleString()}</td>
        <td>
          <button
            class="btn-edit"
            data-email="${user.email}"
            data-username="${user.username}"
            data-role="${user.role}"
            data-active="${user.active}"
          >Editar</button>

          <button
            class="btn-delete"
            data-email="${user.email}"
          >Deletar</button>
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
   ADICIONAR OU ATUALIZAR USER
   ============================================================ */
document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const originalEmail = form.user_email_original.value;

  const data = {
    username: form.user_username.value,
    role: form.user_role.value,
    active: form.user_active.checked,
  };

  const isEdit = Boolean(originalEmail);

  try {
    const response = await authFetch(
      isEdit ? `${usersPath}/${encodeURIComponent(originalEmail)}` : usersPath,
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit ? data : { ...data, email: form.user_email.value },
        ),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      document.getElementById("status").textContent = `Erro: ${result.message}`;
      return;
    }

    document.getElementById("status").textContent = isEdit
      ? "Usuário atualizado!"
      : "Usuário criado!";

    form.reset();
    form.user_email_original.value = "";
    document.getElementById("user_email").disabled = false;

    loadUsers();
  } catch (err) {
    document.getElementById("status").textContent =
      `Erro de rede: ${err.message}`;
  }
});

/* ============================================================
   BOTÕES DE EDITAR E DELETAR
   ============================================================ */
function attachUserButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("user_username").value = btn.dataset.username;
      document.getElementById("user_email").value = btn.dataset.email;
      document.getElementById("user_role").value = btn.dataset.role;
      document.getElementById("user_active").checked =
        btn.dataset.active === "true";

      document.getElementById("user_email").disabled = true;
      document.getElementById("user_email_original").value = btn.dataset.email;

      document.getElementById("status").textContent = "Editando usuário...";
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Deseja realmente deletar este usuário?")) return;

      const email = btn.dataset.email;

      try {
        const response = await authFetch(
          `${usersPath}/${encodeURIComponent(email)}`,
          { method: "DELETE" },
        );

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
   INIT
   ============================================================ */
window.addEventListener("DOMContentLoaded", loadUsers);
