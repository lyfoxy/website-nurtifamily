var uploadedPhoto = null;

function startRecipePage(page) {
  var data = getData();
  if (page === "recipes") showRecipeCards(data);
  if (page === "recipe-detail") {
    showRecipeCards(data);
    openRecipeDetail(getIdFromUrl() || data.recipes[0].id);
  }
  if (page === "admin" || page === "delete-recipe") {
    showAdminList(data);
    setupRecipeForm(data, null);
  }
  if (page === "delete-recipe")
    openDeleteRecipe(getIdFromUrl() || data.recipes[0].id);
  if (page === "edit-recipe")
    setupRecipeForm(data, getIdFromUrl() || data.recipes[0].id);
}

function findRecipe(id) {
  return getData().recipes.find(function (r) {
    return r.id === id;
  });
}

// Gambar resep: foto jika ada, kalau tidak pakai kotak warna
var DEFAULT_PHOTOS = {
  1: "sop-ayam-bening.webp",
  2: "tumis-woretl.webp",
  3: "semur-ayam.webp",
  4: "nasi-goreng-bawang.webp",
  5: "sop-wortel-susu-creamy.webp",
  6: "ayam-goreng-bawang.webp",
};
function recipePhotoSrc(recipe) {
  if (recipe.photo) return recipe.photo;
  var file = DEFAULT_PHOTOS[recipe.id];
  if (!file) return "";
  var base = location.pathname.indexOf("/pages/") !== -1 ? "../" : "";
  return base + "assets/img/" + file;
}
function recipeImage(recipe, className) {
  var src = recipePhotoSrc(recipe);
  if (!src) return "";
  return (
    '<img class="' +
    className +
    '" src="' +
    src +
    '" alt="Foto ' +
    escapeHtml(recipe.title) +
    '">'
  );
}

//MENU RESEP
function showRecipeCards(data) {
  var list = data.recipes.slice();

  var html = "";
  list.forEach(function (recipe, index) {
    var missing = false;
    html +=
      '<article class="nf-recipe">' +
      '<div class="nf-recipe-cover ' +
      (missing ? "warning" : "") +
      '">' +
      recipeImage(recipe, "nf-recipe-photo") +
      "</div>" +
      '<div class="nf-recipe-body">' +
      "<h2>" +
      escapeHtml(recipe.title) +
      "</h2>" +
      "<small>" +
      escapeHtml(recipe.time) +
      " · " +
      recipe.ingredients.length +
      " bahan</small>" +
      '<button class="btn" type="button" data-action="recipe-detail" data-id="' +
      recipe.id +
      '">Detail</button>' +
      "</div></article>";
  });
  document.querySelector(".nf-recipes").innerHTML = html;
}

//DETAIL RESEP (pop-up)
function openRecipeDetail(id) {
  var recipe = findRecipe(id);
  if (!recipe) return;

  var ingredients = "";
  recipe.ingredients.forEach(function (text) {
    var part = text.split(" · ");
    ingredients +=
      '<div class="nf-ingredient"><strong>' +
      escapeHtml(part[1] || "Secukupnya") +
      "</strong>" +
      "<span>" +
      escapeHtml(part[0]) +
      (part[2] ? " (" + escapeHtml(part[2]) + ")" : "") +
      (part[3]
        ? ' <em class="nf-vit-tag">' + escapeHtml(part[3]) + "</em>"
        : "") +
      "</span></div>";
  });

  var steps = "";
  recipe.steps.forEach(function (text, index) {
    steps +=
      '<div class="nf-step"><span class="nf-step-number">' +
      (index + 1) +
      "</span><span>" +
      escapeHtml(text) +
      "</span></div>";
  });

  openModal(
    '<div class="nf-overlay">' +
      '<section class="nf-detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">' +
      '<div class="nf-detail-header">' +
      '<h2 id="detail-title">Detail Resep Masakan — ' +
      escapeHtml(recipe.title) +
      "</h2>" +
      '<button class="btn btn-white" type="button" data-action="close-modal">Tutup</button>' +
      "</div>" +
      '<div class="nf-detail-body">' +
      '<div class="nf-detail-intro">' +
      '<div class="nf-dish-placeholder">' +
      (recipeImage(recipe, "nf-dish-photo") || "Foto Hidangan") +
      "</div>" +
      '<div><span class="nf-badge">Semua Bahan Tersedia</span>' +
      "<h1>" +
      escapeHtml(recipe.title) +
      "</h1>" +
      "<strong>Oleh " +
      escapeHtml(recipe.author) +
      " · Waktu Memasak: " +
      escapeHtml(recipe.time.replace(" · ", " · Porsi: ")) +
      "</strong>" +
      "<p>" +
      escapeHtml(recipe.description) +
      "</p></div>" +
      "</div>" +
      '<div class="nf-detail-columns">' +
      "<section><h2>Bahan-bahan (4 Porsi)</h2>" +
      ingredients +
      "</section>" +
      "<section><h2>Cara Membuat</h2>" +
      steps +
      "</section>" +
      "</div></div></section></div>",
  );
}

