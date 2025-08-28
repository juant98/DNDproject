const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

let votesFile = path.join(__dirname, "votes.json");

// Get votes
app.get("/votes", (req, res) => {
  fs.readFile(votesFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading votes" });
    }
    res.json(JSON.parse(data));
  });
});

// Submit vote
app.post("/vote", (req, res) => {
  const choice = req.body.choice;
  fs.readFile(votesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading votes" });

    let votes = JSON.parse(data);
    if (choice === "yes") votes.yes++;
    if (choice === "no") votes.no++;

    fs.writeFile(votesFile, JSON.stringify(votes), (err) => {
      if (err) return res.status(500).json({ error: "Error writing votes" });
      res.json(votes);
    });
  });
});

// Fallback: serve mainpage for root requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "DNDproject", "mainpage"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
