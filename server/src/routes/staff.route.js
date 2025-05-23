const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");
const authController = controllers.authController;
const { authenticateUser, authorizeRole } = require("../middlewares/auth");
const staffController = require("../controllers/staff.controller");
const route = Router();

// Auth routes

route.post("/auth/login-staff", authController.loginStaff);
route.get("/get-info/:staffId", staffController.getStaffProfile);
module.exports = route;
