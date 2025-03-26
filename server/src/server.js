const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const route = require("./routes");
const db = require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

db.connect();

const port = process.env.PORT || 30001;
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
