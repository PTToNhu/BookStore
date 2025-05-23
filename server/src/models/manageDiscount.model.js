const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManageDiscountSchema = Schema({
  StaffID: {
    type: String,
    required: true,
    ref: "Staff",
  },
  DiscountID: {
    type: String,
    required: true,
    ref: "Discount",
  },
});

const ManageDiscount = mongoose.model(
  "ManageDiscount",
  ManageDiscountSchema,
  "manage_discount"
);

module.exports = ManageDiscount;
