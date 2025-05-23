import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../asset/logo.png";
import "./HeaderStaff.css";

const HeaderStaff = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : {};
  const staffId = decodedToken?.StaffID;

  // Handle logout
  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Navigate to profile
  const handleProfileClick = async () => {
    navigate(`/${staffId}/profile`);
  };

  if (!staffId) {
    return <p>Vui lòng đăng nhập</p>;
  }

  return (
    <div className="header-staff">
      <div className="header-container">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo-img" />

        {/* Navigation */}
        <ul className="nav-tabs">
          {/* <li
            className="nav-item"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </li> */}
          <li
            className="nav-item"
            onClick={() => navigate("/management-book")}
            style={{ cursor: "pointer" }}
          >
            Quản lý sách
          </li>
          <li
            className="nav-item"
            onClick={() => navigate(`/management-order/${staffId}`)}
            style={{ cursor: "pointer" }}
          >
            Quản lý đơn hàng
          </li>
        </ul>

        {/* Staff Account */}
        <div className="account-section">
          <div className="account" onClick={handleProfileClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
          </div>
          <p className="logout-text" onClick={handleLogout}>
            Đăng xuất
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderStaff;
