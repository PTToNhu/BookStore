const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = Schema({
  OrderID: { type: String },
  PaymentMethod: { type: String },
  Time: { type: Date },
});

module.exports = mongoose.model(
  "Transaction",
  TransactionSchema,
  "transaction"
);
