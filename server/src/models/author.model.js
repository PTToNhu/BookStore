const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  AuthorID: { type: String },
  Birthday: { type: Date },
  FirstName: { type: String },
  LastName: { type: String },
  CountryOfResidence: { type: String },
});

const Author = mongoose.model("Author", AuthorSchema, "author");
module.exports = Author;
