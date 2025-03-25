const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeriesSchema = Schema({
  SeriesID: { type: String, required: true, unique: true },
  Name: { type: String },
  NumOfBooks: { type: Number },
  Type: { type: String },
});

module.exports = mongoose.model("Series", SeriesSchema, "series");
