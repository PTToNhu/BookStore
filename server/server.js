const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

const employeesRouter = require("./routes/employee");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "*/*" }));

app.use("/employees", employeesRouter);
app.listen(PORT, () => {
  console.log(`Server started on port http://${hostname}:${PORT}`);
});
