const db = require("../models");
const Cart = db.Cart;

const getAllBooks = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const cart = await Cart.find({ CustomerID: customerId });
    let bookIds = [];
    bookIds = cart.map((book) => book.BookID);
    console.log(cart);
    console.log("bookid:", bookIds);
    const books = await Cart.aggregate([
      {
        $match: {
          CustomerID: customerId,
        },
      },
      {
        $lookup: {
          from: "book",
          localField: "BookID",
          foreignField: "BookID",
          as: "books",
        },
      },
      {
        $lookup: {
          from: "edition",
          let: { bookID: "$BookID" },
          pipeline: [
            { $match: { $expr: { $eq: ["$BookID", "$$bookID"] } } },
            { $sort: { PublicationDate: -1 } },
            { $limit: 1 },
            { $project: { Price: 1, PublicationDate: 1 } },
          ],
          as: "editionData",
        },
      },
      {
        $lookup: {
          from: "issue",
          let: { bookID: "$BookID" },
          pipeline: [
            { $match: { $expr: { $eq: ["$BookID", "$$bookID"] } } },
            { $sort: { PublicationDate: -1 } },
            { $limit: 1 },
            { $project: { Price: 1, PublicationDate: 1 } },
          ],
          as: "issueData",
        },
      },
      {
        $project: {
          BookID: 1,
          numOfBooks: 1,
          Title: { $arrayElemAt: ["$books.Title", 0] },
          // editionData:1,
          // issueData:1,
          Price: {
            $ifNull: [
              {
                $arrayElemAt: ["$editionData.Price", 0],
              },
              {
                $arrayElemAt: ["$issueData.Price", 0],
              },
            ],
          },
        },
      },
    ]);
    console.log(books);
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const addItem = async (req, res) => {
  const { customerId, bookId, numOfBooks } = req.body;
  console.log("customerId:", customerId, " bookId:", bookId, " numOfBooks:", numOfBooks)
  try {
    let existingItem = await Cart.findOne({
      CustomerID: customerId,
      BookID: bookId,
    });

    if (existingItem) {
      await Cart.updateOne(
        { CustomerID: customerId, BookID: bookId },
        { $set: { numOfBooks: existingItem.numOfBooks+numOfBooks } }
      );
      return res.status(200).json({
        message: "Cập nhật số lượng trong giỏ hàng thành công",
      });
    }
    await Cart.insertOne({
      CustomerID: customerId,
      BookID: bookId,
      numOfBooks: numOfBooks,
    });
    return res.status(201).json({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const deleteItem = async (req, res) => {
  const { customerId, bookId } = req.body;
  try {
    await Cart.deleteOne({ CustomerID: customerId, BookID: bookId });
    return res.status(201).json({
      message: "Xóa sản phẩm thành công",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBooks,
  addItem,
  deleteItem,
};
