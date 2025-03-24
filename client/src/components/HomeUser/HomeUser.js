import React, { useState } from "react";
import bookcover from "../../asset/book.png";
import "./HomeUser.css";
import HeaderUser from "../HeaderUser/HeaderUser";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const HomeUser = () => {
  const books = [
    {
      ID: "1",
      Description:
        "Khám phá những xu hướng công nghệ mới nhất và các sản phẩm điện thoại di động đột phá trên thị trường.",
      Title: "Tạp Chí Thế Giới Di Động",
      BookType: "Tạp chí",
      Price: "99.000đ",
    },
    {
      ID: "2",
      Description:
        "Dành cho những ai yêu thích nghệ thuật và thiết kế, tạp chí này mang đến cảm hứng sáng tạo và ý tưởng mới mẻ.",
      Title: "Tạp Chí Sáng Tạo",
      BookType: "Tạp chí",
      Price: "99.000đ",
    },
    {
      ID: "3",
      Description:
        "Chia sẻ những điểm đến hấp dẫn cùng kinh nghiệm du lịch từ khắp nơi trên thế giới.",
      Title: "Tạp Chí Du Lịch",
      BookType: "Tạp chí",
      Price: "99.000đ",
    },
    {
      ID: "4",
      Description:
        "Câu chuyện về một chú mèo robot từ tương lai giúp đỡ Nobita trong cuộc sống hàng ngày.",
      Title: "Doraemon",
      BookType: "Truyện tranh",
      Price: "99.000đ",
    },
    {
      ID: "5",
      Description:
        "Hành trình trở thành Ninja vĩ đại của Naruto Uzumaki, một cậu bé mơ ước được công nhận.",
      Title: "Naruto",
      BookType: "Truyện tranh",
      Price: "99.000đ",
    },
    {
      ID: "6",
      Description:
        "Khám phá các hiện tượng kỳ diệu của vũ trụ và cách mà con người nghiên cứu chúng.",
      Title: "Vũ Trụ và Thiên Văn Học",
      BookType: "Sách tham khảo",
      Price: "99.000đ",
    },
    {
      ID: "7",
      Description:
        "Tìm hiểu về cấu trúc của trái đất và các yếu tố ảnh hưởng đến địa lý.",
      Title: "Địa Lý và Địa Chất",
      BookType: "Sách tham khảo",
      Price: "99.000đ",
    },
    {
      ID: "8",
      Description: "Nghiên cứu về sự sống và các phương pháp điều trị bệnh.",
      Title: "Sinh Học và Y Học",
      BookType: "Sách tham khảo",
      Price: "99.000đ",
    },
    {
      ID: "9",
      Description:
        "Khám phá các giai đoạn lịch sử và sự phát triển văn hóa của nhân loại.",
      Title: "Lịch Sử và Văn Hóa",
      BookType: "Sách tham khảo",
      Price: "99.000đ",
    },
  ];
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showListAuthors, setShowListAuthors] = useState(false);
  const [price, setPrice] = useState(0);
  const [category, setCategogy] = useState("");
  const [author, setAuthor] = useState("");
  const { userId } = useAuth();
  console.log(userId);

  const navigate = useNavigate();

  if (!userId) {
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
                <button
                  className="border border-secondary-subtle rounded order-1 hover-scale"
                  style={{ marginRight: "8px" }}
                >
                  <div>Truyện tranh</div>
                </button>
                <button
                  className="border border-secondary-subtle rounded order-2 hover-scale"
                  style={{ marginRight: "8px" }}
                >
                  <div>Tạp chí</div>
                </button>
                <button
                  className="border border-secondary-subtle rounded order-3 hover-scale"
                  style={{ marginRight: "8px" }}
                >
                  <div>Sách tham khảo</div>
                </button>
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
                <button
                  className="border border-secondary-subtle rounded order-1 hover-scale"
                  style={{ marginRight: "8px" }}
                >
                  <div>Thạch Lam</div>
                </button>
                <button
                  className="border border-secondary-subtle rounded order-2 hover-scale"
                  style={{ marginRight: "8px" }}
                >
                  <div>Nguyễn Ngọc Tư</div>
                </button>
                <button
                  className="border border-secondary-subtle rounded order-3 hover-scale"
                  style={{ marginRight: "8px" }}
                >
                  <div>Nguyễn Nhật Ánh</div>
                </button>
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
            key={book.ID}
            className="col-md-2 my-2 hover-scale text-decoration-none"
            href={`/user/${userId}/book/${book.ID}`}
          >
            <div className="card text-center p-2 shadow-sm">
              <img src={bookcover} alt="Book" className="card-img-top" />
              <div className="card-body p-0">
                <p className="fw-bold text-danger mb-0">{book.Price}</p>
                <p className="fw-semibold mb-0" style={{ height: "100px" }}>
                  {book.Title}
                </p>
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
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-primary">Truyện tranh</button>
              <button className="btn btn-outline-primary">Tạp chí</button>
              <button className="btn btn-outline-primary">
                Sách tham khảo
              </button>
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
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-primary">Thạch Lam</button>
              <button className="btn btn-outline-primary">
                Nguyễn Ngọc Tư
              </button>
              <button className="btn btn-outline-primary">
                Nguyễn Nhật Ánh
              </button>
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
