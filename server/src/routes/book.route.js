const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");

const route = Router();

const bookController = controllers.bookController;
module.exports = route;
