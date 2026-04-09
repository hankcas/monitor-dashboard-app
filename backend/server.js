const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("API FUNCIONANDO 🚀");
});

app.get("/data", (req, res) => {
  res.json({
    temperature: 25 + (Math.random() * 5),
    humidity: 50 + (Math.random() * 10),
    status: Math.random() > 0.5
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});