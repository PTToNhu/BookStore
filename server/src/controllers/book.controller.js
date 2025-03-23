const db = require("../models");
const Book = db.Book;
const BookAward = db.BookAward;
const BookGenre = db.BookGenre;
const IsWritten = db.Is_written;
const Rating = db.Rating;
// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "book_award", // Collection của BookAward
          localField: "BookID",
          foreignField: "BookID",
          as: "Awards",
        },
      },
      {
        $lookup: {
          from: "book_genre", // Collection của BookGenre
          localField: "BookID",
          foreignField: "BookID",
          as: "Genres",
        },
      },
      {
        $lookup: {
          from: "is_written", // Collection của Author (thông qua IsWritten)
          localField: "BookID",
          foreignField: "BookID",
          as: "Authors",
        },
      },
    ]);
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.aggregate([
      { $match: { BookID: bookId } }, // Tìm sách theo BookID
      {
        $lookup: {
          from: "book_award",
          localField: "BookID",
          foreignField: "BookID",
          as: "Awards",
        },
      },
      {
        $lookup: {
          from: "book_genre",
          localField: "BookID",
          foreignField: "BookID",
          as: "Genres",
        },
      },
      {
        $lookup: {
          from: "is_written",
          localField: "BookID",
          foreignField: "BookID",
          as: "Authors",
        },
      },
    ]);
    if (!book || book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add a new book
const createBook = async (req, res) => {
  const {
    BookID,
    Description,
    Title,
    VolumnNumber,
    PubID,
    BookType,
    SeriesID,
    Awards,
    Genres,
    Authors,
  } = req.body;

  if (!BookID || !PubID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newBook = new Book({
      BookID,
      Description,
      Title,
      VolumnNumber,
      PubID,
      BookType,
      SeriesID,
    });

    await newBook.save();

    // Thêm các Awards, Genres và Authors
    if (Awards && Awards.length > 0) {
      const awardsToSave = Awards.map((award) => ({
        BookID,
        ...award,
      }));
      await BookAward.insertMany(awardsToSave);
    }

    if (Genres && Genres.length > 0) {
      const genresToSave = Genres.map((genre) => ({
        BookID,
        Genre: genre,
      }));
      await BookGenre.insertMany(genresToSave);
    }

    if (Authors && Authors.length > 0) {
      const authorsToSave = Authors.map((authorId) => ({
        BookID,
        AuthorID: authorId,
      }));
      await IsWritten.insertMany(authorsToSave);
    }

    return res.status(201).json({ message: "Book created successfully!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update a book by ID
const updateBook = async (req, res) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    return res.status(400).json({ message: "Missing book ID" });
  }

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { BookID: bookId },
      req.body,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Cập nhật Awards, Genres, Authors nếu cần
    const { Awards, Genres, Authors } = req.body;

    if (Awards) {
      await BookAward.deleteMany({ BookID: bookId });
      const awardsToSave = Awards.map((award) => ({
        BookID: bookId,
        ...award,
      }));
      await BookAward.insertMany(awardsToSave);
    }

    if (Genres) {
      await BookGenre.deleteMany({ BookID: bookId });
      const genresToSave = Genres.map((genre) => ({
        BookID: bookId,
        Genre: genre,
      }));
      await BookGenre.insertMany(genresToSave);
    }

    if (Authors) {
      await IsWritten.deleteMany({ BookID: bookId });
      const authorsToSave = Authors.map((authorId) => ({
        BookID: bookId,
        AuthorID: authorId,
      }));
      await IsWritten.insertMany(authorsToSave);
    }

    return res.status(200).json(updatedBook);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a book by ID

const deleteBook = async (req, res) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    return res.status(400).json({ message: "Missing book ID" });
  }

  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get rating and comments for a book
const getRatingBook = async (req, res) => {
  const bookId = req.params.bookId;
  console.log(bookId);
  try {
    const ratings = await Rating.find({ BookID: bookId });
    console.log(ratings);
    if (!ratings) {
      return res.status(404).json({ message: "Book not have rating" });
    }
    return res.status(200).json(ratings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getRatingBook,
};
