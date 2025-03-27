import React, { useState } from "react";
import HeaderUser from "../HeaderUser/HeaderUser";
// import { useParams } from "react-router-dom";
// import { useAuth } from "../AuthContext";
import bookcover from "../../asset/bookcover.png";

const CartUser = () => {
  const [isChecked, setIsChecked] = useState(false);
  const initialBooks = [
    {
      ID: "1",
      Description:
        "Khám phá những xu hướng công nghệ mới nhất và các sản phẩm điện thoại di động đột phá trên thị trường.",
      Title: "Tạp Chí Thế Giới Di Động",
      BookType: "Tạp chí",
      Price: "99000",
    },
    {
      ID: "2",
      Description:
        "Dành cho những ai yêu thích nghệ thuật và thiết kế, tạp chí này mang đến cảm hứng sáng tạo và ý tưởng mới mẻ.",
      Title: "Tạp Chí Sáng Tạo",
      BookType: "Tạp chí",
      Price: "99000",
    },
    {
      ID: "3",
      Description:
        "Chia sẻ những điểm đến hấp dẫn cùng kinh nghiệm du lịch từ khắp nơi trên thế giới.",
      Title: "Tạp Chí Du Lịch",
      BookType: "Tạp chí",
      Price: "99000",
    },
    {
      ID: "4",
      Description:
        "Câu chuyện về một chú mèo robot từ tương lai giúp đỡ Nobita trong cuộc sống hàng ngày.",
      Title: "Doraemon",
      BookType: "Truyện tranh",
      Price: "99000",
    },
    {
      ID: "5",
      Description:
        "Hành trình trở thành Ninja vĩ đại của Naruto Uzumaki, một cậu bé mơ ước được công nhận.",
      Title: "Naruto",
      BookType: "Truyện tranh",
      Price: "99000",
    },
    {
      ID: "6",
      Description:
        "Khám phá các hiện tượng kỳ diệu của vũ trụ và cách mà con người nghiên cứu chúng.",
      Title: "Vũ Trụ và Thiên Văn Học",
      BookType: "Sách tham khảo",
      Price: "99000",
    },
    {
      ID: "7",
      Description:
        "Tìm hiểu về cấu trúc của trái đất và các yếu tố ảnh hưởng đến địa lý.",
      Title: "Địa Lý và Địa Chất",
      BookType: "Sách tham khảo",
      Price: "99000",
    },
    {
      ID: "8",
      Description: "Nghiên cứu về sự sống và các phương pháp điều trị bệnh.",
      Title: "Sinh Học và Y Học",
      BookType: "Sách tham khảo",
      Price: "99000",
    },
    {
      ID: "9",
      Description:
        "Khám phá các giai đoạn lịch sử và sự phát triển văn hóa của nhân loại.",
      Title: "Lịch Sử và Văn Hóa",
      BookType: "Sách tham khảo",
      Price: "99000",
    },
  ];
  const [books, setBooks] = useState(
    initialBooks.map((book) => ({
      ...book,
      isChecked: false,
      numOfBooks: 1,
    }))
  );
  const handleCheckboxChange = (bookID) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.ID === bookID ? { ...book, isChecked: !book.isChecked } : book
      )
    );
  };

  const handleDecreased = (bookID) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.ID === bookID
          ? { ...book, numOfBooks: Math.max(1, book.numOfBooks - 1) }
          : book
      )
    );
  };

  const handleIncreased = (bookID) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.ID === bookID ? { ...book, numOfBooks: book.numOfBooks + 1 } : book
      )
    );
  };

  const handleInput = (e, bookID) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.ID === bookID
            ? {
                ...book,
                numOfBooks: value === "" ? "" : Math.max(1, Number(value)),
              }
            : book
        )
      );
    }
  };

  return (
    <div style={{ backgroundColor: "#dddddd", height: "100vh" }}>
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
        <div class="form-check" className="col-5">
          <div class="checkbox">
            <input
              type="checkbox"
              id="checkbox1"
              class="form-check-input"
              checked={isChecked}
              onChange={() => {
                setIsChecked(!isChecked);
                books.forEach((book) => handleCheckboxChange(book.ID));
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
          class="bi bi-trash"
          viewBox="0 0 16 16"
          className="col-1"
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
        {books.map((book) => (
          <div className="row p-2 align-items-center">
            <div class="form-check" className="col-5 d-flex align-items-center">
              <div class="checkbox">
                <input
                  type="checkbox"
                  id={`checkbox-${book.ID}`}
                  class="form-check-input"
                  checked={book.isChecked}
                  onChange={() => handleCheckboxChange(book.ID)}
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
                <label htmlFor={`checkbox-${book.ID}`} className="m-0">
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
                onClick={() => handleDecreased(book.ID)}
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
                value={book.numOfBooks}
                className="border border-secondary-subtle rounded px-2 text-center"
                style={{ marginRight: "8px", width: "50px", minWidth: "40px" }}
                onChange={() => handleInput(book.ID)}
              />
              <button
                className="border border-secondary-subtle rounded hover-scale"
                style={{ marginRight: "8px" }}
                onClick={() => handleIncreased(book.ID)}
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
            <p className="m-0 col-2">
              {parseFloat(book.Price) * book.numOfBooks}đ
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
              className="col-1"
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
