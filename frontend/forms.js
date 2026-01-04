// forms.js - Shared form utilities module
// Contains common form handling functions used across the application

let statusTimeout;

export function showStatusMessage(
  message,
  type = "info",
  autoClear = true,
  duration = 5000,
) {
  const statusEl = document.getElementById("status");

  // Clear previous timeout
  if (statusTimeout) {
    clearTimeout(statusTimeout);
  }

  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;

  if (autoClear) {
    statusTimeout = setTimeout(() => {
      statusEl.textContent = "";
      statusEl.className = "";
    }, duration);
  }
}

export async function handleApiResponse(response, successMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // Response without body
  }

  if (response.ok) {
    showStatusMessage(successMessage, "success");
    return true;
  }

  if (response.status === 403) {
    showStatusMessage(
      "⛔ Você não tem permissão para executar esta ação.",
      "error",
    );
    return false;
  }

  if (response.status === 401) {
    showStatusMessage("🔒 Sessão expirada. Faça login novamente.", "error");
    logout();
    return false;
  }

  showStatusMessage(data.message || "❌ Erro inesperado.", "error");
  return false;
}

export function resetForm(formElement, options = {}) {
  formElement.reset();

  // Reset any additional form state
  if (options.emailOriginal) {
    options.emailOriginal.value = "";
  }

  if (options.emailField) {
    options.emailField.disabled = false;
  }

  if (options.passwordGroup) {
    options.passwordGroup.style.display = "block";
  }

  if (options.formTitle) {
    options.formTitle.textContent = options.defaultTitle || "Adicionar";
  }
}
