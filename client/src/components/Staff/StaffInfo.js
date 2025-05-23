import React, { useEffect, useState } from "react";
import HeaderStaff from "./HeaderStaff"; // Sử dụng Header đã tạo
import "./StaffProfile.css";
import { jwtDecode } from "jwt-decode";

const StaffProfile = () => {
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const staffId = decodedToken.StaffID;
        const response = await fetch(
          `http://localhost:5000/staff/get-info/${staffId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token lên API
            },
          }
        );
        if (!response.ok) throw new Error("Không thể lấy thông tin nhân viên.");
        const data = await response.json();
        setStaffInfo(data); // Lưu thông tin vào state
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStaffInfo();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Có lỗi xảy ra: {error}</p>;

  return (
    <div className="staff-info-container">
      {/* Header Staff */}
      <HeaderStaff />

      {/* Thông tin Staff */}
      <div className="staff-profile-container">
        <h2>Thông tin nhân viên</h2>
        <p>
          <strong>Mã nhân viên:</strong> {staffInfo.StaffID}
        </p>
        <p>
          <strong>Họ và tên:</strong> {staffInfo.Name}
        </p>
        <p>
          <strong>Lương:</strong> {staffInfo.Salary} VND
        </p>
        <p>
          <strong>Ngày tuyển dụng:</strong>{" "}
          {new Date(staffInfo.HireDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Quản lý:</strong> {staffInfo.ManagerName || "Không có"}
        </p>
      </div>
    </div>
  );
};

export default StaffProfile;
