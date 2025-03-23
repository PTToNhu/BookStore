const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IsApplyForSchema = Schema({
  DiscountID: { type: String, required: true },
  OrderID: { type: String, required: true },
});

module.exports = mongoose.model("IsApplyFor", IsApplyForSchema, "is_apply_for");
