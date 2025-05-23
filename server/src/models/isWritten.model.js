const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IsWrittenSchema = Schema({
  BookID: { type: String, required: true, ref: "Book" },
  AuthorID: {
    type: String,
    required: true,
    ref: "Author",
  },
});

const IsWritten = mongoose.model("IsWritten", IsWrittenSchema, "is_written");

module.exports = IsWritten;
