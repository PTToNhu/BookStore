const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = Schema(
  {
    OrderID: { type: String },
    Date: { type: Date },
    CustomerID: { type: String, ref: "Customer" },
    StaffID: { type: String, ref: "Staff" },
    ShipmentCost: { type: Number },
    Address: { type: String },
    Status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema, "order");
