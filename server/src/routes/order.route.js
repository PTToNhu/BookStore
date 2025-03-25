const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");

const route = Router();

const orderController = controllers.orderController;

module.exports = route;
