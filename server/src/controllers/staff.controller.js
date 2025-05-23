const db = require("../models");
const Book = db.Book;
const Staff = db.Staff;
const getBooksWithAuthorsAndLatestPublished = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 20; // Mỗi trang hiển thị 20 sách
    const skip = (page - 1) * limit; // Số sách cần bỏ qua
    const searchTerm = req.query.search || ""; // Từ khóa tìm kiếm

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
      { $unwind: { path: "$Edition", preserveNullAndEmptyArrays: true } },
      { $sort: { "Edition.PublicationDate": -1 } },
      { $unwind: { path: "$Issue", preserveNullAndEmptyArrays: true } },
      { $sort: { "Issue.PublicationDate": -1 } },
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

      {
        $addFields: {
          "Authors.FullName": {
            $map: {
              input: "$Authors",
              as: "author",
              in: { $concat: ["$$author.LastName", " ", "$$author.FirstName"] },
            },
          },
        },
      },
      // **Cập nhật điều kiện tìm kiếm**
      {
        $match: {
          $or: [
            { _id: { $regex: searchTerm, $options: "i" } }, // Tìm theo Mã sách (BookID)
            { Title: { $regex: searchTerm, $options: "i" } }, // Tìm theo Tiêu đề
            { BookType: { $regex: searchTerm, $options: "i" } }, // Tìm theo Thể loại
            { "Authors.FullName": { $regex: searchTerm, $options: "i" } }, // Tìm theo "Họ Tên" tác giả
          ],
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo _id
      {
        $facet: {
          booksData: [{ $skip: skip }, { $limit: limit }], // Phân trang
          totalCount: [{ $count: "total" }], // Đếm tổng số sách
        },
      },
    ]);

    const totalBooks = books[0]?.totalCount[0]?.total || 0;

    res.status(200).json({
      books: books[0].booksData,
      totalBooks: totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getStaffProfile = async (req, res) => {
  try {
    const StaffID = req.params.staffId; // Lấy StaffID từ token đã giải mã

    // Tìm thông tin nhân viên
    const staff = await Staff.findOne({ StaffID });
    if (!staff) {
      return res.status(404).json({ error: "Không tìm thấy nhân viên." });
    }

    // Tìm thông tin quản lý (nếu có)
    let managerName = null;
    console.log(staff);
    if (staff.ManagerID) {
      const manager = await Staff.findOne({ StaffID: staff.ManagerID });
      managerName = manager ? `${manager.LastName} ${manager.FirstName}` : null;
    }

    // Trả về thông tin nhân viên
    res.status(200).json({
      Name: `${staff.LastName} ${staff.FirstName}`,
      StaffID: staff.StaffID,
      Salary: staff.Salary,
      HireDate: staff.HireDate,
      ManagerName: managerName,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBooksWithAuthorsAndLatestPublished, getStaffProfile };
