import React, { useState, useEffect, useRef } from "react";
import bookcover from "../../asset/book.png";
import "./HomeUser.css";
import HeaderUser from "../HeaderUser/HeaderUser";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const HomeUser = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showListAuthors, setShowListAuthors] = useState(false);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [genre, setGenre] = useState("");
  const [author, setAuthor] = useState();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [reload, setReload] = useState();
  const isFirstRender = useRef(true);
  const [noMoreBooksMessage, setNoMoreBooksMessage] = useState("");
  const [priceText, setPriceText] = useState("");
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let query = ``;
        query += `page=${page}`;
        if (author?.AuthorID) query += `&authorId=${author.AuthorID}`;
        if (genre) query += `&bookType=${genre}`;
        if (minPrice) query += `&minPrice=${minPrice}`;
        if (maxPrice) query += `&maxPrice=${maxPrice}`;
        console.log("query", query);
        const response = await fetch(
          `http://localhost:5000/api/book/get-all?${query}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu sách!");
        }
        const data = await response.json();
        if (data.message === "Không tìm thấy sách phù hợp.")
          setNoMoreBooksMessage(data.message);
        else {
          setBooks((prev) => [...prev, ...data.books]);
          console.log("books", data.books);
          console.log("hasMore", data.hasMore);
          setHasMore(data.hasMore);
          setLoading(false);
        }
      } catch (e) {
        setError(e.message);
      }
    };
    if (hasMore) {
      fetchBooks();
    } else {
      setNoMoreBooksMessage("Không còn sách để tải thêm.");
      setLoading(false);
    }
  }, [page, reload]);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setHasMore(true);
    setNoMoreBooksMessage("");
    setBooks([]);
    setPage(1);
    setReload(Date.now()); //trường hợp ở page 1 cần filter
    console.log("minPrice", minPrice);
    console.log("maxxPrice", maxPrice);
  }, [author, genre, minPrice, maxPrice]);

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
      } catch (e) {
        setError(e.message);
      }
    };
    fetchAuthors();
  }, []);

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
      } catch (e) {
        setError(e.message);
      }
    };
    fetchGenre();
  }, []);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      if (hasMore) setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  const handlePriceFilter = (label, min, max) => {
    if (priceText === label) {
      setMinPrice(0);
      setMaxPrice(0);
      setPriceText("");
    } else {
      setMinPrice(min);
      setMaxPrice(max);
      setPriceText(label);
    }
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
                {genre && !genres.slice(0, 3).includes(genre) && (
                  <button
                    className="border rounded hover-scale bg-primary text-white border-primary me-2"
                    key={genre}
                    onClick={() => {
                      setGenre("");
                    }}
                  >
                    {genre}
                  </button>
                )}

                {genres.slice(0, 3).map((g) => (
                  <button
                    key={g}
                    className={`border rounded hover-scale ${
                      g === genre
                        ? "bg-primary text-white border-primary order-0"
                        : "border-secondary-subtle order-1"
                    }`}
                    onClick={() => {
                      if (genre === g) setGenre("");
                      else setGenre(g);
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    {g}
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
                    className="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <div>Tác giả nổi bật</div>
              <div className="d-flex">
                {author && !authors.slice(0, 3).includes(author) && (
                  <button
                    className="border rounded hover-scale bg-primary text-white border-primary me-2"
                    key={author._id}
                    onClick={() => setAuthor("")}
                  >
                    {author.LastName + " " + author.FirstName}
                  </button>
                )}
                {authors.slice(0, 3).map((a) => (
                  <button
                    key={a._id}
                    className={`border rounded hover-scale ${
                      a === author
                        ? "bg-primary text-white border-primary order-0"
                        : "border-secondary-subtle order-1"
                    }`}
                    onClick={() => {
                      if (author === a) setAuthor("");
                      else setAuthor(a);
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    {a.LastName + " " + a.FirstName}
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
                    className="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
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
                  className="bi bi-funnel"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />{" "}
                </svg>
                {priceText ? <div>{priceText}</div> : <div>Giá</div>}
              </button>
            </div>
          </div>
        </div>

        {books.map((book) => (
          <a
            key={book._id}
            className="col-md-2 my-2 hover-scale text-decoration-none"
            href={`/customer/${customerId}/book/${book._id}`}
          >
            <div className="card p-3 shadow-sm">
              <img src={bookcover} alt="Book" className="card-img-top" />
              <div className="card-body p-0" style={{ height: "100px" }}>
                <p className="fw-bold text-danger mb-0">
                  {book.LastPublished.Price}đ
                </p>
                <p className="fw-semibold mb-0">
                  {book.Title}{" "}
                  {book.LastPublished?.Volumn &&
                    ` - Tập ${book.LastPublished.Volumn}
                `}
                </p>
                <div className="d-flex gap-1">
                  {(() => {
                    const rating = book.Rating || 0;
                    const fullStars = Math.floor(rating);
                    const hasHalfStar = rating - fullStars >= 0.01;

                    const stars = [];

                    for (let i = 0; i < fullStars; i++) {
                      stars.push(
                        <svg
                          key={`full-${book._id}-${i}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-fill text-warning"
                          viewBox="0 0 16 16"
                        >
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                      );
                    }

                    if (hasHalfStar) {
                      stars.push(
                        <svg
                          key={`half-${book._id}`}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-star-half text-warning"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
                        </svg>
                      );
                    }

                    return stars;
                  })()}
                </div>
              </div>
            </div>
          </a>
        ))}
        {noMoreBooksMessage && (
          <p className="text-danger text-center fw-semibold">
            {noMoreBooksMessage}
          </p>
        )}
        {loading && (
          <div className="text-center my-3">
            <div className="spinner-border text-secondary" role="status"></div>
          </div>
        )}
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
              <button
                className={`${
                  priceText === "Dưới 60.000"
                    ? "btn btn-primary text-white"
                    : "btn btn-outline-primary"
                }`}
                onClick={() => handlePriceFilter("Dưới 60.000", 0, 60000)}
                type="button"
              >
                Dưới 60.000
              </button>
              <button
                className={`${
                  priceText === "60.000 đến 140.000"
                    ? "btn btn-primary text-white d-flex align-items-center justify-content-center"
                    : "btn btn-outline-primary d-flex align-items-center justify-content-center"
                }`}
                onClick={() => {
                  handlePriceFilter("60.000 đến 140.000", 60000, 140000);
                }}
                type="button"
              >
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
              <button
                className={`${
                  priceText === "140.000 đến 280.000"
                    ? "btn btn-primary text-white d-flex align-items-center justify-content-center"
                    : "btn btn-outline-primary d-flex align-items-center justify-content-center"
                }`}
                onClick={() =>
                  handlePriceFilter("140.000 đến 280.000", 140000, 280000)
                }
                type="button"
              >
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
              <button
                className={`${
                  priceText === "Trên 280.000"
                    ? "btn btn-primary text-white"
                    : "btn btn-outline-primary"
                }`}
                onClick={() =>
                  handlePriceFilter("Trên 280.000", 280000, 10000000)
                }
                type="button"
              >
                Trên 280.000
              </button>
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
              {genres.map((g) => {
                return (
                  <button
                    className={`border rounded hover-scale ${
                      g === genre
                        ? "bg-primary text-white border-primary"
                        : "border-secondary-subtle"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (genre === g) setGenre("");
                      else setGenre(g);
                      console.log("genre2", genre);
                      handleClickListProducts();
                    }}
                    key={g}
                  >
                    {g}
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
              {authors.map((a) => {
                return (
                  <button
                    key={a._id}
                    className={`border rounded hover-scale ${
                      a === author
                        ? "bg-primary text-white border-primary order-0"
                        : "border-secondary-subtle order-1"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (author === a) setAuthor("");
                      else setAuthor(a);
                      handleClickListAuthors();
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    {a.LastName + " " + a.FirstName}
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
export default HomeUser;
