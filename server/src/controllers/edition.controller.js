const db = require("../models");
const Edition = db.Edition;

const getEditionByBookId = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    // const editionId = req.params.editionId;
    console.log(bookId);
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
      Format,
      Price,
      Amount,
      BookID,
    } = req.body;

    if (!ISBN || !PublicationDate || !PrintRunSize || !BookID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEdition = new Edition({
      ISBN,
      PublicationDate,
      PrintRunSize,
      Format,
      Price,
      Amount,
      BookID,
    });

    await newEdition.save();

    res
      .status(201)
      .json({ message: "Edition created successfully!", newEdition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteEdition = async (req, res) => {
  const isbn = req.params.isbn;

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
};
