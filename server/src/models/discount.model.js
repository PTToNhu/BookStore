const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscountSchema = Schema({
  DiscountID: { type: String },
  Percentage: { type: Number },
  InfoDiscount: { type: String },
  StartDate: { type: Date },
  EndDate: { type: Date },
  Type: { type: String },
  Genre: { type: String },
  CustomerLevel: { type: String },
  MinOrderCost: { type: Number },
});

module.exports = mongoose.model("Discount", DiscountSchema, "discount");
