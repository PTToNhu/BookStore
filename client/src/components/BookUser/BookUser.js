import React, { useState, useEffect } from "react";
import HeaderUser from "../HeaderUser/HeaderUser";
import bookcover from "../../asset/bookcover.png";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BookUser = () => {
  const likeFDB = false;
  const bookId = useParams().bookId;
  const decoded = jwtDecode(localStorage.getItem("token"));
  const customerId = decoded.CustomerID;
  const [numOfBooks, setNumOfBooks] = useState(1);
  const [liked, setLiked] = useState(likeFDB);
  const [showNotification, setShowNotification] = useState(false);

  const handleDecreased = () => {
    setNumOfBooks((prev) => Math.max(1, Number(prev) - 1));
  };

  const handleIncreased = () => {
    setNumOfBooks((prev) => Number(prev) + 1);
  };
  const handleInput = (e) => {
    setNumOfBooks(e.target.value);
  };
  const handleSetLiked = () => {
    setLiked(!liked);
  };

  const handleAddToCart = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/book/${bookId}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu sách!");
        }
        const data = await response.json();
        setBook(data);
        console.log(data)
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBook();
  }, [bookId]);
  return (
    <div style={{ backgroundColor: "#dddddd", height: "100vh" }}>
      <HeaderUser />
      {showNotification && (
        <div
          className="position-fixed top-0 end-0 translate-middle-x bg-light border border-success rounded p-2 shadow"
          style={{ width: "250px", zIndex: "9999" }}
        >
          <p className="text-success d-flex align-items-center m-0">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
            >
              <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
            </svg>
            Thêm vào giỏ hàng thành công!
          </p>
          <a
            href={`/user/${customerId}/cart`}
            className="text-decoration-none d-block text-center mt-2 btn btn-danger"
          >
            Xem giỏ hàng và thanh toán
          </a>
        </div>
      )}

      <div
        style={{
          fontSize: "20px",
          backgroundColor: "#fff",
          margin: "0 100px 10px 100px",
          borderRadius: "10px",
        }}
      >
        {book ? (
          <div className="card p-4 shadow">
            <h2 className="text-primary text-center mb-4">{book.Title}</h2>
            <div className="d-flex align-items-center">
              <div className="w-50">
                <img src={bookcover} alt="Book Cover" className="w-100"></img>
              </div>
              <div>
                <p>
                  <strong>Tác giả:</strong>{" "}
                  {book.Authors?.map(
                    (author) => author.LastName + " " + author.FirstName
                  ).join(", ") || "Không có thông tin tác giả"}
                </p>
                <p>
                  <strong>Giá:</strong> {book.LastPublished.Price}đ
                </p>
                <p>
                  <strong>Thể loại:</strong> {book.BookType}
                </p>
                <p>
                  <strong>Mô tả:</strong> {book.Description}
                </p>
                {book.LastPublished.Volume ? (
                  <p>
                    <strong>Tập:</strong> {book.LastPublished.Volume}
                  </p>
                ) : (
                  <div className="none"></div>
                )}
                <p>
                  <strong>Số trang:</strong> {book.LastPublished.Pages}
                </p>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <p className="m-0 fw-semibold">Thêm vào danh mục yêu thích</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-heart-fill"
                    viewBox="0 0 16 16"
                    style={{ color: liked ? "red" : "black" }}
                    onClick={handleSetLiked}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                    />
                  </svg>
                </div>
                <p className="fw-bold">Số Lượng</p>
                <div className="d-flex">
                  <button
                    className={`border border-secondary-subtle rounded hover-scale`}
                    style={{ marginRight: "8px" }}
                    disabled={numOfBooks <= 1}
                    onClick={handleDecreased}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-dash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    class="input"
                    value={numOfBooks}
                    className="border border-secondary-subtle rounded px-2"
                    style={{ marginRight: "8px" }}
                    onChange={handleInput}
                  ></input>
                  <button
                    className="border border-secondary-subtle rounded hover-scale"
                    style={{ marginRight: "8px" }}
                    onClick={handleIncreased}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                  </button>
                </div>
                <p className="fw-bold">Tạm tính</p>
                <p className="fw-bold">{book.LastPublished.Price*numOfBooks}đ</p>
                <button
                  className="btn btn-danger"
                  style={{ marginRight: "8px" }}
                >
                  Mua ngay
                </button>
                <button
                  className="btn btn-outline-primary"
                  style={{ marginRight: "8px" }}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-danger">Không tìm thấy sách!</p>
        )}
      </div>
    </div>
  );
};

export default BookUser;
