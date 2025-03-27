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

const bookSearch = async (req, res) => {
  const text = req.query.text;
  console.log("search: ", text);
  if (!text) {
    return res.status(400).json({ message: "Missing search text" });
  }
  try {
    const books = await Book.find({
      $or: [
        { Title: { $regex: text, $options: "i" } },
        { Description: { $regex: text, $options: "i" } },
      ],
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getBooksWithAuthorsAndLatestPublished = async (req, res) => {
  try {
    const books = await Book.aggregate([
      [
        {
          $lookup: {
            from: "is_written",
            localField: "BookID",
            foreignField: "BookID",
            as: "isWritten",
          },
        },
        {
          $lookup: {
            from: "author",
            localField: "isWritten.AuthorID",
            foreignField: "AuthorID",
            as: "Authors",
          },
        },
        {
          $lookup: {
            from: "edition",
            localField: "BookID",
            foreignField: "BookID",
            as: "Edition",
          },
        },
        {
          $lookup: {
            from: "issue",
            localField: "BookID",
            foreignField: "BookID",
            as: "Issue",
          },
        },
        {
          $unwind: {
            path: "$Edition",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "Edition.PublicationDate": -1,
          },
        },
        {
          $unwind: {
            path: "$Issue",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "Issue.PublicationDate": -1,
          },
        },
        {
          $group: {
            _id: "$BookID",
            Title: { $first: "$Title" },
            Description: { $first: "$Description" },
            BookType: { $first: "$BookType" },
            Authors: { $first: "$Authors" },
            LastPublished: {
              $first: {
                $cond: {
                  if: { $in: ["$BookType", ["Sách tham khảo", "Tiểu thuyết"]] },
                  then: "$Edition",
                  else: "$Issue",
                },
              },
            },
          },
        },
      ],
    ]);

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBooksWithAuthorsAndLatestPublishedByBookID = async (req, res) => {
  const BookID = req.params.bookId;
  try {
    const book = await Book.aggregate([
      [
        {
          $match: {
            BookID: `${BookID}`,
          },
        },
        {
          $lookup: {
            from: "is_written",
            localField: "BookID",
            foreignField: "BookID",
            as: "isWritten",
          },
        },
        {
          $lookup: {
            from: "author",
            localField: "isWritten.AuthorID",
            foreignField: "AuthorID",
            as: "Authors",
          },
        },
        {
          $lookup: {
            from: "edition",
            localField: "BookID",
            foreignField: "BookID",
            as: "Edition",
          },
        },
        {
          $lookup: {
            from: "issue",
            localField: "BookID",
            foreignField: "BookID",
            as: "Issue",
          },
        },
        {
          $unwind: {
            path: "$Edition",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "Edition.PublicationDate": -1,
          },
        },
        {
          $unwind: {
            path: "$Issue",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "Issue.PublicationDate": -1,
          },
        },
        {
          $group: {
            _id: "$BookID",
            Title: { $first: "$Title" },
            Description: { $first: "$Description" },
            BookType: { $first: "$BookType" },
            Authors: { $first: "$Authors" },
            LastPublished: {
              $first: {
                $cond: {
                  if: { $in: ["$BookType", ["Sách tham khảo", "Tiểu thuyết"]] },
                  then: "$Edition",
                  else: "$Issue",
                },
              },
            },
          },
        },
      ],
    ]);

    res.status(200).json(book[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBooksByFilters = async (req, res) => {
  try {
    const { authorId, bookType, minPrice, maxPrice } = req.query;
    let matchCondition = {};

    // Nếu có authorId, lọc theo tác giả
    if (authorId) {
      matchCondition["Authors.AuthorID"] = authorId;
    }

    // Nếu có bookType, lọc theo thể loại
    if (bookType) {
      matchCondition["BookType"] = bookType;
    }

    // Nếu có minPrice hoặc maxPrice, lọc theo giá sách
    if (minPrice || maxPrice) {
      matchCondition["Price"] = {};
      if (minPrice) matchCondition["Price"]["$gte"] = parseFloat(minPrice);
      if (maxPrice) matchCondition["Price"]["$lte"] = parseFloat(maxPrice);
    }

    const books = await Book.aggregate([
      {
        $lookup: {
          from: "book_award", // JOIN với BookAward
          localField: "BookID",
          foreignField: "BookID",
          as: "Awards",
        },
      },
      {
        $lookup: {
          from: "book_genre", // JOIN với BookGenre
          localField: "BookID",
          foreignField: "BookID",
          as: "Genres",
        },
      },
      {
        $lookup: {
          from: "is_written", // JOIN với bảng chứa thông tin tác giả
          localField: "BookID",
          foreignField: "BookID",
          as: "Authors",
        },
      },
      {
        $match: matchCondition, // Áp dụng bộ lọc
      },
    ]);

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sách phù hợp." });
    }

    return res.status(200).json(books);
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
  bookSearch,
  getBooksByFilters,
  getBooksWithAuthorsAndLatestPublished,
  getBooksWithAuthorsAndLatestPublishedByBookID,
};
