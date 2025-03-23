const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB: " + error);
  }
}

module.exports = { connect };
