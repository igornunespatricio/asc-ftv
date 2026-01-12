import { showStatusMessage, handleApiResponse, resetForm } from "./forms.js";
import { clearTableBody, querySelector, getElement, setText } from "./dom.js";
import { authFetch } from "./utils.js";
import type { User } from "./types/api.js";

const usersPath = "/users";

/* ============================================================
   FUNÇÃO: LISTAR USERS
   ============================================================ */
async function loadUsers(): Promise<void> {
  try {
    const response = await authFetch(usersPath);
    const users: User[] = await response.json();

    // Use DOM utility to clear table
    clearTableBody("users-table");

    // Create custom row processor for users data
    const tableBody = querySelector("#users-table tbody") as HTMLTableSectionElement;
    if (!tableBody) return;

    users.forEach((user: User) => {
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
function setupUserForm(): void {
  getElement("user-form")?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const originalEmail = (form.user_email_original as HTMLInputElement).value;
    const isEdit = Boolean(originalEmail);

    const data = {
      username: (form.user_username as HTMLInputElement).value,
      role: (form.user_role as HTMLSelectElement).value,
      active: (form.user_active as HTMLInputElement).checked,
    };

    if (!isEdit) {
      (data as any).email = (form.user_email as HTMLInputElement).value;
      (data as any).password = (form.user_password as HTMLInputElement).value;
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

      // Always exit edit mode, regardless of result
      resetUserForm();

      if (!success) return;

      loadUsers();
    } catch (err) {
      showStatusMessage(
        "🌐 Não foi possível comunicar com o servidor. Verifique sua conexão ou permissões.",
        "error",
      );

      // Even on network error, clear form state
      resetUserForm();
    }
  });
}

/* ============================================================
   BOTÕES DE EDITAR E DELETAR
   ============================================================ */
function attachUserButtons(): void {
  // Use document.querySelectorAll since we need multiple elements
  document.querySelectorAll(".btn-edit").forEach((btn: Element) => {
    const button = btn as HTMLButtonElement;
    button.addEventListener("click", () => {
      const emailElement = getElement("user_email") as HTMLInputElement;
      const usernameElement = getElement("user_username") as HTMLInputElement;
      const roleElement = getElement("user_role") as HTMLSelectElement;
      const activeElement = getElement("user_active") as HTMLInputElement;

      usernameElement.value = button.dataset.username || "";
      emailElement.value = button.dataset.email || "";
      roleElement.value = button.dataset.role || "";
      activeElement.checked = button.dataset.active === "true";

      emailElement.disabled = true;
      (getElement("user_email_original") as HTMLInputElement).value = button.dataset.email || "";

      (getElement("user_password") as HTMLInputElement).value = "";
      const passwordGroup = getElement("password-group") as HTMLElement;
      if (passwordGroup) passwordGroup.style.display = "none";

      setText("form-title", "Editar Usuário");

      showStatusMessage("✏️ Editando usuário...", "info");
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn: Element) => {
    const button = btn as HTMLButtonElement;
    button.addEventListener("click", async () => {
      if (!confirm("Deseja realmente deletar este usuário?")) return;

      const email = button.dataset.email;

      try {
        const response = await authFetch(
          `${usersPath}/${encodeURIComponent(email || "")}`,
          { method: "DELETE" },
        );

        await handleApiResponse(response, "🗑️ Usuário deletado com sucesso!");

        if (response.ok) {
          loadUsers();
        }
      } catch (err) {
        showStatusMessage(`Erro de rede: ${(err as Error).message}`, "error");
      }
    });
  });
}

function resetUserForm(): void {
  const form = getElement("user-form") as HTMLFormElement;

  resetForm(form, {
    emailOriginal: getElement("user_email_original") as HTMLInputElement,
    emailField: getElement("user_email") as HTMLInputElement,
    passwordGroup: getElement("password-group") as HTMLElement,
    formTitle: getElement("form-title") as HTMLElement,
    defaultTitle: "Adicionar Usuário",
  });
}

// Exported functions for users.js
export async function initUserManagement(): Promise<void> {
  loadUsers();
  setupUserForm();
}

export function loadUsersForManagement(): void {
  loadUsers();
}
