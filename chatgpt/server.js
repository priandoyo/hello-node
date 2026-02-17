const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const helloRoute = require('./routes/hello');
app.use('/api', helloRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Hello Node API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
