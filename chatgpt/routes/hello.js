const express = require('express');
const router = express.Router();

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({
    message: 'Hello, World! 👋',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
