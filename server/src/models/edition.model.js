const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EditionSchema = Schema({
  ISBN: { type: String, required: true },
  PublicationDate: {
    type: Date,
    required: true,
  },
  PrintRunSize: { type: String, required: true },
  Format: { type: String },
  Price: { type: Number },
  Amount: { type: Number, default: 0 },
  BookID: { type: String, required: true },
});

const Edition = mongoose.model("Edition", EditionSchema, "edition");

module.exports = Edition;
