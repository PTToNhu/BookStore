const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookCmt = Schema({
  BookID: { type: String, required: true },
  StaffComment: { type: String },
});

const BookStaffComment = mongoose.model(
  "BookStaffComment",
  BookCmt,
  "book_staff_comment"
);

module.exports = BookStaffComment;
