const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Contoh endpoint API
 // Import dan gunakan routes modular
 const statusRoute = require('./src/routes/status');
 app.use('/api', statusRoute);

// ...tambahkan routes lain di sini

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
