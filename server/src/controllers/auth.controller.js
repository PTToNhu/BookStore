const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Customer = db.Customer;
const Staff = db.Staff;
const CustomerGenre = db.CustomerGenre;
const loginCustomer = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    console.log(Username, Password);
    // Tìm customer
    const customer = await Customer.findOne({ Username });
    if (!customer) {
      return res
        .status(400)
        .json({ error: "Tên người dùng hoặc mật khẩu không chính xác!" });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(Password, customer.Password);
    console.log(isMatch);
    if (!isMatch) {
      // if (Password != customer.Password) {
      return res.status(400).json({ error: "Mật khẩu không chính xác" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { CustomerID: customer.CustomerID, Role: customer.Role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 * 24 }
    );
    console.log("Token được tạo:", token);

    res.header("Authorization", `Bearer ${token}`).send({ token });
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
      return res.status(400).json({ message: "Tên đăng nhập tồn tại" });
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

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    console.log(Username, Password);
    const staff = await Staff.findOne({ Username });
    // console.log(staff);
    if (!staff) {
      return res.status(400).json({ error: "Tên đăng nhập không đúng!" });
    }
    const isMatch = await bcrypt.compare(Password, staff.Password);
    if (!isMatch) {
      // if (Password != staff.Password) {
      return res.status(400).json({ error: "Mật khẩu không chính xác!" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { StaffID: staff.StaffID, Role: staff.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginCustomer, registerCustomer, loginStaff };
