var STORAGE_KEY = "nutrifamily-data-v4";

// Tanggal "hari ini" untuk demo, supaya status kedaluwarsa
var TODAY = "2026-10-12";

var sampleStock = [
  {
    id: 1,
    name: "Daging Ayam",
    category: "Protein & Daging",
    quantity: 1.5,
    unit: "kilogram",
    minimum: 0.5,
    location: "Freezer",
    purchased: "2026-10-07",
    expiry: "2026-10-15",
    notes: "Potongan dada dan paha, kemasan beku rapat",
  },
  {
    id: 2,
    name: "Bawang Merah",
    category: "Bumbu & Rempah",
    quantity: 0.2,
    unit: "kilogram",
    minimum: 0.3,
    location: "Rak Bumbu",
    purchased: "2026-10-10",
    expiry: "2026-10-22",
    notes: "",
  },
  {
    id: 3,
    name: "Susu UHT",
    category: "Susu & Olahan",
    quantity: 2,
    unit: "liter",
    minimum: 1,
    location: "Kulkas Utama (Chiller)",
    purchased: "2026-10-09",
    expiry: "2026-10-11",
    notes: "",
  },
  {
    id: 4,
    name: "Wortel",
    category: "Sayuran Segar",
    quantity: 0.8,
    unit: "kilogram",
    minimum: 0.2,
    location: "Kulkas Utama (Chiller)",
    purchased: "2026-10-10",
    expiry: "2026-10-21",
    notes: "",
  },
  {
    id: 5,
    name: "Bawang Putih",
    category: "Bumbu & Rempah",
    quantity: 0.1,
    unit: "kilogram",
    minimum: 0.15,
    location: "Rak Bumbu",
    purchased: "2026-10-10",
    expiry: "",
    notes: "",
  },
];

