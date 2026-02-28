const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");
const scrapeEvents = require("./scraper/scrapeEvents");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const app = express();

/* ========================
   MIDDLEWARE
======================== */

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// SESSION MUST COME BEFORE PASSPORT
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ========================
   DATABASE
======================== */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ========================
   ROUTES
======================== */

app.get("/", (req, res) => {
  res.send("Server Running");
});

const eventRoutes = require("./routes/events");
app.use("/events", eventRoutes);

/* ========================
   SCRAPER
======================== */

cron.schedule("0 * * * *", async () => {
  console.log("Running automatic scraper...");
  await scrapeEvents();
});

app.get("/scrape", async (req, res) => {
  await scrapeEvents();
  res.send("Scraping done");
});

/* ========================
   GOOGLE AUTH
======================== */

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

app.get("/auth/user", (req, res) => {
  res.json(req.user);
});

app.get("/auth/logout", (req, res) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect("http://localhost:3000");
  });
});

/* ========================
   AUTH MIDDLEWARE
======================== */

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authorized" });
}

/* ========================
   START SERVER
======================== */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});