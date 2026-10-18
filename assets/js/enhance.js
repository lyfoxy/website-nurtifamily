(function () {
  var page = document.body.dataset.page;
  var inPages = window.location.pathname.includes("/pages/");
  var root = inPages ? "../" : "";
  var pg = inPages ? "" : "pages/";
  var user = JSON.parse(sessionStorage.getItem("nutrifamily-user") || "null");
  var USER_ONLY = [
    "dashboard",
    "stock",
    "add-ingredient",
    "edit-ingredient",
    "delete-ingredient",
    "reports",
    "master",
  ];

  // Langsung ke login tanpa jeda kalau belum masuk
  if (USER_ONLY.includes(page) && !user) {
    window.location.replace(pg + "login.html?next=" + page);
    return;
  }

  //Data master bersama (dipakai form bahan & filter)
  var MKEY = "nutrifamily-master";
  function getMaster() {
    return (
      JSON.parse(localStorage.getItem(MKEY) || "null") || {
        kategori: [
          "Protein & Daging",
          "Sayuran Segar",
          "Bumbu & Rempah",
          "Susu & Olahan",
          "Buah-buahan",
          "Bahan Pokok",
        ],
        lokasi: [
          "Freezer",
          "Kulkas Utama (Chiller)",
          "Rak Bumbu",
          "Lemari Dapur",
        ],
        satuan: ["kilogram", "gram", "liter", "buah", "butir"],
      }
    );
  }
  function fillSelect(sel, list, keepFirst) {
    if (!sel) return;
    var first = keepFirst ? sel.options[0].outerHTML : "";
    sel.innerHTML =
      first +
      list
        .map(function (v) {
          return "<option>" + escapeHtml(v) + "</option>";
        })
        .join("");
  }
  var mst = getMaster();
  if (page === "add-ingredient" || page === "edit-ingredient") {
    var f0 = document.querySelector('form[data-form="ingredient"]');
    if (f0) {
      var it =
        page === "edit-ingredient" &&
        getData().stock.find(function (x) {
          return (
            x.id === Number(new URLSearchParams(location.search).get("id"))
          );
        });
      [
        ["category", "kategori"],
        ["location", "lokasi"],
        ["unit", "satuan"],
      ].forEach(function (p) {
        var list = mst[p[1]].slice();
        if (it && it[p[0]] && list.indexOf(it[p[0]]) < 0) list.push(it[p[0]]);
        fillSelect(f0[p[0]], list);
      });
    }
  }
  if (page === "stock")
    fillSelect(document.getElementById("filter-category"), mst.kategori, true);

  //Notifikasi kedaluwarsa saat pengguna masuk (sekali per sesi)
  if (
    user &&
    USER_ONLY.includes(page) &&
    !sessionStorage.getItem("nf-alerted")
  ) {
    sessionStorage.setItem("nf-alerted", "1");
    var near = [],
      exp = [];
    getData().stock.forEach(function (x) {
      if (!x.expiry) return;
      var d = Math.round((new Date(x.expiry) - new Date(TODAY)) / 86400000);
      if (d < 0) exp.push(x.name);
      else if (d <= 5) near.push(x.name);
    });
    var host = document.getElementById("nf-toast-host");
    var box = function (cls, icon, title, names) {
      if (!names.length || !host) return;
      var el = document.createElement("div");
      el.className = "nf-expiry-alert " + cls;
      el.innerHTML =
        '<i class="bi ' +
        icon +
        '"></i><div><b>' +
        title +
        "</b><span>" +
        names.map(escapeHtml).join(", ") +
        "</span></div>" +
        '<button type="button" aria-label="Tutup">&times;</button>';
      el.querySelector("button").onclick = function () {
        el.remove();
      };
      host.appendChild(el);
      setTimeout(function () {
        el.remove();
      }, 10000);
    };
    box(
      "near",
      "bi-exclamation-triangle-fill",
      "Bahan akan segera kedaluwarsa",
      near,
    );
    box("expired", "bi-x-octagon-fill", "Bahan sudah kedaluwarsa", exp);
  }

  // Favicon
  if (!document.querySelector('link[rel="icon"]')) {
    var fav = document.createElement("link");
    fav.rel = "icon";
    fav.href = root + "assets/img/favicon.png";
    document.head.appendChild(fav);
  }

  // Logo di brand
  document.querySelectorAll(".nf-brand").forEach(function (b) {
    b.innerHTML =
      '<img src="' +
      root +
      'assets/img/logo.jpg" alt="Logo NutriFamily" class="nf-logo">NutriFamily';
  });

  // Navbar: Dashboard -> Contact
  document.querySelectorAll(".nf-nav a").forEach(function (a) {
    if (a.getAttribute("href").includes("dashboard.html")) {
      a.textContent = "Contact";
      a.href = root + "index.html#contact";
      a.classList.remove("active");
    }
  });

  // Link ke halaman pengguna langsung ke login kalau belum masuk
  if (!user) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var m = a.getAttribute("href").match(/([a-z-]+)\.html/);
      if (m && USER_ONLY.includes(m[1]))
        a.href = pg + "login.html?next=" + m[1];
    });
  }

  // Header kanan: kalau sudah masuk tampilkan nama, email, keluar
  var end = document.querySelector(".nf-header-end");
  if (end && user && page !== "admin") {
    end.innerHTML =
      '<div class="nf-user"><b>' +
      escapeHtml(user.name) +
      "</b><small>" +
      escapeHtml(user.email) +
      "</small></div>" +
      '<button class="btn btn-white" type="button" data-action="logout">Keluar</button>';
  }

  // Halaman login/daftar: tanpa navbar + link kembali
  if (
    [
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "admin-login",
    ].includes(page)
  ) {
    document.body.classList.add("nf-no-nav");
    var card =
      document.querySelector("form") &&
      document.querySelector("form").parentElement;
    if (card) {
      var back = document.createElement("a");
      back.className = "nf-back-home";
      back.href = root + "index.html";
      back.innerHTML = '<i class="bi bi-arrow-left"></i> Kembali ke Home';
      card.appendChild(back);
    }
  }

  // Sidebar: tambah menu Data Master
  var side = document.querySelector(".nf-sidebar");
  var mtab = new URLSearchParams(location.search).get("tab") || "kategori";
  if (side && page !== "admin" && !side.querySelector('[href*="master"]')) {
    side.querySelectorAll("a").forEach(function (a) {
      if (page === "master") a.classList.remove("active");
    });
    var lbl = document.createElement("div");
    lbl.className = "nf-sidebar-label mt-3";
    lbl.textContent = "DATA MASTER";
    side.appendChild(lbl);
    [
      ["kategori", "Kategori Bahan"],
      ["lokasi", "Lokasi Penyimpanan"],
      ["satuan", "Satuan"],
    ].forEach(function (t) {
      var m = document.createElement("a");
      m.href = "master.html?tab=" + t[0];
      m.textContent = t[1];
      if (page === "master" && mtab === t[0]) m.className = "active";
      side.appendChild(m);
    });
  }

  // Tombol reset filter (ikon) di Bahan & Stok
  var filters = document.querySelector(".nf-filters");
  if (filters && page === "stock") {
    var r = document.createElement("button");
    r.type = "button";
    r.className = "btn btn-icon btn-reset";
    r.title = "Reset filter";
    r.setAttribute("aria-label", "Reset filter");
    r.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
    r.onclick = function () {
      filters.querySelectorAll("input,select").forEach(function (el) {
        el.value = "";
      });
      history.replaceState(null, "", "stock.html");
      if (typeof filterStock === "function") filterStock();
      showToast("Filter berhasil direset");
    };
    filters.appendChild(r);
  }

  // Filter di Laporan Persediaan
  if (page === "reports") {
    var report = document.querySelector(".nf-report");
    var f = document.createElement("section");
    f.className = "nf-panel nf-filters";
    f.innerHTML =
      '<input class="form-control" id="rf-search" placeholder="Cari nama bahan..." aria-label="Cari bahan">' +
      '<select class="form-select" id="rf-type" aria-label="Jenis aktivitas"><option value="">Semua Aktivitas</option><option>Tambah Stok Baru</option><option>Hapus Bahan</option><option>Edit Bahan</option></select>' +
      '<select class="form-select" id="rf-dir" aria-label="Arah"><option value="">Semua Perubahan</option><option value="+">Penambahan (+)</option><option value="-">Pengurangan (-)</option></select>' +
      '<input class="form-control" type="date" id="rf-date" aria-label="Tanggal">' +
      '<button type="button" class="btn btn-icon btn-reset" id="rf-reset" title="Reset filter" aria-label="Reset filter"><i class="bi bi-arrow-counterclockwise"></i></button>';
    report.parentNode.insertBefore(f, report);
    var apply = function () {
      var q = document.getElementById("rf-search").value.toLowerCase();
      var t = document.getElementById("rf-type").value;
      var d = document.getElementById("rf-dir").value;
      var dt = document.getElementById("rf-date").value;
      report.querySelectorAll("tbody tr").forEach(function (tr) {
        var c = tr.children;
        var ok =
          c[1].textContent.toLowerCase().includes(q) &&
          (!t || c[2].textContent.trim() === t) &&
          (!d || c[3].textContent.trim().charAt(0) === d) &&
          (!dt || c[0].textContent.startsWith(dt));
        tr.hidden = !ok;
      });
    };
    f.oninput = apply;
    document.getElementById("rf-reset").onclick = function () {
      f.querySelectorAll("input,select").forEach(function (el) {
        el.value = "";
      });
      apply();
      showToast("Filter berhasil direset");
    };
  }

  // Admin panel ala dashboard: sidebar Daftar Resep / Tambah Resep
  if (page === "admin") {
    var main = document.querySelector(".nf-admin");
    var grid = main.querySelector(".nf-admin-grid");
    var formSec = grid.querySelector(".nf-admin-form");
    var listSec = Array.prototype.find.call(grid.children, function (c) {
      return c !== formSec;
    });
    var app = document.createElement("div");
    app.className = "nf-app";
    app.innerHTML =
      '<aside class="nf-sidebar"><div class="nf-sidebar-label">ADMIN PANEL</div>' +
      '<a href="#daftar" data-tab="list" class="active">Daftar Resep</a><a href="#tambah" data-tab="form">Tambah Resep</a></aside>';
    main.parentNode.insertBefore(app, main);
    main.className = "nf-main";
    app.appendChild(main);
    grid.classList.add("nf-admin-single");
    var show = function (tab) {
      formSec.hidden = tab !== "form";
      if (listSec) listSec.hidden = tab !== "list";
      app.querySelectorAll("[data-tab]").forEach(function (a) {
        a.classList.toggle("active", a.dataset.tab === tab);
      });
    };
    app.querySelectorAll("[data-tab]").forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault();
        show(a.dataset.tab);
      };
    });
    show(location.hash === "#tambah" ? "form" : "list");
  }

  // Petunjuk format bahan + vitamin di form resep
  var ie = document.getElementById("ingredient-editor");
  if (ie)
    ie.insertAdjacentHTML(
      "beforebegin",
      '<small class="nf-hint">Format: Nama · Jumlah · Keterangan · Vitamin — contoh: <b>Wortel · 0.3 kilogram · iris tipis · Vitamin A</b></small>',
    );

  // Data master
  if (page === "master") startMasterPage();

  // Home: contact, ulasan, footer
  if (page === "home") {
    // Ulasan, Contact, dan footer sudah ditulis langsung di index.html
    setupReviews();
    document.getElementById("contact-form").onsubmit = function (e) {
      e.preventDefault();
      var fm = e.target;
      window.location.href =
        "mailto:nutrifamily@gmail.com?subject=" +
        encodeURIComponent("Pesan dari " + fm.name.value) +
        "&body=" +
        encodeURIComponent(
          fm.msg.value + "\n\n— " + fm.name.value + " (" + fm.email.value + ")",
        );
      showToast("Membuka aplikasi email...");
      fm.reset();
    };
  }

  function setupReviews() {
    var KEY = "nutrifamily-reviews";
    var list = JSON.parse(localStorage.getItem(KEY) || "null") || [
      {
        r: 5,
        t: "Sangat membantu! Sekarang bahan di kulkas jarang terbuang.",
        d: "2026-10-10",
      },
      {
        r: 4,
        t: "Fitur resepnya keren, langsung tahu bahan apa yang kurang.",
        d: "2026-10-12",
      },
      {
        r: 5,
        t: "Tampilannya simpel dan mudah dipakai ibu-ibu.",
        d: "2026-10-14",
      },
    ];
    var rating = 5;
    var stars = document.getElementById("stars");
    var paint = function () {
      stars.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("on", Number(b.dataset.star) <= rating);
      });
    };
    stars.onclick = function (e) {
      var b = e.target.closest("button");
      if (b) {
        rating = Number(b.dataset.star);
        paint();
      }
    };
    paint();
    var render = function () {
      document.getElementById("review-list").innerHTML = list
        .slice(-6)
        .reverse()
        .map(function (x) {
          return (
            '<div class="col-md-4"><article class="nf-review"><div class="nf-review-stars">' +
            "★".repeat(x.r) +
            "<span>" +
            "★".repeat(5 - x.r) +
            "</span></div>" +
            "<p>“" +
            escapeHtml(x.t) +
            '”</p><small><i class="bi bi-person-circle"></i> Anonim · ' +
            x.d +
            "</small></article></div>"
          );
        })
        .join("");
    };
    render();
    document.getElementById("review-form").onsubmit = function (e) {
      e.preventDefault();
      list.push({
        r: rating,
        t: e.target.text.value.trim(),
        d: new Date().toISOString().slice(0, 10),
      });
      localStorage.setItem(KEY, JSON.stringify(list));
      e.target.reset();
      rating = 5;
      paint();
      render();
      showToast("Terima kasih! Ulasan berhasil dikirim");
    };
  }

  function startMasterPage() {
    var KEY = MKEY;
    var data = getMaster();
    var labels = {
      kategori: "Kategori Bahan",
      lokasi: "Lokasi Penyimpanan",
      satuan: "Satuan",
    };
    var host = document.getElementById("master-host");
    var render = function () {
      host.innerHTML = [labels[mtab] ? mtab : "kategori"]
        .map(function (k) {
          return (
            '<section class="nf-panel nf-stock-panel mb-4"><div class="nf-master-head"><h2>' +
            labels[k] +
            " (" +
            data[k].length +
            ")</h2>" +
            '<form class="nf-master-add" data-k="' +
            k +
            '"><input class="form-control" placeholder="Tambah ' +
            labels[k].toLowerCase() +
            '..." required><button class="btn" type="submit"><i class="bi bi-plus-lg"></i> Tambah</button></form></div>' +
            '<div class="nf-table-wrap"><table class="nf-table"><thead><tr><th>No</th><th>Nama</th><th>Tindakan</th></tr></thead><tbody>' +
            data[k]
              .map(function (v, i) {
                return (
                  "<tr><td>" +
                  (i + 1) +
                  "</td><td><strong>" +
                  escapeHtml(v) +
                  '</strong></td><td><div class="nf-actions">' +
                  '<button class="btn btn-icon btn-light" type="button" data-medit="' +
                  k +
                  '" data-i="' +
                  i +
                  '" title="Edit"><i class="bi bi-pencil-square"></i></button>' +
                  '<button class="btn btn-icon btn-delete" type="button" data-mdel="' +
                  k +
                  '" data-i="' +
                  i +
                  '" title="Hapus"><i class="bi bi-trash"></i></button></div></td></tr>'
                );
              })
              .join("") +
            "</tbody></table></div></section>"
          );
        })
        .join("");
    };
    var save = function (msg) {
      localStorage.setItem(KEY, JSON.stringify(data));
      render();
      showToast(msg);
    };
    host.addEventListener("submit", function (e) {
      e.preventDefault();
      var k = e.target.dataset.k,
        val = e.target.querySelector("input").value.trim();
      if (val) {
        data[k].push(val);
        save("Data berhasil ditambahkan");
      }
    });
    host.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-medit],button[data-mdel]");
      if (!b) return;
      var k = b.dataset.medit || b.dataset.mdel,
        i = Number(b.dataset.i);
      if (b.dataset.mdel) {
        if (confirm("Hapus data ini?")) {
          data[k].splice(i, 1);
          save("Data berhasil dihapus");
        }
      } else {
        var nv = prompt("Ubah nama:", data[k][i]);
        if (nv && nv.trim()) {
          data[k][i] = nv.trim();
          save("Data berhasil diperbarui");
        }
      }
    });
    render();
  }
})();
