const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = Schema({
  ReviewID: { type: String },
  Rating: { type: Number },
  Comment: { type: String },
  CustomerID: { type: String, ref: "Customer" },
  BookID: { type: String, ref: "Book" },
});

module.exports = mongoose.model("Rating", RatingSchema, "rating");
