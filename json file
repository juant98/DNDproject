const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = "./votes.json";

// Load or initialize counts
function readCounts() {
  if (!fs.existsSync(DATA_PATH)) return { yes: 0, no: 0 };
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function saveCounts(counts) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(counts), "utf8");
}

app.get("/poll", (req, res) => {
  res.json(readCounts());
});

app.post("/vote", (req, res) => {
  const { option } = req.body;
  const counts = readCounts();
  if (option === "yes") counts.yes++;
  else if (option === "no") counts.no++;
  saveCounts(counts);
  res.json(counts);
});

app.post("/reset", (req, res) => {
  const counts = { yes: 0, no: 0 };
  saveCounts(counts);
  res.json(counts);
});

app.listen(3000, () => console.log("Backend listening at http://localhost:3000"));
