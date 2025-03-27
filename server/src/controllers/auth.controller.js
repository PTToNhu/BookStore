const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Customer = db.Customer;
const CustomerGenre = db.CustomerGenre;
const loginCustomer = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    console.log(Username, Password);
    // Tìm customer
    const customer = await Customer.findOne({ Username });
    if (!customer) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(Password, customer.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { CustomerID: customer.CustomerID, Role: customer.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registerCustomer = async (req, res) => {
  try {
    const { CustomerID, Name, Sex, Age, Username, Password, FavoriteGenres } =
      req.body;

    console.log(req.body);

    const existingUser = await Customer.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newCustomer = new Customer({
      CustomerID,
      Name,
      Sex,
      Age,
      Username,
      Password,
      Role: "CUSTOMER",
    });

    await newCustomer.save();

    if (FavoriteGenres) {
      FG = FavoriteGenres.split(",").map((genre) => ({
        CustomerID: newCustomer.CustomerID,
        Favorite_Genre: genre.trim(),
      }));
      await CustomerGenre.insertMany(FG);
    }

    res.status(201).json({ message: "Customer registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginCustomer, registerCustomer };
