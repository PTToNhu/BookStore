const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = Schema(
  {
    ReviewID: { type: String },
    Rating: { type: Number },
    Comment: { type: String },
    CustomerID: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    BookID: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema, "rating");
