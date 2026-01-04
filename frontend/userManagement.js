// userManagement.js - User management module
// Handles user CRUD operations, form interactions, and user display

import { showStatusMessage, handleApiResponse, resetForm } from "./forms.js";
import { clearTableBody, querySelector, getElement, setText } from "./dom.js";

const usersPath = "/users";

/* ============================================================
   FUNÇÃO: LISTAR USERS
   ============================================================ */
async function loadUsers() {
  try {
    const response = await authFetch(usersPath);
    const users = await response.json();

    // Use DOM utility to clear table
    clearTableBody("users-table");

    // Create custom row processor for users data
    const tableBody = querySelector("#users-table tbody");
    if (!tableBody) return;

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
function setupUserForm() {
  getElement("user-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const originalEmail = form.user_email_original.value;
    const isEdit = Boolean(originalEmail);

    const data = {
      username: form.user_username.value,
      role: form.user_role.value,
      active: form.user_active.checked,
    };

    if (!isEdit) {
      data.email = form.user_email.value;
      data.password = form.user_password.value;
    }

    try {
      const response = await authFetch(
        isEdit
          ? `${usersPath}/${encodeURIComponent(originalEmail)}`
          : usersPath,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
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
      showStatusMessage(
        "🌐 Não foi possível comunicar com o servidor. Verifique sua conexão ou permissões.",
        "error",
      );

      // 🔑 Mesmo em erro de rede, limpa o estado do formulário
      resetUserForm();
    }
  });
}

/* ============================================================
   BOTÕES DE EDITAR E DELETAR
   ============================================================ */
function attachUserButtons() {
  // Use document.querySelectorAll since we need multiple elements
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      getElement("user_username").value = btn.dataset.username;
      getElement("user_email").value = btn.dataset.email;
      getElement("user_role").value = btn.dataset.role;
      getElement("user_active").checked = btn.dataset.active === "true";

      getElement("user_email").disabled = true;
      getElement("user_email_original").value = btn.dataset.email;

      getElement("user_password").value = "";
      getElement("password-group").style.display = "none";

      setText("form-title", "Editar Usuário");

      showStatusMessage("✏️ Editando usuário...", "info");
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
        showStatusMessage(`Erro de rede: ${err.message}`, "error");
      }
    });
  });
}

function resetUserForm() {
  const form = getElement("user-form");

  resetForm(form, {
    emailOriginal: getElement("user_email_original"),
    emailField: getElement("user_email"),
    passwordGroup: getElement("password-group"),
    formTitle: getElement("form-title"),
    defaultTitle: "Adicionar Usuário",
  });
}

// Exported functions for users.js
export async function initUserManagement() {
  loadUsers();
  setupUserForm();
}

export function loadUsersForManagement() {
  loadUsers();
}
