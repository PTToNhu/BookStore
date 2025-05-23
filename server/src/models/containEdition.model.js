const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContainEdition = Schema({
  OrderID: { type: String },
  ISBN: { type: String, ref: "Edition" },
  Quantity: { type: Number },
});

module.exports = mongoose.model(
  "ContainEdition",
  ContainEdition,
  "contain_edition"
);
