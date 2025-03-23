const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = Schema({
  ISSN: { type: String, required: true },
  IssueNumber: { type: Number, required: true },
  PublicaationDate: {
    type: Date,
    required: true,
  },
  Pages: { type: String },
  SpecialIssue: { type: Number, required: true },
  Volumn: { type: Number },
  Price: { type: Number },
  Amount: { type: Number, default: 0 },
  BookID: { type: String, required: true },
});

const Issue = mongoose.model("Issue", IssueSchema, "issue");

module.exports = Issue;
