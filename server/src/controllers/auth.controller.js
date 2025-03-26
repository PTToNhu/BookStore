const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Customer = db.Customer;

const loginCustomer = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    console.log(req.body);
    // Tìm customer
    const customer = await Customer.findOne({ Username });
    if (!customer) {
      return res.status(400).json({ error: "Invalid email or password1" });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(Password, customer.Password);
    // if (!isMatch) {
    if(Password!=customer.Password){
      return res.status(400).json({ error: "Invalid email or password2" });
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

    if (FavoriteGenres && FavoriteGenres.length > 0) {
      const genresToSave = FavoriteGenres.map((genre) => ({
        CustomerID: newCustomer.CustomerID,
        Favorite_Genre: genre,
      }));
      await CustomerGenre.insertMany(genresToSave);
    }

    res.status(201).json({ message: "Customer registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginCustomer, registerCustomer };
