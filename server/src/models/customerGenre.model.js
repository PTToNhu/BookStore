const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerGenreSchema = Schema({
  CustomerID: {
    type: String,
    required: true,
    ref: "Customer",
  },
  Favorite_Genre: { type: String },
});

const CustomerGenre = mongoose.model(
  "CustomerGenre",
  CustomerGenreSchema,
  "customer_genre"
);

module.exports = CustomerGenre;