var sampleRecipes = [
  {
    id: 1,
    title: "Sop Ayam Bening Gurih",
    vitamins: "Vitamin A (wortel), Vitamin B6 & B12 (ayam), Vitamin C",
    author: "Chef Ibu",
    time: "30 menit · 4 porsi",
    description:
      "Sop ayam hangat dengan kuah bening kaya rempah, sangat cocok dimasak untuk menu sehat keluarga.",
    photo: "",
    ingredients: [
      "Daging Ayam · 0.5 kilogram · potong sedang · Vitamin B6, B12",
      "Wortel · 0.3 kilogram · iris tipis · Vitamin A",
      "Bawang Merah · 0.05 kilogram · cincang",
      "Bawang Putih · 0.03 kilogram · memarkan · Vitamin C",
    ],
    steps: [
      "Rebus daging ayam hingga mendidih dan angkat buihnya.",
      "Tumis bawang merah dan bawang putih hingga harum keemasan.",
      "Masukkan potongan wortel dan bumbu, masak dengan api sedang.",
      "Masak hingga empuk dan meresap sempurna. Sajikan hangat.",
    ],
  },
  {
    id: 2,
    title: "Tumis Wortel Kuah Susu",
    vitamins: "Vitamin A, Vitamin D & Kalsium (susu)",
    author: "Sari Rahmania",
    time: "20 menit · 2 porsi",
    description: "Wortel segar dengan kuah susu yang lembut untuk keluarga.",
    photo: "",
    ingredients: [
      "Wortel · 0.3 kilogram · iris tipis",
      "Susu UHT · 0.2 liter",
      "Bawang Putih · 0.02 kilogram",
    ],
    steps: [
      "Cuci dan potong wortel.",
      "Tumis bawang putih lalu masukkan wortel.",
      "Tambahkan susu dan masak sampai matang.",
    ],
  },
  {
    id: 3,
    title: "Semur Ayam Kuah Rempah",
    vitamins: "Vitamin B3, B6, Zat Besi",
    author: "Chef Ibu",
    time: "35 menit · 4 porsi",
    description: "Ayam empuk dalam kuah rempah hangat yang kaya rasa.",
    photo: "",
    ingredients: [
      "Daging Ayam · 0.5 kilogram",
      "Bawang Merah · 0.1 kilogram",
      "Bawang Putih · 0.03 kilogram",
      "Kecap Manis · 3 sendok",
    ],
    steps: [
      "Tumis bumbu hingga harum.",
      "Masukkan ayam dan air.",
      "Masak hingga kuah meresap.",
    ],
  },
  {
    id: 4,
    title: "Nasi Goreng Bawang Spesial",
    vitamins: "Vitamin B1, Energi (karbohidrat)",
    author: "Chef Ibu",
    time: "15 menit · 2 porsi",
    description:
      "Nasi goreng sederhana dengan aroma bawang yang harum, cocok untuk sarapan cepat.",
    photo: "",
    ingredients: [
      "Nasi Putih · 2 porsi",
      "Bawang Merah · 0.05 kilogram · iris tipis",
      "Bawang Putih · 0.02 kilogram · cincang",
      "Kecap Manis · 2 sendok",
    ],
    steps: [
      "Tumis bawang merah dan bawang putih hingga harum.",
      "Masukkan nasi dan aduk rata.",
      "Tambahkan kecap, aduk hingga matang. Sajikan hangat.",
    ],
  },
  {
    id: 5,
    title: "Sop Wortel Susu Creamy",
    vitamins: "Vitamin A (wortel), Vitamin D & Kalsium (susu)",
    author: "Sari Rahmania",
    time: "25 menit · 3 porsi",
    description: "Sop creamy lembut dari wortel dan susu, disukai anak-anak.",
    photo: "",
    ingredients: [
      "Wortel · 0.4 kilogram · potong dadu · Vitamin A",
      "Susu UHT · 0.5 liter · Vitamin D",
      "Bawang Putih · 0.02 kilogram",
    ],
    steps: [
      "Rebus wortel hingga setengah empuk.",
      "Tumis bawang putih, masukkan wortel dan susu.",
      "Masak dengan api kecil hingga mengental. Sajikan.",
    ],
  },
  {
    id: 6,
    title: "Ayam Goreng Bumbu Bawang",
    vitamins: "Vitamin B6, Protein hewani",
    author: "Chef Ibu",
    time: "40 menit · 4 porsi",
    description: "Ayam goreng gurih dengan balutan bumbu bawang yang meresap.",
    photo: "",
    ingredients: [
      "Daging Ayam · 0.5 kilogram · potong sedang · Vitamin B6",
      "Bawang Putih · 0.05 kilogram · haluskan",
      "Bawang Merah · 0.05 kilogram",
    ],
    steps: [
      "Ungkep ayam dengan bumbu bawang hingga meresap.",
      "Goreng dalam minyak panas hingga keemasan.",
      "Angkat, tiriskan, dan sajikan.",
    ],
  },
];

var sampleLogs = [
  {
    date: "2026-10-10 09:00",
    name: "Daging Ayam",
    type: "Penggunaan Resep",
    change: "- 0.5 kilogram",
    stock: "1.0 kilogram",
    source: "Resep: Sop Ayam Bening",
  },
  {
    date: "2026-10-11 15:30",
    name: "Susu UHT",
    type: "Tambah Stok Baru",
    change: "+ 2 liter",
    stock: "2.0 liter",
    source: "Pembelian Swalayan",
  },
];

function getData() {
  var saved = sessionStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
  return {
    stock: JSON.parse(JSON.stringify(sampleStock)),
    recipes: JSON.parse(JSON.stringify(sampleRecipes)),
    logs: JSON.parse(JSON.stringify(sampleLogs)),
  };
}

function saveData(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
}

// Mengambil angka ?id= dari alamat halaman.
function getIdFromUrl() {
  var id = new URLSearchParams(window.location.search).get("id");
  return id ? Number(id) : null;
}

// Mengamankan teks sebelum dimasukkan ke HTML.
function escapeHtml(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
