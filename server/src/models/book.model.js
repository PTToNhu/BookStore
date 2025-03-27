const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = Schema({
  BookID: { type: String, required: true, unique: true },
  Description: { type: String },
  Title: { type: String },
  VolumnNumber: { type: Number },
  PubID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Publisher",
  },
  BookType: { type: String },
  SeriesID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Series",
  },
});

const Book = mongoose.model("Book", BookSchema, "book");

module.exports = Book;
