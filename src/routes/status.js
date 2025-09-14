const express = require('express');
const router = express.Router();

// Contoh route
router.get('/status', (req, res) => {
  res.json({ status: 'API berjalan!' });
});

module.exports = router;
