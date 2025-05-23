import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderUser from "../HeaderUser/HeaderUser";
import bookcover from "../../asset/bookcover.png";
import { jwtDecode } from "jwt-decode";

const CartUser = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [books, setBooks] = useState({});
  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState("");
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Vui lòng đăng nhập để xem giỏ hàng!");
        }
        const decoded = jwtDecode(token);
        const id = decoded.CustomerID;
        setCustomerId(id);

        const response = await fetch(`http://localhost:5000/api/cart/${id}`);
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu sách!");
        }
        const data = await response.json();
        const newdata = data.reduce((acc, book) => {
          acc[book.BookID] = {
            isChecked: false,
            Price: book.Price,
            Title: book.Title,
            numOfBooks: book.numOfBooks,
            BookID: book.BookID,
          };
          return acc;
        }, {});
        setBooks(newdata);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    console.log(books);
  }, [books]);

  const handleCheckboxChange = (bookID) => {
    setBooks((prevBooks) => ({
      ...prevBooks,
      [bookID]: {
        ...prevBooks[bookID],
        isChecked: !prevBooks[bookID].isChecked,
      },
    }));
  };

  const handleDecreased = async (bookID) => {
    let currentNumOfBooks = books[bookID]?.numOfBooks;
    if (currentNumOfBooks) {
      currentNumOfBooks = Math.max(1, currentNumOfBooks - 1);

      setBooks((prevBooks) => ({
        ...prevBooks,
        [bookID]: {
          ...prevBooks[bookID],
          numOfBooks: currentNumOfBooks,
        },
      }));
      try {
        const response = await fetch("http://localhost:5000/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerId,
            bookId: bookID,
            numOfBooks: -1,
          }),
        });
        const message = await response.json();
        console.log("message:", message);
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng trong giỏ hàng:", error);
      }
    } else {
      console.log("Không tìm thấy sách tương ứng trong giỏ hàng");
    }
  };

  const handleIncreased = async (bookID) => {
    let currentNumOfBooks = books[bookID]?.numOfBooks;
    if (currentNumOfBooks) {
      currentNumOfBooks = currentNumOfBooks + 1;

      setBooks((prevBooks) => ({
        ...prevBooks,
        [bookID]: {
          ...prevBooks[bookID],
          numOfBooks: currentNumOfBooks,
        },
      }));
      try {
        const response = await fetch("http://localhost:5000/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customerId,
            bookId: bookID,
            numOfBooks: 1,
          }),
        });
        const message = await response.json();
        console.log("message:", message);
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng trong giỏ hàng:", error);
      }
    } else {
      console.log("Không tìm thấy sách tương ứng trong giỏ hàng");
    }
  };

  const handleInput = async (e, bookID) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const prevNumOfBooks = books[bookID]?.numOfBooks || 0;
    setBooks((prevBooks) => ({
      ...prevBooks,
      [bookID]: {
        ...prevBooks[bookID],
        numOfBooks: value === "" ? "" : Math.max(1, Number(value)),
      },
    }));
    if (value === "") return;
    if (Number(value) - prevNumOfBooks === 0) return;
    try {
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          bookId: bookID,
          numOfBooks: Number(value) - prevNumOfBooks,
        }),
      });
      const message = await response.json();
      console.log("message:", message);
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng trong giỏ hàng:", error);
    }
  };

  const handleDelete = async (bookID) => {
    try {
      const response = await fetch("http://localhost:5000/api/cart/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          bookId: bookID,
        }),
      });
      const message = await response.json();
      console.log(message);
      setBooks((prevBooks) => {
        const newBooks = { ...prevBooks };
        delete newBooks[bookID];
        return newBooks;
      });
    } catch (e) {
      console.log("Lỗi khi xóa sách ra khỏi giỏ hàng:", e);
    }
  };

  const handleConfirmPurchase = () => {
    const selectedBooks = Object.entries(books)
      .filter(([_, book]) => book.isChecked)
      .map(([bookID, book]) => ({
        BookID: bookID,
        numOfBooks: book.numOfBooks,
      }));

    if (selectedBooks.length === 0) {
      setError("Vui lòng chọn ít nhất một sách để mua!");
      return;
    }

    setShowAddressModal(true);
    setError("");
  };

  const handleSubmitAddress = async () => {
    if (!address.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    const selectedBooks = Object.entries(books)
      .filter(([_, book]) => book.isChecked)
      .map(([bookID, book]) => ({
        BookID: bookID,
        numOfBooks: book.numOfBooks,
      }));

    try {
      const response = await fetch("http://localhost:5000/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          books: selectedBooks,
          address: address.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo đơn hàng!");
      }

      const result = await response.json();
      console.log("Đơn hàng đã được tạo:", result);

      setBooks((prevBooks) => {
        const newBooks = { ...prevBooks };
        selectedBooks.forEach((book) => {
          delete newBooks[book.BookID];
        });
        return newBooks;
      });

      setShowAddressModal(false);
      setAddress("");
      setError("");
      alert("Đơn hàng đã được tạo thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      setError("Lỗi khi tạo đơn hàng: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
    setAddress("");
    setError("");
  };

  return (
    <div style={{ backgroundColor: "#dddddd", height: "100%" }}>
      <HeaderUser />
      <div
        style={{
          margin: "0 100px 10px 100px",
          display: "flex",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <h3 style={{ margin: "0", marginRight: "20px" }}>GIỎ HÀNG</h3>
        {customerId ? (
          <Link
            to={`/customer/order-history/${customerId}`}
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              color: "#007bff",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            ĐƠN ĐÃ ĐẶT
          </Link>
        ) : (
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
              color: "#ccc",
              cursor: "not-allowed",
            }}
          >
            ĐƠN ĐÃ ĐẶT
          </span>
        )}
      </div>
      {error && (
        <div
          style={{
            margin: "0 100px 10px 100px",
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          backgroundColor: "#fff",
          margin: "0 100px 10px 100px",
          borderRadius: "10px",
        }}
        className="row p-2"
      >
        <div className="form-check col-5">
          <div className="checkbox">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
                setBooks((prevBooks) => {
                  const updatedBooks = {};
                  for (const key in prevBooks) {
                    updatedBooks[key] = {
                      ...prevBooks[key],
                      isChecked: !isChecked,
                    };
                  }
                  return updatedBooks;
                });
              }}
            ></input>
            <label htmlFor="checkbox1">Tất cả sản phẩm</label>
          </div>
        </div>
        <p className="m-0 col-2">Đơn giá</p>
        <p className="m-0 col-2">Số lượng</p>
        <p className="m-0 col-2">Thành tiền</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-trash col-1"
          viewBox="0 0 16 16"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          margin: "0 100px 10px 100px",
          borderRadius: "10px",
        }}
        className="p-2"
      >
        {Object.entries(books).map(([BookID, book]) => (
          <div key={BookID} className="row p-2 align-items-center">
            <div className="form-check col-5 d-flex align-items-center">
              <div className="checkbox d-flex align-items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${BookID}`}
                  className="form-check-input"
                  checked={book.isChecked}
                  onChange={() => handleCheckboxChange(BookID)}
                ></input>
                <img
                  src={bookcover}
                  alt="Bìa sách"
                  className="rounded"
                  style={{
                    width: "150px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                ></img>
                <label htmlFor={`checkbox-${BookID}`} className="m-0">
                  {book.Title}
                </label>
              </div>
            </div>
            <p className="m-0 col-2">
              {(book.Price || 0).toLocaleString("vi-VN")}đ
            </p>
            <div className="col-2 d-flex align-items-center">
              <button
                className={`border border-secondary-subtle rounded hover-scale`}
                style={{ marginRight: "8px" }}
                disabled={book.numOfBooks <= 1}
                onClick={() => handleDecreased(BookID)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-dash"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                </svg>
              </button>
              <input
                type="text"
                value={book.numOfBooks}
                className="border border-secondary-subtle rounded px-2 text-center"
                style={{ marginRight: "8px", width: "50px", minWidth: "40px" }}
                onChange={(e) => handleInput(e, BookID)}
              />
              <button
                className="border border-secondary-subtle rounded hover-scale"
                style={{ marginRight: "8px" }}
                onClick={() => handleIncreased(BookID)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
              </button>
            </div>
            <p className="m-0 col-2">
              {((book.Price || 0) * (book.numOfBooks || 0)).toLocaleString(
                "vi-VN"
              )}
              đ
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-trash col-1"
              viewBox="0 0 16 16"
              onClick={() => handleDelete(BookID)}
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 100px 20px 100px", textAlign: "right" }}>
        <p>
          Tổng tiền:{" "}
          {Object.values(books)
            .filter((book) => book.isChecked)
            .reduce(
              (total, book) =>
                total + (book.Price || 0) * (book.numOfBooks || 0),
              0
            )
            .toLocaleString("vi-VN")}
          đ
        </p>
        <button
          className="btn btn-primary"
          onClick={handleConfirmPurchase}
          disabled={Object.values(books).every((book) => !book.isChecked)}
        >
          Xác nhận mua
        </button>
      </div>

      {showAddressModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxWidth: "90%",
            }}
          >
            <h4>Nhập địa chỉ giao hàng</h4>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ giao hàng"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            {error && (
              <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
            )}
            <div style={{ textAlign: "right" }}>
              <button
                className="btn btn-secondary"
                style={{ marginRight: "10px" }}
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAddress}
                disabled={!address.trim()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartUser;
