const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");
const scrapeEvents = require("./scraper/scrapeEvents");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

const eventRoutes = require("./routes/events");
app.use("/events", eventRoutes);

cron.schedule("0 * * * *", async () => {
  console.log("Running automatic scraper...");
  await scrapeEvents();
});

app.get("/scrape", async (req, res) => {
  await scrapeEvents();
  res.send("Scraping done");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});