import React, { useEffect, useState } from "react";
import "./BookDetail.css";
import HeaderStaff from "../Staff/HeaderStaff";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";

const BookDetail = () => {
  const { bookId } = useParams(); // Lấy bookId từ URL
  const [bookDetails, setBookDetails] = useState(null); // Thông tin sách
  const [editions, setEditions] = useState([]); // Danh sách Editions
  const [issues, setIssues] = useState([]); // Danh sách Issues
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showEditionForm, setShowEditionForm] = useState(false);
  const [issue, setIssue] = useState({
    ISSN: "",
    IssueNumber: "",
    PublicationDate: "",
    Pages: "",
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

  const [showEditIssueForm, setShowEditIssueForm] = useState(false);
  const [showEditEditionForm, setShowEditEditionForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch thông tin sách
        const bookResponse = await fetch(
          `http://localhost:5000/api/book/${bookId}`
        );
        if (!bookResponse.ok) throw new Error("Không thể lấy thông tin sách.");
        const bookData = await bookResponse.json();
        setBookDetails(bookData);

        // Fetch Editions
        const editionResponse = await fetch(
          `http://localhost:5000/api/get-all-edition/${bookId}`
        );
        if (!editionResponse.ok)
          throw new Error("Không thể lấy danh sách Editions.");
        const editionData = await editionResponse.json();
        setEditions(editionData);

        // Fetch Issues
        const issueResponse = await fetch(
          `http://localhost:5000/api/get-all-issue/${bookId}`
        );
        if (!issueResponse.ok)
          throw new Error("Không thể lấy danh sách Issues.");
        const issueData = await issueResponse.json();
        setIssues(issueData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  if (loading) return <p>Đang tải dữ liệu ...</p>;
  if (error) return <p>Có lỗi xảy ra: {error}</p>;
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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi thêm Issue.");
      }

      alert("Thêm Issue thành công!");
      const updatedIssueResponse = await fetch(
        `http://localhost:5000/api/get-all-issue/${bookId}`
      );
      const updatedIssueData = await updatedIssueResponse.json();
      setIssues(updatedIssueData); // Cập nhật bảng ngay lập tức
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi thêm Edition.");
      }

      alert("Thêm Edition thành công!");
      // Gọi lại API lấy danh sách Edition sau khi cập nhật
      const updatedEditionResponse = await fetch(
        `http://localhost:5000/api/get-all-edition/${bookId}`
      );
      const updatedEditionData = await updatedEditionResponse.json();
      setEditions(updatedEditionData); // Cập nhật bảng ngay lập tức
      setShowEditionForm(false);
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  const handleUpdateIssue = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/book/issue/${bookId}/${selectedItem.ISSN}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedItem),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật Issue.");
      }

      alert("Cập nhật Issue thành công!");
      setShowEditIssueForm(false); // Đóng form

      // Gọi lại API lấy danh sách Issue sau khi cập nhật
      const updatedIssueResponse = await fetch(
        `http://localhost:5000/api/get-all-issue/${bookId}`
      );
      const updatedIssueData = await updatedIssueResponse.json();
      setIssues(updatedIssueData); // Cập nhật bảng ngay lập tức
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  const handleUpdateEdition = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/book/edition/${bookId}/${selectedItem.ISBN}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedItem),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật Edition.");
      }

      alert("Cập nhật Edition thành công!");
      setShowEditEditionForm(false); // Đóng form

      // Gọi lại API lấy danh sách Edition sau khi cập nhật
      const updatedEditionResponse = await fetch(
        `http://localhost:5000/api/get-all-edition/${bookId}`
      );
      const updatedEditionData = await updatedEditionResponse.json();
      setEditions(updatedEditionData); // Cập nhật bảng ngay lập tức
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  const handleDeleteItem = (item) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa?");

    if (confirmDelete) {
      if (bookId.startsWith("CO") || bookId.startsWith("MA")) {
        handleDeleteIssue(item.ISSN); // Gọi hàm xóa Issue
      } else {
        handleDeleteEdition(item.ISBN);
      }
    }
  };

  const handleDeleteIssue = async (issn) => {
    try {
      const response = await fetch(
        `http://localhost:5000/book/issue/${issn}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xóa Issue.");
      }

      alert("Xóa Issue thành công!");

      const updatedIssueResponse = await fetch(
        `http://localhost:5000/api/get-all-issue/${bookId}`
      );
      const updatedIssueData = await updatedIssueResponse.json();
      setIssues(updatedIssueData);
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

  const handleDeleteEdition = async (isbn) => {
    try {
      const response = await fetch(
        `http://localhost:5000/book/edition/${isbn}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xóa Edition.");
      }

      alert("Xóa Edition thành công!");

      const updatedEditionResponse = await fetch(
        `http://localhost:5000/api/get-all-edition/${bookId}`
      );
      const updatedEditionData = await updatedEditionResponse.json();
      setEditions(updatedEditionData);
    } catch (err) {
      alert("Có lỗi xảy ra: " + err.message);
    }
  };
  return (
    <div className="book-detail-container">
      <HeaderStaff />
      <div className="book-infor">
        <h1>Chi tiết sách: {bookDetails.Title}</h1>
        <p>
          <strong>Mô tả:</strong> {bookDetails.Description}
        </p>
        <p>
          <strong>Thể loại:</strong> {bookDetails.BookType}
        </p>
        <p>
          <strong>Tác giả:</strong>{" "}
          {bookDetails.Authors.map((author, index) => (
            <span key={author._id}>
              {author.LastName} {author.FirstName}
              {index < bookDetails.Authors.length - 1 && ", "}
            </span>
          ))}
        </p>
        <p>
          <strong>Nhà xuất bản:</strong> {bookDetails.PublishingHouse}
        </p>
      </div>

      <div className="list-edition-issue">
        {/* Bảng Edition/Issue */}
        <h2>
          {bookId.startsWith("CO") || bookId.startsWith("MA")
            ? "Danh sách Issue"
            : "Danh sách Edition"}
          :
        </h2>
        <table className="edition-issue-table">
          <thead>
            <tr>
              <th> STT</th>
              <th>
                {bookId.startsWith("CO") || bookId.startsWith("MA")
                  ? "ISSN"
                  : "ISBN"}
              </th>
              <th>Ngày xuất bản</th>
              <th>
                {bookId.startsWith("CO") || bookId.startsWith("MA")
                  ? "Số"
                  : "Kích thước"}
              </th>
              <th>Số trang</th>
              <th>
                {bookId.startsWith("CO") || bookId.startsWith("MA")
                  ? "Số chương"
                  : "Định dạng"}
              </th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...editions, ...issues].map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.ISBN || item.ISSN}</td>
                <td>{new Date(item.PublicationDate).toLocaleDateString()}</td>
                <td>{item.PrintRunSize || item.IssueNumber}</td>
                <td>{item.Pages}</td>
                <td>{item.Volumn || item.Format}</td>
                <td>{item.Price} VND</td>
                <td>{item.Amount}</td>
                <td>
                  {/* Nút Sửa */}
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => {
                        setSelectedItem(item);
                        bookId.startsWith("CO") || bookId.startsWith("MA")
                          ? setShowEditIssueForm(true)
                          : setShowEditEditionForm(true);
                      }}
                    >
                      Sửa
                    </button>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteItem(item)}
                    >
                      Xóa
                    </button>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Hiển thị Form Issue nếu BookID là CO hoặc MA */}
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
                  className="form-input"
                  onChange={(e) => setIssue({ ...issue, ISSN: e.target.value })}
                />
                <label htmlFor="IssueNumber">
                  Số phát hành <span className="required">*</span>
                </label>
                <input
                  id="IssueNumber"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setIssue({ ...issue, IssueNumber: e.target.value })
                  }
                />
                <label htmlFor="PublicationDate">
                  Ngày phát hành <span className="required">*</span>
                </label>
                <input
                  id="PublicationDate"
                  type="date"
                  className="form-input"
                  onChange={(e) =>
                    setIssue({ ...issue, PublicationDate: e.target.value })
                  }
                />
                <label htmlFor="Pages">
                  Số trang <span className="required">*</span>
                </label>
                <input
                  id="Pages"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setIssue({ ...issue, Pages: e.target.value })
                  }
                />
                <label htmlFor="Volumn">
                  Số chương <span className="required">*</span>
                </label>
                <input
                  id="Volumn"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setIssue({ ...issue, Volumn: e.target.value })
                  }
                />
                <label htmlFor="Price">
                  Giá <span className="required">*</span>
                </label>
                <input
                  id="Price"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setIssue({ ...issue, Price: e.target.value })
                  }
                />
                <label htmlFor="Amount">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  id="Amount"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setIssue({ ...issue, Amount: e.target.value })
                  }
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

        {/* Hiển thị Form Edition nếu BookID là RE hoặc NO */}
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
                  className="form-input"
                  onChange={(e) =>
                    setEdition({ ...edition, ISBN: e.target.value })
                  }
                />
                <label htmlFor="PublicationDate">
                  Ngày xuất bản <span className="required">*</span>
                </label>
                <input
                  id="PublicationDate"
                  type="date"
                  className="form-input"
                  onChange={(e) =>
                    setEdition({ ...edition, PublicationDate: e.target.value })
                  }
                />
                <label htmlFor="PrintRunSize">
                  Kích thước bản in <span className="required">*</span>
                </label>
                <input
                  id="PrintRunSize"
                  type="text"
                  className="form-input"
                  onChange={(e) =>
                    setEdition({ ...edition, PrintRunSize: e.target.value })
                  }
                />
                <label htmlFor="Pages">
                  Số trang <span className="required">*</span>
                </label>
                <input
                  id="Pages"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setEdition({ ...edition, Pages: e.target.value })
                  }
                />
                <label htmlFor="Format">
                  Định dạng <span className="required">*</span>
                </label>
                <select
                  id="Format"
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
                <label htmlFor="Price">
                  Giá <span className="required">*</span>
                </label>
                <input
                  id="Price"
                  type="number"
                  className="form-input"
                  onChange={(e) =>
                    setEdition({ ...edition, Price: e.target.value })
                  }
                />
                <label htmlFor="Amount">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  id="Amount"
                  type="number"
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

        {showEditIssueForm && selectedItem && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-content">
                <h2>Cập nhật Issue</h2>
                <label htmlFor="IssueNumber">
                  Số phát hành <span className="required">*</span>
                </label>
                <input
                  id="IssueNumber"
                  type="number"
                  className="form-input"
                  value={selectedItem.IssueNumber}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      IssueNumber: e.target.value,
                    })
                  }
                />
                <label htmlFor="PublicationDate">
                  Ngày phát hành <span className="required">*</span>
                </label>
                <input
                  id="PublicationDate"
                  type="date"
                  className="form-input"
                  value={selectedItem.PublicationDate.split("T")[0]}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      PublicationDate: e.target.value,
                    })
                  }
                />
                <label htmlFor="Pages">
                  Số trang <span className="required">*</span>
                </label>
                <input
                  id="Pages"
                  type="number"
                  className="form-input"
                  value={selectedItem.Pages}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Pages: e.target.value })
                  }
                />
                <label htmlFor="Volumn">
                  Số chương <span className="required">*</span>
                </label>
                <input
                  id="Volumn"
                  type="number"
                  className="form-input"
                  value={selectedItem.Volumn}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Volumn: e.target.value })
                  }
                />
                <label htmlFor="Price">
                  Giá <span className="required">*</span>
                </label>
                <input
                  id="Price"
                  type="number"
                  className="form-input"
                  value={selectedItem.Price}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Price: e.target.value })
                  }
                />
                <label htmlFor="Amount">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  id="Amount"
                  type="number"
                  className="form-input"
                  value={selectedItem.Amount}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Amount: e.target.value })
                  }
                />

                <div className="modal-buttons">
                  <button
                    onClick={() => handleUpdateIssue()}
                    className="save-button"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => setShowEditIssueForm(false)}
                    className="cancel-button"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditEditionForm && selectedItem && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-content">
                <h2>Cập nhật Edition</h2>
                <label htmlFor="PublicationDate">
                  Ngày xuất bản <span className="required">*</span>
                </label>
                <input
                  id="PublicationDate"
                  type="date"
                  className="form-input"
                  value={selectedItem.PublicationDate.split("T")[0]}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      PublicationDate: e.target.value,
                    })
                  }
                />
                <label htmlFor="PrintRunSize">
                  Kích thước bản in <span className="required">*</span>
                </label>
                <input
                  id="PrintRunSize"
                  type="text"
                  className="form-input"
                  value={selectedItem.PrintRunSize}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      PrintRunSize: e.target.value,
                    })
                  }
                />
                <label htmlFor="Pages">
                  Số trang <span className="required">*</span>
                </label>
                <input
                  id="Pages"
                  type="number"
                  className="form-input"
                  value={selectedItem.Pages}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Pages: e.target.value })
                  }
                />
                <label htmlFor="Format">
                  Định dạng <span className="required">*</span>
                </label>
                <input
                  id="Format"
                  type="text"
                  className="form-input"
                  value={selectedItem.Format}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Format: e.target.value })
                  }
                />
                <label htmlFor="Price">
                  Giá <span className="required">*</span>
                </label>
                <input
                  id="Price"
                  type="number"
                  className="form-input"
                  value={selectedItem.Price}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Price: e.target.value })
                  }
                />
                <label htmlFor="Amount">
                  Số lượng <span className="required">*</span>
                </label>
                <input
                  id="Amount"
                  type="number"
                  className="form-input"
                  value={selectedItem.Amount}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, Amount: e.target.value })
                  }
                />

                <div className="modal-buttons">
                  <button
                    onClick={() => handleUpdateEdition()}
                    className="save-button"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => setShowEditEditionForm(false)}
                    className="cancel-button"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nút Thêm */}
        <button
          className="add-button"
          onClick={() =>
            bookId.startsWith("CO") || bookId.startsWith("MA")
              ? setShowIssueForm(true)
              : setShowEditionForm(true)
          }
        >
          Thêm{" "}
          {bookId.startsWith("CO") || bookId.startsWith("MA")
            ? "Issue"
            : "Edition"}
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
