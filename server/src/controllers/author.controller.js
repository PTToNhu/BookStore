const db = require("../models");
const Author = db.Author;
const Publisher = db.Publisher;
const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();
    if (!authors || authors.length === 0) {
      return res.status(404).send("Không tìm thấy tác giả nào.");
    }
    res.status(200).json(authors);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tác giả:", error);
    res.status(500).send("Lỗi máy chủ.");
  }
};
const getAllPublisher = async (req, res) => {
  try {
    const publishers = await Publisher.find();
    if (!publishers || publishers.length === 0) {
      return res.status(404).send("Không tìm thấy nxb nào.");
    }
    res.status(200).json(publishers);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nxb:", error);
    res.status(500).send("Lỗi máy chủ.");
  }
};
module.exports = {
  getAllAuthors,
  getAllPublisher,
};
