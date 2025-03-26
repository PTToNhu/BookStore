const db = require("../models");
const BookGenre = db.BookGenre;

const getAllBookGenre = async (req, res) => {
    try {
      const bookGenre = await BookGenre.distinct("Genre");
      if (!bookGenre || bookGenre.length === 0) {
        return res.status(404).send("Không tìm thấy thể loại nào.");
      }
      res.status(200).json(bookGenre);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
      res.status(500).send("Lỗi máy chủ.");
    }
  };
module.exports = {
  getAllBookGenre,
};
