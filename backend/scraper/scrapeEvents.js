const axios = require("axios");
const cheerio = require("cheerio");
const Event = require("../models/Event");

const scrapeEvents = async () => {
  try {
    const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const events = [];

    $(".event-card").each((i, el) => {
      const title = $(el).find("h3").text().trim();
      const link = $(el).find("a").attr("href");

      if (title && link) {
        events.push({
          title,
          city: "Sydney",
          source: "Eventbrite",
          originalUrl: link
        });
      }
    });

    for (let event of events) {
      const exists = await Event.findOne({ originalUrl: event.originalUrl });

      if (!exists) {
        await Event.create(event);
        console.log("New event added:", event.title);
      }
    }

    console.log("Scraping done");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = scrapeEvents;