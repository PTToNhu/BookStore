const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShipmentSchema = Schema(
  {
    ShipmentID: { type: String, required: true },
    StartDate: { type: Date },
    ExpectedArrivalDate: { type: Date },
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", ShipmentSchema, "shipment");

module.exports = Shipment;
