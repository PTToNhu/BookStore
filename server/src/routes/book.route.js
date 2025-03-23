const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");

const route = Router();

const bookController = controllers.bookController;
route.post("/create", bookController.createBook);
// PUT Book
route.put("/update/:bookId", bookController.updateBook);
// DELETE Book
route.delete("/delete/:bookId", bookController.deleteBook);
module.exports = route;
