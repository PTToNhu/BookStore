const path = require("path");
const apiRoute = require("./api.route");
const customerRoute = require("./customer.route");
const bookRoute = require("./book.route");
const orderRoute = require("./order.route");

const initRoute = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  app.use("/api", apiRoute);
  app.use("/customer", customerRoute);
  app.use("/book", bookRoute);
};

module.exports = initRoute;
