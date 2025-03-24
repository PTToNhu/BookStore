import React from "react";
import logo from "../../asset/logo.png";
import { useAuth } from "../AuthContext";
const HeaderUser = () => {
  const { userId } = useAuth();
  if (!userId) {
    return <p>Vui lòng đăng nhập</p>;
  }
  return (
    <div
      style={{
        backgroundColor: "#fff",
        margin: "0 100px 10px 100px",
        borderRadius: "10px",
      }}
    >
      <div class="d-flex justify-content-between align-items-center w-75 mx-auto">
        <img
          src={logo}
          alt="Logo"
          class="logo-img rounded-circle"
          style={{ width: "100px", height: "100px" }}
        ></img>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item hover-scale" role="presentation">
            <a
              class="nav-link active"
              id="home-tab"
              data-bs-toggle="tab"
              href="#home"
              role="tab"
              aria-controls="home"
              aria-selected="true"
            >
              Home
            </a>
          </li>
          <li class="nav-item hover-scale" role="presentation">
            <a
              class="nav-link"
              id="profile-tab"
              data-bs-toggle="tab"
              href="#profile"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              tabindex="-1"
            >
              Profile
            </a>
          </li>
          <li class="nav-item hover-scale" role="presentation">
            <a
              class="nav-link"
              id="contact-tab"
              data-bs-toggle="tab"
              href="#contact"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
              tabindex="-1"
            >
              Contact
            </a>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <input
            type="text"
            class="searchbar-input"
            maxlength="128"
            placeholder="Tìm kiếm"
          ></input>
          <button type="button" class="btn btn-solid-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        </div>
        <a className="hover-scale" href={userId ? `/user/${userId}/cart` : "#"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-bag-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
export default HeaderUser;
