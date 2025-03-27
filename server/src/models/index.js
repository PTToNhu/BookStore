const Book = require("./book.model");
const BookAward = require("./bookAward.model");
const BookGenre = require("./bookGenre.model");
const Is_written = require("./isWritten.model");
const Customer = require("./customer.model");
const CustomerGenre = require("./customerGenre.model");
const Staff = require("./staff.model");
const Edition = require("./edition.model");
const Issue = require("./issue.model");
const Rating = require("./rating.model");
const Order = require("./order.model");
const Shipment = require("./shipment.model");
module.exports = {
  Book,
  Customer,
  CustomerGenre,
  Staff,
  Edition,
  Issue,
  BookAward,
  BookGenre,
  Is_written,
  Rating,
  Order,
  Shipment,
};
