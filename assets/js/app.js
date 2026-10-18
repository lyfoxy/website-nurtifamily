function goTo(page, query) {
  query = query || "";
  if (window.NUTRI_PREVIEW) {
    window.location.href = (page === "index" ? "/" : "/" + page) + query;
    return;
  }
  var inPagesFolder = window.location.pathname.includes("/pages/");
  if (page === "index") {
    window.location.href = (inPagesFolder ? "../" : "") + "index.html" + query;
  } else {
    window.location.href =
      (inPagesFolder ? "" : "pages/") + page + ".html" + query;
  }
}

// Menampilkan pesan kecil di pojok layar
var toastTimer;
function showToast(message) {
  var host = document.getElementById("nf-toast-host");
  host.innerHTML =
    '<div class="nf-toast" role="status">' + escapeHtml(message) + "</div>";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    host.innerHTML = "";
  }, 4500);
}

function openModal(html) {
  document.getElementById("nf-modal-host").innerHTML = html;
  setupModal();
}

function setupModal() {
  var overlay = document.querySelector(".nf-overlay");
  if (!overlay) return;
  overlay.onclick = function (event) {
    if (event.target === overlay) closeModal();
  };
  var firstButton = overlay.querySelector("button");
  if (firstButton) firstButton.focus();
}

function closeModal() {
  var page = document.body.dataset.page;
  if (page === "delete-ingredient") return goTo("stock");
  if (page === "recipe-detail") return goTo("recipes");
  if (page === "delete-recipe") return goTo("admin");
  document.getElementById("nf-modal-host").innerHTML = "";
}

function handleClick(event) {
  var button = event.target.closest("[data-action]");
  if (!button) return;
  event.preventDefault();
  var action = button.dataset.action;
  var id = Number(button.dataset.id);

  if (action === "logout") logoutUser();
  if (action === "logout-admin") logoutAdmin();
  if (action === "close-modal") closeModal();
  if (action === "edit-ingredient") goTo("edit-ingredient", "?id=" + id);
  if (action === "delete-ingredient") openDeleteIngredient(id);
  if (action === "edit-recipe") goTo("edit-recipe", "?id=" + id);
  if (action === "delete-recipe") openDeleteRecipe(id);
  if (action === "recipe-detail") openRecipeDetail(id);
  if (action === "confirm-delete") {
    if (button.dataset.kind === "ingredient") deleteIngredient(id);
    else deleteRecipe(id);
  }
  if (action === "add-row") addEditorRow(button.dataset.kind);
  if (action === "remove-row") button.closest(".nf-editor-row").remove();
}

// Tombol Escape menutup pop-up
function handleKeydown(event) {
  if (event.key === "Escape" && document.querySelector(".nf-overlay"))
    closeModal();
}

function startPage() {
  var page = document.body.dataset.page;
  if (!checkAccess(page)) return;

  setupAuthForms();
  if (typeof startStockPage === "function") startStockPage(page);
  if (typeof startRecipePage === "function") startRecipePage(page);
  setupModal();

  document.onclick = handleClick;
  document.onkeydown = handleKeydown;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startPage);
} else {
  startPage();
}
