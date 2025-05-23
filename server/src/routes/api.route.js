const { Router } = require("express");
const controllers = require("../controllers");

const bookController = controllers.bookController;
const editionController = controllers.editionController;
const issueController = controllers.issueController;
const orderController = controllers.orderController;
const authorController = controllers.authorController;
const bookGenreController = controllers.bookGenreController;
const staffController = controllers.staffController;
const cartController = controllers.cartController;
const route = Router();
const { authenticateUser, authorizeRole } = require("../middlewares/auth");

//* BOOK
// GET Book

route.get("/book/search", bookController.bookSearch);
route.get("/book/filter", bookController.getBooksByFilters);

route.get("/book/get-all", bookController.getAllBooks); //composite condition, aggregation
route.get("/book/search", bookController.bookSearch); //single condition, join
route.get("/book/:bookId", bookController.getBookById); //single condition
route.get("/book/rating/:BookID", bookController.getAvgRatingById); //single condition, aggregation

//* EDITION
route.get("/get-all-edition/:bookId", editionController.getEditionByBookId); //single condition //thêm sort theo date
route.get("/edition/:editionId", editionController.getEditionByEditionId);
//* ISSUE
route.get("/get-all-issue/:bookId", issueController.getIssueByBookId); //single condition
route.get("/issue/:issueId", issueController.getIssueByIssueId);

//* ORDER
route.get("/order/get-all/:customerId", orderController.getOrdersByCustomerId);
route.get(
  "/order/get-all/customer/:customerId",
  orderController.getAllOrderByCustomerId
);
route.get(
  "/order/get-all/staff/:staffId",
  orderController.getAllOrderByStaffId
);
route.get("/order/unassigned", orderController.getUnassignedOrders);

route.get("/get-all-publisher", authorController.getAllPublisher);
// ADMIN
route.get(
  "/staff/book/get-all",
  authenticateUser,
  authorizeRole(["STAFF", "CUSTOMER"]),
  staffController.getBooksWithAuthorsAndLatestPublished
);

route.get("/author/get-all", authorController.getAllAuthors);
route.get("/bookgenre/get-all", bookGenreController.getAllBookGenre);
// CART
route.get("/cart/:customerId", cartController.getAllBooks);
route.post("/cart/add", cartController.addItem); //insert, update
route.post("/cart/delete", cartController.deleteItem); //delete
//thêm api lấy số lượng sản phẩm trong giỏ hàng theo customerid và bookid

module.exports = route;
