const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IsApplyForSchema = Schema({
  DiscountID: { type: mongoose.Schema.Types.ObjectId, required: true },
  OrderID: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("IsApplyFor", IsApplyForSchema, "is_apply_for");
