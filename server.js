const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


// Path to votes file
const votesFile = path.join(__dirname, "votes.json");

app.use(express.json());
app.use(express.static("public"));

// Ensure votes.json exists with default values
if (!fs.existsSync(votesFile)) {
  fs.writeFileSync(votesFile, JSON.stringify({ yes: 0, no: 0 }, null, 2));
  console.log("✅ votes.json created with initial values.");
}

// Get current votes
app.get("/votes", (req, res) => {
  fs.readFile(votesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading votes" });
    res.json(JSON.parse(data));
  });
});

// Cast a vote
app.post("/vote", (req, res) => {
  const choice = req.body.choice;

  fs.readFile(votesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading votes" });

    const votes = JSON.parse(data);
    if (choice === "yes") votes.yes++;
    else if (choice === "no") votes.no++;

    fs.writeFile(votesFile, JSON.stringify(votes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error saving vote" });
      res.json(votes);
    });
  });
});

// Reset votes (optional admin route)
app.post("/reset", (req, res) => {
  const resetVotes = { yes: 0, no: 0 };
  fs.writeFile(votesFile, JSON.stringify(resetVotes, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Error resetting votes" });
    res.json(resetVotes);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