//ADMIN: DAFTAR RESEP
function showAdminList(data) {
  var html =
    "<h2>Daftar Resep Aktif (" +
    data.recipes.length +
    ")</h2><p>Gunakan ikon Edit atau Delete untuk mengelola resep.</p>";
  data.recipes.forEach(function (recipe) {
    var title = escapeHtml(recipe.title);
    html +=
      '<article class="nf-admin-item"><div>' +
      "<h3>" +
      title +
      "</h3>" +
      "<p>" +
      escapeHtml(recipe.author) +
      " · " +
      recipe.ingredients.length +
      " bahan · " +
      escapeHtml(recipe.time.split(" · ")[0]) +
      "</p>" +
      '</div><div class="nf-actions">' +
      '<button class="btn btn-icon btn-light" type="button" data-action="edit-recipe" data-id="' +
      recipe.id +
      '" aria-label="Edit ' +
      title +
      '" title="Edit ' +
      title +
      '"><i class="bi bi-pencil-square" aria-hidden="true"></i></button>' +
      '<button class="btn btn-icon btn-delete" type="button" data-action="delete-recipe" data-id="' +
      recipe.id +
      '" aria-label="Hapus ' +
      title +
      '" title="Hapus ' +
      title +
      '"><i class="bi bi-trash" aria-hidden="true"></i></button>' +
      "</div></article>";
  });
  document.querySelector(".nf-admin-list").innerHTML = html;
}

//BARIS BAHAN / LANGKAH
function makeEditorRow(text, kind, number) {
  var isIngredient = kind === "ingredient";
  var label = isIngredient ? "Bahan" : "Langkah";
  return (
    '<div class="nf-editor-row">' +
    '<input aria-label="' +
    label +
    " " +
    number +
    '" name="' +
    (isIngredient ? "ingredients" : "steps") +
    '" value="' +
    escapeHtml(text) +
    '" required>' +
    '<button class="btn btn-icon btn-delete" type="button" data-action="remove-row" aria-label="Hapus ' +
    label.toLowerCase() +
    '" title="Hapus ' +
    label.toLowerCase() +
    '"><i class="bi bi-trash" aria-hidden="true"></i></button>' +
    "</div>"
  );
}

function addEditorRow(kind) {
  var box = document.getElementById(kind + "-editor");
  box.insertAdjacentHTML(
    "beforeend",
    makeEditorRow("", kind, box.children.length + 1),
  );
  box.lastElementChild.querySelector("input").focus();
}

