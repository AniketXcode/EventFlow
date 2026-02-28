const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  venue: String,
  city: String,
  description: String,
  category: String,
  image: String,
  source: String,
  originalUrl: String,
  status: {
    type: String,
    default: "new"
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Event", eventSchema);