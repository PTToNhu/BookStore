const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  PublisherID: { type: String, required: true, unique: true },
  PublishingHouse: { type: String, required: true },
  City: { type: String },
  YearEstablished: { type: Number },
  State: { type: String },
  Country: { type: String },
  MarketingSpent: { type: Number },
});

const Publisher = mongoose.model("Publisher", PublisherSchema, "publisher");

module.exports = Publisher;
