import React, { useState, useEffect } from "react";
import HeaderUser from "../HeaderUser/HeaderUser";
import bookcover from "../../asset/bookcover.png";
import { jwtDecode } from "jwt-decode";

const CartUser = () => {
  const [isChecked, setIsChecked] = useState(false);
  const decoded = jwtDecode(localStorage.getItem("token"));
  const customerId = decoded.CustomerID;
  const [books, setBooks] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${customerId}`
        );
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
        const respone = await fetch("http://localhost:5000/api/cart/add", {
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
        const message = await respone.json();
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
      console.log("currentNumOfBooks", currentNumOfBooks);

      setBooks((prevBooks) => ({
        ...prevBooks,
        [bookID]: {
          ...prevBooks[bookID],
          numOfBooks: currentNumOfBooks,
        },
      }));
      try {
        const respone = await fetch("http://localhost:5000/api/cart/add", {
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
        const message = await respone.json();
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
      const respone = await fetch("http://localhost:5000/api/cart/add", {
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
      const message = await respone.json();
      console.log("message:", message);
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng trong giỏ hàng:", error);
    }
  };
  const handleDelete = async (BookID) => {
    try {
      const respone = await fetch("http://localhost:5000/api/cart/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          bookId: BookID,
        }),
      });
      const message = await respone.json();
      console.log(message);
      setBooks((prevBooks) => {
        const newBooks = { ...prevBooks };
        delete newBooks[BookID];
        return newBooks;
      });
    } catch (e) {
      console.log("Lỗi khi xóa sách ra khỏi giỏ hàng:", e);
    }
  };

  return (
    <div style={{ backgroundColor: "#dddddd", height: "100%" }}>
      <HeaderUser />
      <h3 style={{ margin: "0 100px 10px 100px" }}>GIỎ HÀNG</h3>
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
              // BookID="checkbox1"
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
          // onClick={()=>handleDelete()}
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
                  BookID={`checkbox-${BookID}`}
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
            <p className="m-0 col-2">{book.Price}đ</p>
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
              {parseFloat(book.Price) * book.numOfBooks}đ
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
    </div>
  );
};

export default CartUser;
