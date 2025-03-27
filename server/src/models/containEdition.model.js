const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContainEdition = Schema({
  OrderID: { type: String },
  ISBN: { type: mongoose.Schema.Types.ObjectId, ref: "Edition" },
  Quantity: { type: Number },
});

module.exports = mongoose.model(
  "ContainEdition",
  ContainEdition,
  "contain_edition"
);
