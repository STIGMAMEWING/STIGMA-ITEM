const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Koneksi ke MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to MongoDB database'))
  .catch(err => console.error('❌ Could not connect to database:', err));

// Model untuk Produk
const produkSchema = new mongoose.Schema({
    nama: String,
    harga: String,
    deskripsi: String,
    stok: Number,
    foto: [String],
    usernameRoblox: String
});

const Produk = mongoose.model('Produk', produkSchema);

// Middleware
app.use(express.json());
app.use(cors());

// Melayani file statis (HTML, CSS, JS, gambar) dari folder frontend
const frontendPath = path.join(__dirname, '../STIGMA-ITEM-main');
app.use(express.static(frontendPath));

// Endpoint API untuk produk
app.get('/api/produk', async (req, res) => {
  try {
    const produk = await Produk.find();
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint untuk menambahkan produk baru
app.post('/api/produk', async (req, res) => {
    const newProduk = new Produk(req.body);
    try {
        const savedProduk = await newProduk.save();
        res.status(201).json(savedProduk);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server is listening at http://localhost:${port}`);
});    