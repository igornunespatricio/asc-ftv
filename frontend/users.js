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

    const success = await handleApiResponse(
      response,
      isEdit
        ? "✅ Usuário atualizado com sucesso!"
        : "✅ Usuário criado com sucesso!",
    );

    // 🔑 Sempre sai do modo edição, independente do resultado
    resetUserForm();

    if (!success) return;

    loadUsers();
  } catch (err) {
    showStatus(
      "🌐 Não foi possível comunicar com o servidor. Verifique sua conexão ou permissões.",
      "error",
    );

    // 🔑 Mesmo em erro de rede, limpa o estado do formulário
    resetUserForm();
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

        await handleApiResponse(response, "🗑️ Usuário deletado com sucesso!");

        if (response.ok) {
          loadUsers();
        }
      } catch (err) {
        document.getElementById("status").textContent =
          `Erro de rede: ${err.message}`;
      }
    });
  });
}

async function handleApiResponse(response, successMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // resposta sem body
  }

  if (response.ok) {
    showStatus(successMessage, "success");
    return true;
  }

  if (response.status === 403) {
    showStatus("⛔ Você não tem permissão para executar esta ação.", "error");
    return false;
  }

  if (response.status === 401) {
    showStatus("🔒 Sessão expirada. Faça login novamente.", "error");
    logout();
    return false;
  }

  showStatus(data.message || "❌ Erro inesperado.", "error");
  return false;
}

function resetUserForm() {
  const form = document.getElementById("user-form");

  form.reset();
  form.user_email_original.value = "";
  document.getElementById("user_email").disabled = false;
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener("DOMContentLoaded", loadUsers);
