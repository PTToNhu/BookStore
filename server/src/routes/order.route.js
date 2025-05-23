const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");
const { authenticateUser, authorizeRole } = require("../middlewares/auth");
const route = Router();

const orderController = controllers.orderController;

route.put(
  "/status/:orderId",
  authenticateUser,
  authorizeRole(["STAFF"]),
  orderController.updateStatusOrder
);
module.exports = route;
