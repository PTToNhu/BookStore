const db = require("../models");
const Edition = db.Edition;

const getEditionByBookId = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    // const editionId = req.params.editionId;
    const editions = await Edition.find({ BookID: bookId });
    if (!editions)
      return res
        .status(404)
        .send("The edition with the given ID was not found.");
    res.send(editions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

const getEditionByEditionId = async (req, res) => {
  const editionId = req.params.editionId;
  console.log(editionId);
  try {
    const edition = await Edition.findById(editionId);
    if (!edition)
      return res
        .status(404)
        .send("The edition with the given ID was not found.");
    res.send(edition);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
};

const createEdition = async (req, res) => {
  try {
    const {
      ISBN,
      PublicationDate,
      PrintRunSize,
      Pages,
      Format,
      Price,
      Amount,
    } = req.body;
    const BookID = req.params.bookId;
    console.log(BookID);
    if (!ISBN || !BookID) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingEdition = await Edition.findOne({ ISBN });

    if (existingEdition) {
      return res
        .status(400)
        .json({ message: "ISBN đã tồn tại trong hệ thống." });
    }

    const newEdition = new Edition({
      ISBN,
      PublicationDate,
      PrintRunSize,
      Pages,
      Format,
      Price,
      Amount,
      BookID,
    });

    await newEdition.save();
    console.log(newEdition);
    res
      .status(201)
      .json({ message: "Edition created successfully!", newEdition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateEdition = async (req, res) => {
  try {
    const { PublicationDate, PrintRunSize, Pages, Format, Price, Amount } =
      req.body;
    const BookID = req.params.bookId;
    const ISBN = req.params.isbn;
    const updatedEdition = await Edition.findOneAndUpdate(
      { ISBN: ISBN, BookID: BookID },
      { PublicationDate, PrintRunSize, Pages, Format, Price, Amount },
      { new: true }
    );

    if (!updatedEdition) {
      return res.status(404).json({ message: "Edition not found" });
    }

    res
      .status(200)
      .json({ message: "Edition updated successfully!", updatedEdition });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEdition = async (req, res) => {
  const isbn = req.params.isbn;
  console.log(isbn);
  try {
    if (!isbn) {
      return res.status(400).json({ message: "Missing ISBN" });
    }

    const deletedEdition = await Edition.findOneAndDelete({ ISBN: isbn });

    if (!deletedEdition) {
      return res.status(404).json({ message: "Edition not found" });
    }

    res
      .status(200)
      .json({ message: "Edition deleted successfully!", deletedEdition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEditionByBookId,
  getEditionByEditionId,
  createEdition,
  deleteEdition,
  updateEdition,
};
