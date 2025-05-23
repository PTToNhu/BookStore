import React, { useState, useEffect } from "react";
import bookcover from "../../asset/book.png";
import HeaderUser from "../HeaderUser/HeaderUser";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("text");
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (searchText) {
      setSearch(searchText);
    }
  }, [searchText]);
  console.log("search:", search);
  useEffect(() => {
    if (!search) return;
    const fetchBooks = async () => {
      try {
        const encodedText = encodeURIComponent(search);
        const response = await fetch(
          `http://localhost:5000/api/book/search?text=${encodedText}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu sách!");
        }
        const data = await response.json();
        setBooks(data);
        data.forEach((book) => fetchPrice(book.BookType, book.BookID));
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBooks();
  }, [search]);
  const fetchPrice = async (BookType, BookID) => {
    try {
      if (BookType === "Truyện tranh" || BookType === "Tạp chí") {
        const response = await fetch(
          `http://localhost:5000/api/get-all-issue/${BookID}`
        );
        if (!response.ok)
          throw new Error(`Không thể lấy giá cho sách ID ${BookID}`);

        const issue = await response.json();
        let lastIssue = issue?.at(-1) ?? null;

        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.BookID === BookID
              ? {
                  ...book,
                  Amount: lastIssue.Amount,
                  Price: lastIssue.Price,
                  Volumn: lastIssue.Volumn,
                }
              : book
          )
        );
      } else {
        const response = await fetch(
          `http://localhost:5000/api/get-all-edition/${BookID}`
        );
        if (!response.ok)
          throw new Error(`Không thể lấy giá cho sách ID ${BookID}`);
        const edition = await response.json();
        let lastEdition = edition?.at(-1) ?? null;
        console.log(lastEdition);

        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.BookID === BookID
              ? {
                  ...book,
                  Amount: lastEdition.Amount,
                  Price: lastEdition.Price,
                  Volumn: lastEdition.Volumn,
                }
              : book
          )
        );
      }
    } catch (error) {
      console.error(`Lỗi khi fetch giá cho sách ID ${BookID}:`, error);
    }
  };
  const [authors, setAuthors] = useState([]);
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/author/get-all"
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu tác giả!");
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAuthors();
  }, []);
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookgenre/get-all"
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu thể loại!");
        }
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchGenre();
  }, []);

  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showListAuthors, setShowListAuthors] = useState(false);
  // const [price, setPrice] = useState(0);
  // const [category, setCategogy] = useState("");
  // const [author, setAuthor] = useState("");
  const decoded = jwtDecode(localStorage.getItem("token"));
  const customerId = decoded.CustomerID;

  const navigate = useNavigate();

  if (!customerId) {
    navigate("/");
    return null;
  }

  const handleClickPriceForm = () => {
    setShowPriceForm(!showPriceForm);
  };
  const handleClickListProducts = () => {
    setShowCategory(!showCategory);
  };
  const handleClickListAuthors = () => {
    setShowListAuthors(!showListAuthors);
  };
  return (
    <div
      style={{ backgroundColor: "#dddddd", fontSize: "16px", height: "100%" }}
      className={`position-relative home-user-page ${
        showPriceForm ? "overlay" : ""
      }`}
    >
      <HeaderUser />
      <div
        className="row"
        style={{
          backgroundColor: "#fff",
          margin: "10px 100px",
          borderRadius: "10px",
        }}
      >
        <div className="fw-bold mt-2">Tất cả sản phẩm</div>
        <div>
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <div>Danh mục sản phẩm</div>
              <div className="d-flex">
                {genres.slice(0, 3).map((genre) => (
                  <button
                    key={genre}
                    className="border border-secondary-subtle rounded order-1 hover-scale"
                    style={{ marginRight: "8px" }}
                  >
                    {genre}
                  </button>
                ))}
                <button
                  className="border border-secondary-subtle rounded order-last hover-scale"
                  onClick={handleClickListProducts}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <div>Tác giả nổi bật</div>
              <div className="d-flex">
                {authors.slice(0, 3).map((author) => (
                  <button
                    key={author._id}
                    className="border border-secondary-subtle rounded order-1 hover-scale"
                    style={{ marginRight: "8px" }}
                  >
                    {author.LastName + " " + author.FirstName}
                  </button>
                ))}
                <button
                  className="border border-secondary-subtle rounded order-last hover-scale"
                  onClick={handleClickListAuthors}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <button
                className="border border-secondary-subtle rounded d-flex gap-2 align-items-end hover-scale"
                style={{ marginRight: "8px" }}
                onClick={handleClickPriceForm}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-funnel-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
                </svg>
                <div>Giá</div>
              </button>
            </div>
          </div>
        </div>
        {books.map((book) => (
          <a
            key={book.BookID}
            className="col-md-2 my-2 hover-scale text-decoration-none"
            href={`/customer/${customerId}/book/${book.BookID}`}
          >
            <div className="card p-3 shadow-sm">
              <img src={bookcover} alt="Book" className="card-img-top" />
              <div className="card-body p-0" style={{ height: "100px" }}>
                <p className="fw-bold text-danger mb-0">{book.Price}đ</p>
                <p className="fw-semibold mb-0">{book.Title}</p>
                <p className="fw-semibold mb-0">Tập {book.Volumn}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      {showPriceForm && (
        <div>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 999 }}
          ></div>
          <form
            className="position-fixed top-50 start-50 w-25 bg-light px-5 py-3 price-form shadow-lg rounded"
            style={{ transform: "translate(-50%, -50%)", zIndex: 1000 }}
          >
            <h4 className="text-center mb-3">Chọn mức giá</h4>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-primary">Dưới 60.000</button>
              <button className="btn btn-outline-primary d-flex align-items-center justify-content-center">
                <span>60.000</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                  />
                </svg>
                <span>140.000</span>
              </button>
              <button className="btn btn-outline-primary d-flex align-items-center justify-content-center">
                <span>140.000</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                  />
                </svg>
                <span>280.000</span>
              </button>
              <button className="btn btn-outline-primary">Trên 280.000</button>
            </div>

            <button
              className="btn btn-danger mt-3 w-100"
              onClick={handleClickPriceForm}
            >
              Đóng
            </button>
          </form>
        </div>
      )}
      {showCategory && (
        <div>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 999 }}
          ></div>
          <form
            className="position-fixed top-50 start-50 w-25 bg-light px-5 py-3 price-form shadow-lg rounded"
            style={{ transform: "translate(-50%, -50%)", zIndex: 1000 }}
          >
            <h4 className="text-center mb-3">Chọn danh mục sản phẩm</h4>
            <div className="d-flex flex-wrap gap-2">
              {genres.map((genre) => {
                return (
                  <button
                    className="btn btn-outline-primary w-auto"
                    key={genre}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
            <button
              className="btn btn-danger mt-3 w-100"
              onClick={handleClickListProducts}
            >
              Đóng
            </button>
          </form>
        </div>
      )}
      {showListAuthors && (
        <div>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, zIndex: 999 }}
          ></div>
          <form
            className="position-fixed top-50 start-50 w-25 bg-light px-5 py-3 price-form shadow-lg rounded"
            style={{ transform: "translate(-50%, -50%)", zIndex: 1000 }}
          >
            <h4 className="text-center mb-3">Chọn tác giả</h4>
            <div className="d-flex flex-wrap gap-2">
              {authors.map((author) => {
                return (
                  <button
                    className="btn btn-outline-primary w-auto"
                    key={author.AuthorID}
                  >
                    {author.LastName + " " + author.FirstName}
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-danger mt-3 w-100"
              onClick={handleClickListAuthors}
            >
              Đóng
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
