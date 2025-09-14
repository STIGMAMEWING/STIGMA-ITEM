const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const DB_FILE = "./db.json";

// Pastikan db.json ada
if (!fs.existsSync(DB_FILE)) {
  fs.writeJsonSync(DB_FILE, { produk: [], transactions: [] });
}

// Baca DB
function readDB() {
  return fs.readJsonSync(DB_FILE);
}

// Tulis DB
function writeDB(data) {
  fs.writeJsonSync(DB_FILE, data, { spaces: 2 });
}

// Status API
app.get("/api/status", (req, res) => {
  res.json({ status: "OK", message: "Server berjalan lancar 🚀" });
});

// Produk
app.get("/api/produk", (req, res) => {
  const db = readDB();
  res.json(db.produk);
});

app.post("/api/produk", (req, res) => {
  const db = readDB();
  const newProduk = { id: Date.now(), ...req.body };
  db.produk.push(newProduk);
  writeDB(db);
  res.status(201).json(newProduk);
});

app.delete("/api/produk/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.produk = db.produk.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// Transactions
app.get("/api/transactions", (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

app.post("/api/transactions", (req, res) => {
  const db = readDB();
  const newTx = { id: Date.now(), ...req.body };
  db.transactions.push(newTx);
  writeDB(db);
  res.status(201).json(newTx);
});

app.delete("/api/transactions/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.transactions = db.transactions.filter(t => t.id !== id);
  writeDB(db);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
