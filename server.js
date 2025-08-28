const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const votesFile = path.join(__dirname, 'votes.json');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API route to get current vote counts
app.get('/votes', (req, res) => {
  fs.readFile(votesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading votes' });
    res.json(JSON.parse(data));
  });
});

// API route to submit a vote
app.post('/vote', express.json(), (req, res) => {
  const choice = req.body.choice;
  fs.readFile(votesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading votes' });
    const votes = JSON.parse(data);
    if (choice === 'yes') votes.yes++;
    else if (choice === 'no') votes.no++;
    fs.writeFile(votesFile, JSON.stringify(votes), err2 => {
      if (err2) return res.status(500).json({ error: 'Error writing votes' });
      res.json(votes);
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
