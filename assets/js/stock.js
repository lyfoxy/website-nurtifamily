// Menghitung selisih hari dari TODAY
function daysFromToday(date) {
  return Math.round((new Date(date) - new Date(TODAY)) / 86400000);
}

// Menentukan kelompok kedaluwarsa: safe, near, expired, undated
function getExpiryGroup(item) {
  if (!item.expiry) return "undated";
  var days = daysFromToday(item.expiry);
  if (days < 0) return "expired";
  if (days <= 5) return "near";
  return "safe";
}

// Menentukan label dan warna status bahan
function getStatus(item) {
  var group = getExpiryGroup(item);
  if (group === "expired")
    return { label: "Lewat Kedaluwarsa", color: "danger" };
  if (group === "near") return { label: "Mendekati Exp", color: "warning" };
  if (item.quantity < item.minimum)
    return { label: "Stok Menipis", color: "warning" };
  return { label: "Tersedia", color: "" };
}

function startStockPage(page) {
  var data = getData();
  if (page === "dashboard") showDashboard(data);
  if (page === "stock" || page === "delete-ingredient") setupStockPage(data);
  if (page === "add-ingredient" || page === "edit-ingredient")
    setupIngredientForm(data, page);
  if (page === "reports") showReports(data);
  if (page === "delete-ingredient")
    openDeleteIngredient(getIdFromUrl() || data.stock[0].id);
}

//DASHBOARD
function showDashboard(data) {
  var count = { safe: 0, near: 0, expired: 0, undated: 0 };
  var lowStock = 0;
  data.stock.forEach(function (item) {
    count[getExpiryGroup(item)]++;
    if (item.quantity < item.minimum) lowStock++;
  });

  var numbers = document.querySelectorAll(".nf-stat strong");
  numbers[0].textContent = data.stock.length;
  numbers[1].textContent = lowStock;
  numbers[2].textContent = count.near;
  numbers[3].textContent = count.expired;

  var groups = document.querySelectorAll(".nf-group strong");
  groups[0].textContent = count.safe + " Bahan";
  groups[1].textContent = count.near + " Bahan";
  groups[2].textContent = count.expired + " Bahan";
  groups[3].textContent = count.undated + " Bahan";

  var rows = "";
  data.stock.forEach(function (item) {
    var group = getExpiryGroup(item);
    if (group !== "near" && group !== "expired") return;
    var days = daysFromToday(item.expiry);
    var near = group === "near";
    rows +=
      "<tr>" +
      "<td><strong>" +
      escapeHtml(item.name) +
      "</strong></td>" +
      "<td><strong>" +
      item.quantity +
      " " +
      escapeHtml(item.unit) +
      "</strong></td>" +
      '<td class="' +
      (near ? "" : "nf-text-danger") +
      '">' +
      (near ? days + " hari lagi" : "Lewat " + Math.abs(days) + " hari") +
      "</td>" +
      '<td><span class="nf-badge ' +
      (near ? "warning" : "danger") +
      '">' +
      (near ? "Mendekati Kedaluwarsa" : "Lewat Kedaluwarsa") +
      "</span></td>" +
      "</tr>";
  });
  document.querySelector(".nf-warning-panel tbody").innerHTML = rows;
}

//BAHAN & STOK
function setupStockPage(data) {
  var group = new URLSearchParams(window.location.search).get("group");
  if (group) document.getElementById("filter-expiry").value = group;

  ["search-stock", "filter-category", "filter-status", "filter-expiry"].forEach(
    function (id) {
      document.getElementById(id).oninput = filterStock;
    },
  );
  filterStock();
}

function filterStock() {
  var data = getData();
  var search = document.getElementById("search-stock").value.toLowerCase();
  var category = document.getElementById("filter-category").value;
  var status = document.getElementById("filter-status").value;
  var expiry = document.getElementById("filter-expiry").value;

  var result = data.stock.filter(function (item) {
    if (!item.name.toLowerCase().includes(search)) return false;
    if (category && item.category !== category) return false;
    if (expiry && getExpiryGroup(item) !== expiry) return false;
    if (status === "low" && item.quantity >= item.minimum) return false;
    if (status === "available" && item.quantity <= 0) return false;
    return true;
  });

  document.getElementById("stock-rows").innerHTML = makeStockRows(result);
  document.getElementById("stock-count").textContent = result.length;
}

