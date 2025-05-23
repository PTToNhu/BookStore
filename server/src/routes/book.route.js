const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");
const bookController = controllers.bookController;
const editionController = controllers.editionController;
const issueController = controllers.issueController;
const { authenticateUser, authorizeRole } = require("../middlewares/auth");
const route = Router();

route.post(
  "/create",
  // authenticateUser,
  // authorizeRole(["STAFF"]),
  bookController.createBook
);

// edition
route.post(
  "/edition/:bookId/create",
  // authenticateUser,
  // authorizeRole(["STAFF"]),
  editionController.createEdition
);

route.put("/edition/:bookId/:isbn/update", editionController.updateEdition);

route.delete(
  "/edition/:isbn/delete",
  // authenticateUser,
  // authorizeRole(["STAFF"]),
  editionController.deleteEdition
);

// issue
route.post(
  "/issue/:bookId/create",
  // authenticateUser,
  // authorizeRole(["STAFF"]),
  issueController.createIssue
);

route.put("/issue/:bookId/:issn/update", issueController.updateIssue);

route.delete(
  "/issue/:issn/delete",
  // authenticateUser,
  // authorizeRole(["STAFF"]),
  issueController.deleteIssue
);

// comment, rating
route.post(
  "/:bookId/rating/post",
  // authenticateUser,
  // authorizeRole(["CUSTOMER", "STAFF"]),
  bookController.addRating
);
route.put(
  "/:bookId/rating/update",
  authenticateUser,
  authorizeRole(["CUSTOMER"]),
  bookController.updateRating
);
route.delete(
  "/:bookId/rating/delete",
  authenticateUser,
  authorizeRole(["STAFF", "CUSTOMER"]),
  bookController.deleteRating
);

module.exports = route;
