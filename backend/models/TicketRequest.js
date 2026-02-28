const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  email: String,
  consent: Boolean,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TicketRequest", ticketSchema);