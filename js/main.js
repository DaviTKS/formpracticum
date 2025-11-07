const form = document.querySelector("#form-practicum");
const levaCriancas = document.querySelector("#levaCriancas");
const childrenFields = [
  document.querySelector("#quantidadeCriancas"),
  document.querySelector("#idadesCriancas"),
  document.querySelector("#observacoes"),
];
const toast = document.querySelector(".toast");

function toggleChildrenDetails() {
  const enableChildren = levaCriancas.value === "sim";
  childrenFields.forEach((field) => {
    field.disabled = !enableChildren;
    if (!enableChildren) {
      field.value = "";
      field.classList.remove("is-invalid");
      hideError(field.id);
    }
  });
}

function showToast(message, isError = false) {
  if (!toast) return;
  toast.textContent = message;
  toast.style.background = isError ? "#b91c1c" : "#222";
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 4000);
}

function showError(fieldId, message) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);
  if (!field || !error) return;
  field.classList.add("is-invalid");
  error.textContent = message;
  error.classList.add("is-visible");
}

function hideError(fieldId) {
  const field = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`[data-error-for="${fieldId}"]`);
  if (!field || !error) return;
  field.classList.remove("is-invalid");
  error.textContent = "";
  error.classList.remove("is-visible");
}

function validateField(field) {
  if (!field) return true;

  const value = field.value.trim();
  hideError(field.id);

  if (field.required && !value) {
    showError(field.id, "Este campo é obrigatório.");
    return false;
  }

  if (field.id === "telefone") {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      showError(field.id, "Informe um telefone com DDD.");
      return false;
    }
  }

  if (field.id === "quantidadeCriancas" && levaCriancas.value === "sim") {
    const total = Number(value);
    if (!total || total < 1) {
      showError(field.id, "Informe uma quantidade válida.");
      return false;
    }
  }

  return true;
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [
    "nome",
    "telefone",
    "levaCriancas",
    ...(levaCriancas.value === "sim" ? ["quantidadeCriancas"] : []),
  ].map((id) => document.querySelector(`#${id}`));

  const isValid = fields.every((field) => validateField(field));

  if (!isValid) {
    showToast("Verifique os campos destacados.", true);
    return;
  }

  showToast("Inscrição enviada com sucesso!");
  form.reset();
  toggleChildrenDetails();
});

levaCriancas?.addEventListener("change", toggleChildrenDetails);

document.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => hideError(field.id));
});

toggleChildrenDetails();

