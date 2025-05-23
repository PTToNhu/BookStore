import React, { useEffect, useState } from "react";
import "./BookManagement.css";
import HeaderStaff from "../Staff/HeaderStaff";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const BookManagement = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State cho thanh tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const [showForm, setShowForm] = useState(false); // Hiển thị form thêm sách
  const [publishers, setPublishers] = useState([]); // Danh sách nhà xuất bản
  const [authors, setAuthors] = useState([]); // Danh sách tác giả
  const [newBook, setNewBook] = useState({
    Title: "",
    Description: "",
    VolumnNumber: "",
    PubID: "",
    BookType: "Truyện tranh",
    Authors: [],
  });

  // handle edition ,issue
  const [showEditionForm, setShowEditionForm] = useState(false); // Hiển thị form Edition
  const [showIssueForm, setShowIssueForm] = useState(false); // Hiển thị form Issue
  const [bookId, setBookId] = useState("");

  const [issue, setIssue] = useState({
    ISSN: "",
    IssueNumber: "",
    PublicationDate: "",
    Pages: "",
    SpecialIssue: "",
    Volumn: "",
    Price: "",
    Amount: "",
  });

  const [edition, setEdition] = useState({
    ISBN: "",
    PublicationDate: "",
    PrintRunSize: "",
    Pages: "",
    Format: "",
    Price: "",
    Amount: "",
  });
  const token = localStorage.getItem("token");
  // Định nghĩa hàm fetchBooks bên ngoài useEffect
  const fetchBooks = useCallback(
    async (search = "", page = 1) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/staff/book/get-all?page=${page}&limit=20&search=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Set the Authorization header with the token
            },
          } // Gửi request phân trang
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ API");
        }
        const data = await response.json();
        setBooks(data.books); // Danh sách sách
        setTotalPages(data.totalPages); // Tổng số trang
        setLoading(false);

        // au pu
        const publisherResponse = await fetch(
          "http://localhost:5000/api/get-all-publisher"
        );
        const authorResponse = await fetch(
          "http://localhost:5000/api/author/get-all"
        );

        if (!publisherResponse.ok || !authorResponse.ok) {
          throw new Error("Không thể tải dữ liệu từ API.");
        }

        const publishersData = await publisherResponse.json();
        const authorsData = await authorResponse.json();

        setPublishers(publishersData);
        setAuthors(authorsData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    },
    [token]
  );

  // Sử dụng fetchBooks trong useEffect
  // useEffect(() => {
  //   fetchBooks(searchTerm, currentPage);
  // }, [currentPage, searchTerm]); // Gọi lại khi currentPage hoặc searchTerm thay đổi
  useEffect(() => {
    fetchBooks(searchTerm, currentPage);
  }, [fetchBooks, currentPage, searchTerm]);
  // Xử lý tìm kiếm khi bấm nút Tìm kiếm
  const handleSearch = () => {
    setLoading(true); // Hiển thị loading khi tìm kiếm
    fetchBooks(searchTerm, 1); // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1); // Đặt lại currentPage về 1
  };

  // Xử lý gửi yêu cầu thêm sách mới
  const handleAddBook = async () => {
    if (parseInt(newBook.VolumnNumber) <= 0) {
      alert("Số chương phải là số dương.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/book/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const msg = await response.json();
      if (!response.ok) {
        throw new Error(msg.message || "Lỗi khi thêm sách mới.");
      }

      alert("Thêm sách thành công!");
      // Lưu BookID vừa tạo
      const data = await response.json();
      setBookId(data.BookID);
      console.log(data.BookID);
      // Hiển thị form Edition hoặc Issue
      if (
        newBook.BookType === "Tiểu thuyết" ||
        newBook.BookType === "Sách tham khảo"
      ) {
        setShowEditionForm(true);
      } else if (
        newBook.BookType === "Truyện tranh" ||
        newBook.BookType === "Tạp chí"
      ) {
        setShowIssueForm(true);
      }

      setShowForm(false); // Đóng form
      setNewBook({
        Title: "",
        Description: "",
        VolumnNumber: "",
        PubID: "",
        BookType: "Truyện tranh",
        Authors: "",
      }); // Reset form
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  if (loading) return <p>Đang tải dữ liệu ...</p>;
  if (error) return <p>Có lỗi xảy ra: {error}</p>;

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddIssue = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/book/issue/${bookId}/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(issue),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi thêm Issue.");
      }

      alert("Thêm Issue thành công!");
      setShowIssueForm(false);
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  const handleAddEdition = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/book/edition/${bookId}/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(edition),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi thêm Edition.");
      }

      alert("Thêm Edition thành công!");
      setShowEditionForm(false);
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  // Hàm hiển thị danh sách số trang
  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <button
        key="prev"
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trang trước
      </button>
    );

    pages.push(
      <button
        key="1"
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(<span key="ellipsis-start">...</span>);
    }

    // Hiển thị các trang gần trang hiện tại
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis-end">...</span>);
    }

    pages.push(
      <button
        key={totalPages}
        className={`pagination-button ${
          currentPage === totalPages ? "active" : ""
        }`}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </button>
    );

    pages.push(
      <button
        key="next"
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Trang sau
      </button>
    );

    return pages;
  };

  return (
    <div className="book-management-container">
      <HeaderStaff />
      <header className="header">
        <h1>Quản lý đầu sách</h1>
      </header>

      {/* Thanh tìm kiếm và nút thêm sách */}
      <div className="search-and-add-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Tìm kiếm{" "}
        </button>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Thêm sách mới
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h2>Thêm sách mới</h2>

              {/* Tiêu đề */}
              <label For="Title">
                Tiêu đề <span className="required">*</span>
              </label>
              <input
                id="Title"
                type="text"
                className="form-input"
                placeholder="Nhập tiêu đề"
                value={newBook.Title}
                onChange={(e) =>
                  setNewBook({ ...newBook, Title: e.target.value })
                }
              />

              {/* Mô tả */}
              <label For="Description">
                Mô tả <span className="required">*</span>
              </label>
              <textarea
                id="Description"
                className="form-textarea"
                placeholder="Nhập mô tả"
                value={newBook.Description}
                onChange={(e) =>
                  setNewBook({ ...newBook, Description: e.target.value })
                }
              />

              {/* Số chương */}
              <label For="VolumnNumber">
                Số chương <span className="required">*</span>
              </label>
              <input
                id="VolumnNumber"
                type="number"
                className="form-input"
                placeholder="Nhập số chương"
                value={newBook.VolumnNumber}
                onChange={(e) =>
                  setNewBook({ ...newBook, VolumnNumber: e.target.value })
                }
              />

              {/* Nhà xuất bản */}
              <label For="PubID">
                Nhà xuất bản <span className="required">*</span>
              </label>
              <select
                id="PubID"
                className="form-select"
                value={newBook.PubID}
                onChange={(e) =>
                  setNewBook({ ...newBook, PubID: e.target.value })
                }
              >
                <option value="">Chọn nhà xuất bản</option>
                {publishers.map((pub) => (
                  <option key={pub.PubID} value={pub.PubID}>
                    {pub.PublishingHouse}
                  </option>
                ))}
              </select>

              {/* Thể loại */}
              <label htmlFor="BookType">
                Thể loại <span className="required">*</span>
              </label>
              <select
                id="BookType"
                className="form-select"
                value={newBook.BookType}
                onChange={(e) =>
                  setNewBook({ ...newBook, BookType: e.target.value })
                }
              >
                <option value="Truyện tranh">Truyện tranh</option>
                <option value="Sách tham khảo">Sách tham khảo</option>
                <option value="Tiểu thuyết">Tiểu thuyết</option>
                <option value="Tạp chí">Tạp chí</option>
              </select>

              {/* Tác giả */}
              <label htmlFor="Author">
                Tác giả <span className="required">*</span>
              </label>
              <select
                id="Author"
                className="form-select"
                value={newBook.Authors}
                onChange={(e) =>
                  setNewBook({ ...newBook, Authors: e.target.value })
                }
                disabled={newBook.BookType === "Tạp chí"}
              >
                <option value="">Chọn tác giả</option>
                {authors.map((pub) => (
                  <option key={pub.AuthorID} value={pub.AuthorID}>
                    {pub.LastName} {pub.FirstName}
                  </option>
                ))}
              </select>
              {/* Nút Lưu & Hủy */}
              <div className="modal-buttons">
                <button onClick={handleAddBook} className="save-button">
                  Lưu
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Table */}
      <table className="book-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã sách</th>
            <th>Tiêu đề</th>
            <th>Thể loại</th>
            <th>Tác giả</th>
            <th>Ngày xuất bản</th>
            <th>Giá</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book._id}>
              <td>{(currentPage - 1) * 20 + index + 1}</td>
              {/* <td>{book._id}</td>
              <td>{book.Title}</td> */}
              <td
                className="clickable"
                onClick={() => navigate(`/management-book/${book._id}`)}
              >
                {book._id}
              </td>
              {/* Điều hướng đến trang chi tiết khi nhấn vào Tiêu đề */}
              <td
                className="clickable"
                onClick={() => navigate(`/management-book/${book._id}`)}
              >
                {book.Title}
              </td>

              <td>{book.BookType}</td>
              <td>
                {book.Authors.map((author) => (
                  <span key={author._id}>
                    {author.LastName} {author.FirstName}
                    <br />
                  </span>
                ))}
              </td>
              <td>
                {new Date(
                  book.LastPublished?.PublicationDate
                ).toLocaleDateString()}
              </td>
              <td>{book.LastPublished?.Price} VND</td>
              <td>{book.LastPublished?.Amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showIssueForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h2>Thêm Issue</h2>
              <label htmlFor="ISSN">
                ISSN <span className="required">*</span>
              </label>
              <input
                id="ISSN"
                type="text"
                placeholder="ISSN"
                className="form-input"
                onChange={(e) => setIssue({ ...issue, ISSN: e.target.value })}
              />
              <label htmlFor="IssNum">
                Số phát hành <span className="required">*</span>
              </label>
              <input
                id="IssNum"
                type="number"
                placeholder="Issue Number"
                className="form-input"
                onChange={(e) =>
                  setIssue({ ...issue, IssueNumber: e.target.value })
                }
              />
              <label htmlFor="PubDate">
                Ngày phát hành <span className="required">*</span>
              </label>
              <input
                id="PubDate"
                type="date"
                placeholder="Publication Date"
                className="form-input"
                onChange={(e) =>
                  setIssue({ ...issue, PublicationDate: e.target.value })
                }
              />
              <label htmlFor="NumPage">
                Số trang <span className="required">*</span>
              </label>
              <input
                id="NumPage"
                type="number"
                placeholder="Pages"
                className="form-input"
                onChange={(e) => setIssue({ ...issue, Pages: e.target.value })}
              />
              {/* <label htmlFor="IsSpecial">
                Số đặc biệt? <span className="required">*</span>
              </label>
              <input
                id="IsSpecial"
                type="text"
                placeholder="Special Issue"
                className="form-input"
                onChange={(e) =>
                  setIssue({ ...issue, SpecialIssue: e.target.value })
                }
              /> */}
              <label htmlFor="NumVol">
                Số chương <span className="required">*</span>
              </label>
              <input
                id="NumVol"
                type="number"
                placeholder="Volumn"
                className="form-input"
                onChange={(e) => setIssue({ ...issue, Volumn: e.target.value })}
              />
              <label htmlFor="IssPrice">
                Giá <span className="required">*</span>
              </label>
              <input
                id="IssPrice"
                type="number"
                placeholder="Price"
                className="form-input"
                onChange={(e) => setIssue({ ...issue, Price: e.target.value })}
              />
              <label htmlFor="amountIss">
                Số lượng <span className="required">*</span>
              </label>
              <input
                id="amountIss"
                type="number"
                placeholder="Amount"
                className="form-input"
                onChange={(e) => setIssue({ ...issue, Amount: e.target.value })}
              />

              <div className="modal-buttons">
                <button
                  onClick={() => handleAddIssue()}
                  className="save-button"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setShowIssueForm(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditionForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h2>Thêm Edition</h2>
              <label htmlFor="ISBN">
                ISBN <span className="required">*</span>
              </label>
              <input
                id="ISBN"
                type="text"
                placeholder="ISBN"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, ISBN: e.target.value })
                }
              />
              <label htmlFor="EditionPubDate">
                Ngày xuất bản <span className="required">*</span>
              </label>
              <input
                id="EditionPubDate"
                type="date"
                placeholder="Ngày xuất bản"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, PublicationDate: e.target.value })
                }
              />
              <label htmlFor="PriRunSz">
                Kích thước bản in <span className="required">*</span>
              </label>
              <input
                id="PriRunSz"
                type="text"
                placeholder="Kích thước bản in"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, PrintRunSize: e.target.value })
                }
              />
              <label htmlFor="numPageE">
                Số trang <span className="required">*</span>
              </label>
              <input
                id="numPageE"
                type="number"
                placeholder="Pages"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, Pages: e.target.value })
                }
              />
              <label htmlFor="format">
                Định dạng <span className="required">*</span>
              </label>
              <select
                id="format"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, Format: e.target.value })
                }
              >
                <option value="">---Chọn định dạng sách---</option>
                <option value="Sách bìa cứng khổ lớn">
                  Sách bìa cứng khổ lớn
                </option>
                <option value="Sách bìa mềm thương mại">
                  Sách bìa mềm thương mại
                </option>
                <option value="Sách bỏ túi nhỏ">Sách bỏ túi nhỏ</option>
                <option value="Sách khổ Digest">Sách khổ Digest</option>
                <option value="Sách bìa cứng tiêu chuẩn">
                  Sách bìa cứng tiêu chuẩn
                </option>
                <option value="Khổ A4">Khổ A4</option>
                <option value="Khổ A5">Khổ A5</option>
                <option value="Sách bỏ túi">Sách bỏ túi</option>
                <option value="Sách vuông lớn">Sách vuông lớn</option>
                <option value="Sách vuông nhỏ">Sách vuông nhỏ</option>
              </select>
              {/* <input
                id="format"
                type="text"
                placeholder="Format"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, Format: e.target.value })
                }
              /> */}
              <label htmlFor="ePrice">
                Giá <span className="required">*</span>
              </label>
              <input
                id="ePrice"
                type="number"
                placeholder="Price"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, Price: e.target.value })
                }
              />
              <label htmlFor="eAmount">
                Số lượng <span className="required">*</span>
              </label>
              <input
                id="eAmount"
                type="number"
                placeholder="Amount"
                className="form-input"
                onChange={(e) =>
                  setEdition({ ...edition, Amount: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button
                  onClick={() => handleAddEdition()}
                  className="save-button"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setShowEditionForm(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container">{renderPageNumbers()}</div>
    </div>
  );
};

export default BookManagement;
