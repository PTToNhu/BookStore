const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const CustomerSchema = Schema({
  CustomerID: { type: String },
  Name: { type: String, required: true },
  Sex: { type: String },
  Age: { type: Number },
  Username: { type: String, required: [true, "Name is required"], trim: true },
  Password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  Role: {
    type: String,
    enum: ["CUSTOMER", "STAFF"],
    default: "CUSTOMER",
  },
});

CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
CustomerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.Password);
};

const Customer = mongoose.model("Customer", CustomerSchema, "customer");

module.exports = Customer;
