const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookGenreSchema = Schema({
  BookID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Book" },
  Genre: { type: String },
});

const BookGenre = mongoose.model("BookGenre", BookGenreSchema, "book_genre");

module.exports = BookGenre;
