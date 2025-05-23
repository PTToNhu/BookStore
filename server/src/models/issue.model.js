const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = Schema({
  ISSN: { type: String, required: true, unique: true },
  IssueNumber: { type: Number, required: true },
  PublicationDate: {
    type: Date,
    required: true,
  },
  Pages: { type: String },
  SpecialIssue: { type: Number, default: 0 },
  Volumn: { type: Number },
  Price: { type: Number },
  Amount: { type: Number, default: 0 },
  BookID: { type: String, required: true, ref: "Book" },
});

const Issue = mongoose.model("Issue", IssueSchema, "issue");

module.exports = Issue;
