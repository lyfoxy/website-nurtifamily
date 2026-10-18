var ADMIN_EMAIL = "admin16@gmail.com";

var ADMIN_PASSWORD_HASH =
  "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

// Halaman yang wajib login pengguna dulu
var USER_PAGES = [
  "dashboard",
  "stock",
  "add-ingredient",
  "edit-ingredient",
  "delete-ingredient",
  "reports",
  "recipes",
  "recipe-detail",
];
// Halaman yang wajib login admin dulu
var ADMIN_PAGES = ["admin", "edit-recipe", "delete-recipe"];

function getUser() {
  var saved = sessionStorage.getItem("nutrifamily-user");
  return saved ? JSON.parse(saved) : null;
}

function isAdmin() {
  return sessionStorage.getItem("nutrifamily-admin") === "yes";
}

// Mengecek apakah halaman boleh dibuka. Kalau tidak, pindah ke halaman login.
function checkAccess(page) {
  if (USER_PAGES.includes(page) && !getUser()) {
    goTo("login", "?next=" + page);
    return false;
  }
  if (ADMIN_PAGES.includes(page) && !isAdmin()) {
    goTo("admin-login");
    return false;
  }
  return true;
}

// Mengubah teks menjadi kode SHA-256
function makeHash(text) {
  var bytes = new TextEncoder().encode(text);
  return crypto.subtle.digest("SHA-256", bytes).then(function (buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) {
        return b.toString(16).padStart(2, "0");
      })
      .join("");
  });
}

// Menyiapkan semua form akun yang ada di halaman ini
function setupAuthForms() {
  var loginForm = document.querySelector('form[data-form="login"]');
  var registerForm = document.querySelector('form[data-form="register"]');
  var forgotForm = document.querySelector('form[data-form="forgot"]');
  var resetForm = document.querySelector('form[data-form="reset"]');
  var adminForm = document.querySelector('form[data-form="admin-login"]');

  if (loginForm) loginForm.onsubmit = handleUserLogin;
  if (registerForm) registerForm.onsubmit = handleUserLogin;

  if (forgotForm) {
    forgotForm.onsubmit = function (event) {
      event.preventDefault();
      forgotForm.hidden = true;
      document.getElementById("forgot-success").hidden = false;
    };
  }

  if (resetForm) {
    resetForm.onsubmit = function (event) {
      event.preventDefault();
      var password = resetForm.password.value;
      var confirm = resetForm.confirm.value;
      if (password.length < 8) {
        showToast("Kata sandi harus memiliki minimal 8 karakter.");
        return;
      }
      if (password !== confirm) {
        showToast("Konfirmasi kata sandi tidak sama.");
        return;
      }
      showToast("Kata sandi berhasil diperbarui. Silakan masuk kembali.");
      setTimeout(function () {
        goTo("login");
      }, 1500);
    };
  }

  if (adminForm) {
    adminForm.onsubmit = function (event) {
      event.preventDefault();
      var email = adminForm.email.value.trim().toLowerCase();
      makeHash(adminForm.password.value).then(function (hash) {
        if (
          email === ADMIN_EMAIL.toLowerCase() &&
          hash === ADMIN_PASSWORD_HASH
        ) {
          sessionStorage.setItem("nutrifamily-admin", "yes");
          goTo("admin");
        } else {
          showToast("Email atau kata sandi admin salah.");
        }
      });
    };
  }

  // Tampilan nama pengguna di header dashboard
  var user = getUser();
  var nameEl = document.getElementById("user-name");
  var emailEl = document.getElementById("user-email");
  if (user && nameEl) nameEl.textContent = user.name;
  if (user && emailEl) emailEl.textContent = user.email;
}

// Login & daftar pengguna
function handleUserLogin(event) {
  event.preventDefault();
  var form = event.target;
  if (form.password.value.length < 8) {
    showToast("Kata sandi harus memiliki minimal 8 karakter.");
    return;
  }
  var email = form.email.value.trim();
  var name = form.name ? form.name.value.trim() : email.split("@")[0];
  sessionStorage.setItem(
    "nutrifamily-user",
    JSON.stringify({ name: name, email: email }),
  );

  var next = new URLSearchParams(window.location.search).get("next");
  goTo(USER_PAGES.includes(next) ? next : "dashboard");
}

function logoutUser() {
  sessionStorage.removeItem("nutrifamily-user");
  goTo("index");
}

function logoutAdmin() {
  sessionStorage.removeItem("nutrifamily-admin");
  goTo("admin-login");
}
