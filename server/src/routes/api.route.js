const { Router } = require("express");
const controllers = require("../controllers");

const bookController = controllers.bookController;
const editionController = controllers.editionController;
const issueController = controllers.issueController;
const orderController = controllers.orderController;
const route = Router();
//* BOOK
// GET Book
route.get("/book/get-all", bookController.getAllBooks);
route.get("/book/:bookId", bookController.getBookById);
// POST Book
// route.post("/book/create", bookController.createBook);
// PUT Book
route.put("/book/update/:bookId", bookController.updateBook);
// DELETE Book
route.delete("/book/delete/:bookId", bookController.deleteBook);

//* EDITION
route.get("/get-all-edition/:bookId", editionController.getEditionByBookId);
route.get("/edition/:editionId", editionController.getEditionByEditionId);
//* ISSUE
route.get("/get-all-issue/:bookId", issueController.getIssueByBookId);
route.get("/issue/:issueId", issueController.getIssueByIssueId);

//* Rating
route.get("/get-all-rating/:bookId", bookController.getRatingBook);

//* ORDER
route.get(
  "/order/get-all/:customerId",
  orderController.getAllOrderByCustomerId
);
route.get("/order/get-all/:staffId", orderController.getAllOrderByStaffId);
module.exports = route;
