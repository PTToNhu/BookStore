const { Router } = require("express");
const path = require("path");
const controllers = require("../controllers");
const authController = controllers.authController;
const { authenticateUser, authorizeRole } = require("../middlewares/auth");
const route = Router();

// Auth routes
route.post("/auth/register-customer", authController.registerCustomer);
route.post("/auth/login-customer", authController.loginCustomer);

route.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views", "sign.html"));
});
route.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views", "signup.html"));
});
// Protected route
route.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({ message: "Welcome to your profile", user: req.user });
});

module.exports = route;
