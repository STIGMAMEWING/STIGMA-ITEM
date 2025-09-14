let produk = [];
let transactions = [];

// ======================= PRODUK ======================= //
async function loadProduk(filter = "all") {
  try {
    const res = await fetch("/api/produk");
    produk = await res.json();
    renderProduk(filter);
  } catch (err) {
    console.error("Gagal ambil produk:", err);
  }
}

async function tambahProduk() {
  const nama = document.getElementById("namaProduk").value.trim();
  const harga = document.getElementById("hargaProduk").value.trim();
  const deskripsi = document.getElementById("deskripsiProduk").value.trim();
  const usernameRoblox = document.getElementById("usernameRoblox").value.trim();
  const stokProduk = parseInt(document.getElementById("stokProduk").value);
  const fotoInput = document.getElementById("fotoProduk");

  if (!nama || !harga || isNaN(stokProduk) || stokProduk <= 0) {
    alert("Nama, harga, dan stok wajib diisi!");
    return;
  }

  if (fotoInput.files.length === 0) {
    alert("Minimal unggah 1 foto produk!");
    return;
  }

  // Konversi foto ke base64 (biar bisa disimpan di JSON db)
  const readerPromises = Array.from(fotoInput.files).map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  });

  const fotoArray = await Promise.all(readerPromises);

  const itemBaru = { 
    nama, 
    harga, 
    deskripsi, 
    usernameRoblox, 
    stok: stokProduk, 
    stokAwal: stokProduk, 
    foto: fotoArray 
  };

  try {
    const res = await fetch("/api/produk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemBaru)
    });

    if (!res.ok) throw new Error("Gagal tambah produk");

    alert("Produk berhasil ditambahkan!");
    resetForm();
    await loadProduk();
  } catch (err) {
    console.error(err);
    alert("Error menambahkan produk!");
  }
}

async function hapusProduk(id) {
  if (!confirm("Yakin ingin menghapus produk ini?")) return;

  try {
    const res = await fetch(`/api/produk/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal hapus produk");
    await loadProduk();
  } catch (err) {
    console.error(err);
    alert("Error hapus produk!");
  }
}

function renderProduk(filter = "all") {
  const list = document.getElementById("stokList");
  list.innerHTML = "";
  let filtered = produk;

  if (filter === "tersedia") filtered = produk.filter(p => p.stok > 0);
  if (filter === "terjual") filtered = produk.filter(p => p.stok === 0);

  if (filtered.length === 0) {
    list.innerHTML = `<p class="text-gray-400">Belum ada produk...</p>`;
    return;
  }

  filtered.forEach(p => {
    const li = document.createElement("li");
    li.className = "p-4 bg-gray-800 rounded-lg flex justify-between items-center shadow-md border border-gray-700";
    li.innerHTML = `
      <div class="flex items-center gap-4">
        ${p.foto && p.foto.length > 0 ? `<img src="${p.foto[0]}" alt="${p.nama}" class="w-20 h-20 rounded-lg object-cover border border-blue-400 cursor-pointer">` : ''}
        <div>
          <p class="font-bold text-lg text-blue-300">${p.nama}</p>
          <p class="text-md text-green-400">Rp ${p.harga}</p>
          <p class="text-sm text-gray-300 mt-1">${p.deskripsi}</p>
          <p class="text-xs text-purple-300 mt-1">Roblox ID: ${p.usernameRoblox || 'N/A'}</p>
          <p class="text-xs text-yellow-300 mt-1">Stok: ${p.stok}/${p.stokAwal}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="hapusProduk(${p.id})" class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-full font-semibold">❌ Hapus</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateStats();
}

function resetForm() {
  document.getElementById("namaProduk").value = "";
  document.getElementById("hargaProduk").value = "";
  document.getElementById("deskripsiProduk").value = "";
  document.getElementById("usernameRoblox").value = "";
  document.getElementById("stokProduk").value = "";
  document.getElementById("fotoProduk").value = null;
}

function updateStats() {
  document.getElementById("total").innerText = produk.length;
  document.getElementById("tersedia").innerText = produk.filter(p => p.stok > 0).length;
  document.getElementById("terjual").innerText = produk.filter(p => p.stok === 0).length;
}

// ======================= TRANSAKSI ======================= //
async function loadTransactions() {
  try {
    const res = await fetch("/api/transaksi");
    transactions = await res.json();
    renderTransactions();
  } catch (err) {
    console.error("Gagal ambil transaksi:", err);
  }
}

function renderTransactions() {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  if (transactions.length === 0) {
    list.innerHTML = `<p class="text-gray-400">Belum ada transaksi...</p>`;
    return;
  }

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.className = "p-3 bg-gray-700 rounded-lg";
    li.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <p class="font-semibold text-sm">Pembeli: ${t.nama}</p>
        <span class="text-xs text-gray-400">${t.tanggal}</span>
      </div>
      <p class="text-xs text-gray-300">Produk: ${t.produk}</p>
      <p class="text-xs text-gray-300">Email: ${t.email}</p>
      <p class="text-xs text-gray-300">Jumlah: Rp ${t.harga}</p>
      <p class="text-xs text-gray-300">Bank: ${t.bank}</p>
      <p class="text-xs text-gray-300">Keterangan: ${t.keterangan}</p>
      <button onclick="hapusTransaction(${t.id})" class="mt-2 px-2 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-xs">Hapus</button>
    `;
    list.appendChild(li);
  });
}

async function hapusTransaction(id) {
  if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

  try {
    const res = await fetch(`/api/transaksi/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Gagal hapus transaksi");
    await loadTransactions();
  } catch (err) {
    console.error(err);
    alert("Error hapus transaksi!");
  }
}

// ======================= SEARCH ======================= //
document.getElementById("search").addEventListener("input", function() {
  const keyword = this.value.toLowerCase();
  const filtered = produk.filter(p => 
    p.nama.toLowerCase().includes(keyword) || 
    p.deskripsi.toLowerCase().includes(keyword)
  );
  renderProdukList(filtered);
});

function renderProdukList(listProduk) {
  const list = document.getElementById("stokList");
  list.innerHTML = "";

  if (listProduk.length === 0) {
    list.innerHTML = `<p class="text-gray-400">Tidak ada hasil ditemukan...</p>`;
    return;
  }

  listProduk.forEach(p => {
    const li = document.createElement("li");
    li.className = "p-4 bg-gray-800 rounded-lg flex justify-between items-center shadow-md border border-gray-700";
    li.innerHTML = `
      <div class="flex items-center gap-4">
        ${p.foto && p.foto.length > 0 ? `<img src="${p.foto[0]}" alt="${p.nama}" class="w-20 h-20 rounded-lg object-cover border border-blue-400 cursor-pointer">` : ''}
        <div>
          <p class="font-bold text-lg text-blue-300">${p.nama}</p>
          <p class="text-md text-green-400">Rp ${p.harga}</p>
          <p class="text-sm text-gray-300 mt-1">${p.deskripsi}</p>
          <p class="text-xs text-purple-300 mt-1">Roblox ID: ${p.usernameRoblox || 'N/A'}</p>
          <p class="text-xs text-yellow-300 mt-1">Stok: ${p.stok}/${p.stokAwal}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="hapusProduk(${p.id})" class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-full font-semibold">❌ Hapus</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateStats();
}

// ======================= INIT ======================= //
window.onload = () => {
  loadProduk();
  loadTransactions();
};
