const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManageDiscountSchema = Schema({
  StaffID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  DiscountID: {
    type: mongoose.Schema.Types.ObjectId,
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
