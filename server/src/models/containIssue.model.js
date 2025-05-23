const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContainIssue = Schema({
  OrderID: { type: String },
  ISSN: { type: String },
  BookID: { type: String },
  Quantity: { type: Number },
});

module.exports = mongoose.model("ContainIssue", ContainIssue, "contain_issue");