function makeStockRows(list) {
  if (list.length === 0)
    return '<tr><td colspan="5" class="nf-empty">Tidak ada bahan yang sesuai.</td></tr>';
  var rows = "";
  list.forEach(function (item) {
    var status = getStatus(item);
    var name = escapeHtml(item.name);
    rows +=
      '<tr class="row-' +
      (status.color || "safe") +
      '">' +
      "<td><strong>" +
      name +
      '</strong><small class="nf-category">' +
      escapeHtml(item.category) +
      "</small></td>" +
      "<td><strong>" +
      item.quantity +
      " " +
      escapeHtml(item.unit) +
      "</strong></td>" +
      "<td><strong>" +
      (item.expiry || "Tanpa tanggal") +
      "</strong><small>" +
      escapeHtml(item.location) +
      "</small></td>" +
      '<td><span class="nf-badge ' +
      status.color +
      '">' +
      status.label +
      "</span></td>" +
      '<td><div class="nf-actions">' +
      '<button class="btn btn-icon btn-light" type="button" data-action="edit-ingredient" data-id="' +
      item.id +
      '" aria-label="Edit ' +
      name +
      '" title="Edit ' +
      name +
      '"><i class="bi bi-pencil-square" aria-hidden="true"></i></button>' +
      '<button class="btn btn-icon btn-delete" type="button" data-action="delete-ingredient" data-id="' +
      item.id +
      '" aria-label="Hapus ' +
      name +
      '" title="Hapus ' +
      name +
      '"><i class="bi bi-trash" aria-hidden="true"></i></button>' +
      "</div></td>" +
      "</tr>";
  });
  return rows;
}

// ---------- HAPUS BAHAN ----------
function openDeleteIngredient(id) {
  var item = getData().stock.find(function (s) {
    return s.id === id;
  });
  if (!item) return;
  openModal(
    '<div class="nf-overlay">' +
      '<section class="nf-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">' +
      '<div class="nf-dialog-icon"><i class="bi bi-trash" aria-hidden="true"></i></div>' +
      '<h2 id="dialog-title">Apakah Anda Yakin Ingin Menghapus Bahan Ini?</h2>' +
      "<strong>“" +
      escapeHtml(item.name) +
      "” (" +
      item.quantity +
      " " +
      escapeHtml(item.unit) +
      ")</strong>" +
      "<p>Bahan makanan ini beserta seluruh riwayat aktivitas akan<br>dihapus secara permanen dari daftar persediaan dapur Anda.</p>" +
      '<div class="nf-dialog-actions">' +
      '<button class="btn btn-light" type="button" data-action="close-modal">Tidak</button>' +
      '<button class="btn btn-danger" type="button" data-action="confirm-delete" data-kind="ingredient" data-id="' +
      item.id +
      '">Hapus</button>' +
      "</div></section></div>",
  );
}

function deleteIngredient(id) {
  var data = getData();
  var item = data.stock.find(function (s) {
    return s.id === id;
  });
  data.stock = data.stock.filter(function (s) {
    return s.id !== id;
  });
  data.logs = data.logs.filter(function (log) {
    return !item || log.name !== item.name;
  });
  saveData(data);
  if (document.body.dataset.page === "delete-ingredient") return goTo("stock");
  closeModal();
  filterStock();
  showToast("Data berhasil dihapus.");
}

//TAMBAH / EDIT BAHAN
function setupIngredientForm(data, page) {
  var form = document.querySelector('form[data-form="ingredient"]');
  var item = null;

  if (page === "edit-ingredient") {
    var id = getIdFromUrl() || data.stock[0].id;
    item = data.stock.find(function (s) {
      return s.id === id;
    });
    if (item) {
      [
        "name",
        "category",
        "location",
        "quantity",
        "unit",
        "minimum",
        "purchased",
        "expiry",
        "notes",
      ].forEach(function (key) {
        form[key].value = item[key];
      });
      document.querySelector(".nf-form-page h1").textContent =
        "Edit Data Bahan Makanan — " + item.name;
    }
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    var newItem = {
      id: item ? item.id : Date.now(),
      name: form.name.value.trim(),
      category: form.category.value,
      location: form.location.value,
      quantity: Number(form.quantity.value),
      unit: form.unit.value,
      minimum: Number(form.minimum.value),
      purchased: form.purchased.value,
      expiry: form.expiry.value,
      notes: form.notes.value.trim(),
    };

    if (item) {
      data.stock = data.stock.map(function (s) {
        return s.id === item.id ? newItem : s;
      });
    } else {
      data.stock.push(newItem);
    }

    data.logs.unshift({
      date: new Date().toLocaleString("sv-SE").slice(0, 16),
      name: newItem.name,
      type: item ? "Perbarui Bahan" : "Tambah Stok Baru",
      change: (item ? "" : "+ ") + newItem.quantity + " " + newItem.unit,
      stock: newItem.quantity + " " + newItem.unit,
      source: "Input Mandiri",
    });
    saveData(data);
    goTo("stock");
  };
}

//LAPORAN
function showReports(data) {
  var rows = "";
  data.logs
    .filter(function (log) {
      return log.type !== "Penggunaan Resep";
    })
    .forEach(function (log) {
      rows +=
        "<tr>" +
        "<td>" +
        escapeHtml(log.date) +
        "</td>" +
        "<td><strong>" +
        escapeHtml(log.name) +
        "</strong></td>" +
        "<td>" +
        escapeHtml(log.type) +
        "</td>" +
        '<td><span class="' +
        (log.change.startsWith("+") ? "nf-positive" : "nf-negative") +
        '">' +
        escapeHtml(log.change) +
        "</span></td>" +
        "<td><strong>" +
        escapeHtml(log.stock) +
        "</strong></td>" +
        "<td>" +
        escapeHtml(log.source) +
        "</td>" +
        "</tr>";
    });
  document.querySelector(".nf-report tbody").innerHTML = rows;
}
