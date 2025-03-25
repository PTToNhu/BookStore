const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = Schema({
  BookID: { type: String, required: true, unique: true },
  Description: { type: String },
  Title: { type: String },
  VolumnNumber: { type: Number },
  PubID: { type: String, required: true, ref: "Publisher" },
  BookType: { type: String },
  SeriesID: {
    type: String,
  },
});

const Book = mongoose.model("Book", BookSchema, "book");

module.exports = Book;
