const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    res.status(403).json({ error: "Invalid Token" });
  }
};
const authorizeRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user data found" });
  }

  if (!roles.includes(req.user.Role)) {
    return res
      .status(403)
      .json({ error: "Forbidden: You don't have permission" });
  }

  next();
};

module.exports = { authenticateUser, authorizeRole };
