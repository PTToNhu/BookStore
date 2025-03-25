const authController = require("./auth.controller");
const bookController = require("./book.controller");
const editionController = require("./edition.controller");
const issueController = require("./issue.controller");
const orderController = require("./order.controller");
module.exports = {
  bookController,
  authController,
  editionController,
  issueController,
  orderController,
};
