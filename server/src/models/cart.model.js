const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = Schema(
  {
    CustomerID: { type: String, required: [true, "CustomerID is required"] },
    BookID: { type: String, required: [true, "BookID is required"] },
    numOfBooks: {
      type: Number,
      required: [true, "numOfBooks is required"],
      min: [1, "numOfBooks must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "numOfBooks must be an integer",
      },
    },
  },
  { versionKey: false }
);
Cart.index({ CustomerID: 1, BookID: 1 }, { unique: true });

module.exports = mongoose.model("Cart", Cart, "cart");
