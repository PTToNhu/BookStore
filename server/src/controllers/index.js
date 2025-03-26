const authController = require("./auth.controller");
const bookController = require("./book.controller");
const editionController = require("./edition.controller");
const issueController = require("./issue.controller");
const orderController = require("./order.controller");
const authorController = require("./author.controller")
const bookGenreController = require("./book_genre.controller")
module.exports = {
  bookController,
  authController,
  editionController,
  issueController,
  orderController,
  authorController,
  bookGenreController,
};
