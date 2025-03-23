const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = Schema({
  StaffID: { type: String, required: true, unique: true },
  LastName: { type: String },
  FirstName: { type: String },
  Salary: { type: Number },
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  ManagerFag: { type: Number },
  HireDate: { type: Date },
  MaanageID: { type: String },
  Role: { type: String, default: "STAFF" },
});

module.exports = mongoose.model("Staff", StaffSchema, "staff");