//FORM TAMBAH / EDIT RESEP
function setupRecipeForm(data, editId) {
  var form = document.querySelector('form[data-form="recipe"]');
  var recipe = editId ? findRecipe(editId) : null;
  uploadedPhoto = null;

  if (recipe) {
    form.title.value = recipe.title;
    form.time.value = recipe.time;
    form.description.value = recipe.description;
    document.getElementById("ingredient-editor").innerHTML = recipe.ingredients
      .map(function (text, i) {
        return makeEditorRow(text, "ingredient", i + 1);
      })
      .join("");
    document.getElementById("step-editor").innerHTML = recipe.steps
      .map(function (text, i) {
        return makeEditorRow(text, "step", i + 1);
      })
      .join("");
    document.querySelector(".nf-form-page h1").textContent =
      "Edit Data Resep Makanan — " + recipe.title;
    if (recipePhotoSrc(recipe)) showPhotoPreview(recipePhotoSrc(recipe));
  }

  // Upload foto resep
  form.photo.onchange = function () {
    var file = form.photo.files[0];
    if (!file) return;
    if (file.size > 1500000) {
      showToast("Ukuran foto maksimal 1,5 MB.");
      form.photo.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      uploadedPhoto = reader.result;
      showPhotoPreview(uploadedPhoto);
    };
    reader.readAsDataURL(file);
  };

  form.onsubmit = function (event) {
    event.preventDefault();
    var ingredients = getRowValues(form, "ingredients");
    var steps = getRowValues(form, "steps");
    if (ingredients.length === 0 || steps.length === 0) {
      showToast("Tambahkan minimal satu bahan dan satu langkah.");
      return;
    }

    var newRecipe = {
      id: recipe ? recipe.id : Date.now(),
      title: form.title.value.trim(),
      time: form.time.value.trim(),
      description: form.description.value.trim(),
      author: recipe ? recipe.author : "Chef Ibu",
      photo: uploadedPhoto || (recipe ? recipe.photo : ""),
      ingredients: ingredients,
      vitamins: form.vitamins
        ? form.vitamins.value.trim()
        : recipe
          ? recipe.vitamins || ""
          : "",
      steps: steps,
    };

    if (recipe) {
      data.recipes = data.recipes.map(function (r) {
        return r.id === recipe.id ? newRecipe : r;
      });
    } else {
      data.recipes.push(newRecipe);
    }

    if (!saveData(data)) {
      showToast("Penyimpanan penuh. Coba gunakan foto yang lebih kecil.");
      return;
    }
    if (recipe) {
      goTo("admin");
    } else {
      form.reset();
      document.getElementById("photo-preview").hidden = true;
      uploadedPhoto = null;
      showAdminList(data);
      showToast("Resep berhasil ditambahkan ke katalog.");
    }
  };
}

function showPhotoPreview(src) {
  var preview = document.getElementById("photo-preview");
  preview.src = src;
  preview.hidden = false;
}

function getRowValues(form, name) {
  return Array.from(form.querySelectorAll('input[name="' + name + '"]'))
    .map(function (input) {
      return input.value.trim();
    })
    .filter(function (value) {
      return value !== "";
    });
}

//HAPUS RESEP
function openDeleteRecipe(id) {
  var recipe = findRecipe(id);
  if (!recipe) return;
  openModal(
    '<div class="nf-overlay">' +
      '<section class="nf-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">' +
      '<div class="nf-dialog-icon"><i class="bi bi-trash" aria-hidden="true"></i></div>' +
      '<h2 id="dialog-title">Apakah Anda Yakin Ingin Menghapus Resep Ini?</h2>' +
      "<strong>“" +
      escapeHtml(recipe.title) +
      "”</strong>" +
      "<p>Menghapus resep ini bersifat permanen dan<br>dihapus secara permanen dari daftar menu Anda.</p>" +
      '<div class="nf-dialog-actions">' +
      '<button class="btn btn-light" type="button" data-action="close-modal">Tidak</button>' +
      '<button class="btn btn-danger" type="button" data-action="confirm-delete" data-kind="recipe" data-id="' +
      recipe.id +
      '">Hapus</button>' +
      "</div></section></div>",
  );
}

function deleteRecipe(id) {
  var data = getData();
  data.recipes = data.recipes.filter(function (r) {
    return r.id !== id;
  });
  saveData(data);
  if (document.body.dataset.page === "delete-recipe") return goTo("admin");
  closeModal();
  showAdminList(data);
  showToast("Data berhasil dihapus.");
}
