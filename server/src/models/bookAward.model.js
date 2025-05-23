const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookAwardSchema = Schema({
  BookID: { type: String, required: true, ref: "Book" },
  AwardName: { type: String, required: true },
  YearWon: { type: Number, required: true },
});

const BookAward = mongoose.model("BookAward", BookAwardSchema, "book_award");

module.exports = BookAward;
