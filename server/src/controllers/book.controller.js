const db = require("../models");
const Book = db.Book;
const Rating=db.Rating;

const bookSearch = async (req, res) => {
  const text = req.query.text;
  if (!text) {
    return res.status(400).json({ message: "Missing search text" });
  }
  try {
    const books = await Book.find({
      Title: { $regex: text, $options: "i" },
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getAllBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;
  try {
    let earlyMatch = {};
    let lateMatch = {};

    if (req.query.authorId) {
      earlyMatch["Author"] = {
        $elemMatch: { AuthorID: req.query.authorId },
      };
    }

    if (req.query.bookType) {
      console.log("res.query.bookType", req.query.bookType);
      earlyMatch["BookType"] = req.query.bookType;
      console.log("REres.query.bookType", req.query.bookType);
    }
    console.log("earlyMatch", earlyMatch);

    if (req.query.minPrice || req.query.maxPrice) {
      lateMatch["LastPublished.Price"] = {};
      if (req.query.minPrice)
        lateMatch["LastPublished.Price"]["$gte"] = parseFloat(
          req.query.minPrice
        );
      if (req.query.maxPrice)
        lateMatch["LastPublished.Price"]["$lt"] = parseFloat(
          req.query.maxPrice
        );
    }
    // const books = await Book.aggregate([
    //   {
    //     $lookup: {
    //       from: "is_written",
    //       localField: "BookID",
    //       foreignField: "BookID",
    //       as: "isWritten",
    //     },
    //   },
    //   // {
    //   //   $unwind: {
    //   //     path: "$isWritten",
    //   //     preserveNullAndEmptyArrays: true,
    //   //   },
    //   // },
    //   // {
    //   //   $group: {
    //   //     _id: "$BookID",
    //   //     Title: { $first: "$Title" },
    //   //     BookType: { $first: "$BookType" },
    //   //     Author: {
    //   //       $addToSet: {
    //   //         AuthorID: "$isWritten.AuthorID",
    //   //       },
    //   //     },
    //   //   },
    //   // },
    //   {
    //     $addFields: {
    //       AuthorsID: {
    //         $map: {
    //           input: "$isWritten",
    //           as: "a",
    //           in: "$$a.AuthorID"
    //         }
    //       }
    //     }
    //   },
    //   {$sort: {_id:1}},
    //   ...(Object.keys(earlyMatch).length ? [{ $match: earlyMatch }] : []),
    //   {
    //     $lookup: {
    //       from: "rating",
    //       localField: "_id",
    //       foreignField: "BookID",
    //       as: "Ratings",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       Rating: { $avg: "$Ratings.Rating" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "edition",
    //       localField: "_id",
    //       foreignField: "BookID",
    //       as: "Edition",
    //     },
    //   },
    //   {$sort: {
    //     PublicationDate: 1
    //   }},
    //   {
    //     $lookup: {
    //       from: "issue",
    //       localField: "_id",
    //       foreignField: "BookID",
    //       as: "Issue",
    //     },
    //   },
    //   {$sort: {
    //     PublicationDate: 1
    //   }},
    //   {
    //     $addFields: {
    //       LastPublished: {
    //         $cond: {
    //           if: { $in: ["$BookType", ["Sách tham khảo", "Tiểu thuyết"]] },
    //           then: {
    //             Price: { $arrayElemAt: ["$Edition.Price", 0] },
    //           },
    //           else: {
    //             Volumn: { $arrayElemAt: ["$Issue.Volumn", 0] },
    //             Price: { $arrayElemAt: ["$Issue.Price", 0] },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   ...(Object.keys(lateMatch).length ? [{ $match: lateMatch }] : []),
    //   { $skip: skip },
    //   { $limit: limit + 1 },
    // ]);
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "is_written",
          localField: "BookID",
          foreignField: "BookID",
          as: "isWritten",
        },
      },
      {
        $unwind: {
          path: "$isWritten",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$BookID",
          Title: { $first: "$Title" },
          BookType: { $first: "$BookType" },
          Author: {
            $addToSet: {
              AuthorID: "$isWritten.AuthorID",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      ...(Object.keys(earlyMatch).length ? [{ $match: earlyMatch }] : []),
      {
        $lookup: {
          from: "rating",
          localField: "_id",
          foreignField: "BookID",
          as: "Ratings",
        },
      },
      {
        $addFields: {
          Rating: { $avg: "$Ratings.Rating" },
        },
      },
      {
        $lookup: {
          from: "edition",
          localField: "_id",
          foreignField: "BookID",
          as: "Edition",
        },
      },
      {
        $lookup: {
          from: "issue",
          localField: "_id",
          foreignField: "BookID",
          as: "Issue",
        },
      },
      {
        $addFields: {
          SortedEditions: {
            $sortArray: { input: "$Edition", sortBy: { PublicationDate: 1 } },
          },
          SortedIssues: {
            $sortArray: { input: "$Issue", sortBy: { PublicationDate: 1 } },
          },
        },
      },
      {
        $addFields: {
          LastPublished: {
            Price: {
              $cond: {
                if: { $in: ["$BookType", ["Sách tham khảo", "Tiểu thuyết"]] },
                then: { $last: "$SortedEditions.Price" },
                else: { $last: "$SortedIssues.Price" },
              },
            },
            Volumn: {
              $cond: {
                if: { $in: ["$BookType", ["Sách tham khảo", "Tiểu thuyết"]] },
                then: null,
                else: { $last: "$SortedIssues.Volumn" },
              },
            },
          },
        },
      },
      ...(Object.keys(lateMatch).length ? [{ $match: lateMatch }] : []),
      {
        $project: {
          BookID: 1,
          Title: 1,
          BookType: 1,
          AuthorsID: 1,
          Rating: 1,
          LastPublished: 1,
        },
      },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);
    const hasMore = books.length > limit;
    const data = hasMore ? books.slice(0, limit) : books;
    if (!data || data.length === 0) {
      return res.status(201).json({ message: "Không tìm thấy sách phù hợp." });
    }
    res.status(200).json({
      message: "Tìm thấy sách phù hợp",
      books: data,
      hasMore: hasMore,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBookById = async (req, res) => {
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
const getAvgRatingById = async (req, res) => {
  const BookID = req.params.BookID;
  try {
    const rating = await Rating.aggregate([
      {
        $match: {
          BookID: `${BookID}`,
        },
      },
      {
        $group: {
          _id: "$BookID",
          Rating: {
            $avg: "$Rating",
          },
        },
      },
    ]);
    return res.status(200).json(rating[0].Rating?rating[0].Rating:0);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  bookSearch,
  getAvgRatingById
};
