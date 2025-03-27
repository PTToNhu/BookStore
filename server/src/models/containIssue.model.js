const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContainIssue = Schema({
  OrderID: { type: String },
  ISBN: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
  Quantity: { type: Number },
});

module.exports = mongoose.model("ContainIssue", ContainIssue, "contain_issue");
