import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../asset/logo.png";
import { useAuth } from "../AuthContext";


const Login = () => {
  const { setUserId } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    const fakeUsers = [
      { id: 1, username: "admin", password: "123456", role: "admin" },
      { id: 2, username: "user", password: "password", role: "user" },
    ];

    const user = fakeUsers.find(
      (u) =>
        u.username === username && u.password === password && u.role === role
    );

    if (user) {
      setUserId(user.id);
      setError("");
      console.log("Đăng nhập với", { username, password, role });

      if (role === "admin") {
        navigate(`/admin/${user.id}`);
      } else {
        navigate(`/user/${user.id}`);
      }
    } else {
      setError("Tài khoản, mật khẩu hoặc vai trò không đúng.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="auth w-25 mx-auto p-5 text-center">
        <img src={logo} alt="Logo" className="w-25 rounded-circle mb-3" />
        <h1 className="auth-title text-center fs-1 mb-3">Đăng nhập</h1>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group position-relative has-icon-left mb-4">
            <input
              type="text"
              className="form-control form-control-xl"
              placeholder="Tài khoản"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="form-control-icon">
              <i className="bi bi-person"></i>
            </div>
          </div>
          <div className="form-group position-relative has-icon-left mb-4">
            <input
              type="password"
              className="form-control form-control-xl"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="form-control-icon">
              <i className="bi bi-shield-lock"></i>
            </div>
          </div>

          <div className="mb-1">
            <p className="fw-bold">Chọn vai trò:</p>
            <div className="d-flex justify-content-between">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label">Người dùng</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="form-check-label">Người quản trị</label>
            </div>
            </div>
          </div>

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary btn-block btn-lg shadow-lg mt-5"
              type="submit"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="text-center mt-5">
          <p className="text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <a href="auth-register.html" className="font-bold">
              Đăng ký ngay
            </a>
            .
          </p>
          <p>
            <a className="font-bold" href="auth-forgot-password.html">
              Quên mật khẩu?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
