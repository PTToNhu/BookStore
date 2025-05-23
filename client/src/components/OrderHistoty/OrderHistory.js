import React, { useState, useEffect } from "react";
import HeaderUser from "../HeaderUser/HeaderUser";
import { jwtDecode } from "jwt-decode";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Vui lòng đăng nhập để xem lịch sử đơn hàng!");
        }
        const decoded = jwtDecode(token);
        const customerId = decoded.CustomerID;

        const response = await fetch(
          `http://localhost:5000/api/order/get-all/${customerId}`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu đơn hàng!");
        }
        const data = await response.json();
        console.log("API response:", data);

        // Sắp xếp đơn hàng theo Date giảm dần
        const sortedOrders = data.sort((a, b) => {
          return new Date(b.Date) - new Date(a.Date);
        });

        setOrders(sortedOrders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ backgroundColor: "#dddddd", minHeight: "100vh" }}>
      <HeaderUser />
      <h3 style={{ margin: "0 100px 10px 100px", paddingTop: "20px" }}>
        LỊCH SỬ MUA HÀNG
      </h3>
      {loading && (
        <p style={{ margin: "0 100px", textAlign: "center" }}>Đang tải...</p>
      )}
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
      {!loading && orders.length === 0 && !error && (
        <p style={{ margin: "0 100px", textAlign: "center" }}>
          Bạn chưa có đơn hàng nào.
        </p>
      )}
      {!loading &&
        orders.map((order) => (
          <div
            key={order.OrderID}
            style={{
              backgroundColor: "#fff",
              margin: "0 100px 10px 100px",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            <h5>Mã đơn hàng: {order.OrderID}</h5>
            <p>Ngày đặt: {new Date(order.Date).toLocaleString("vi-VN")}</p>
            <p>Địa chỉ giao hàng: {order.Address}</p>

            <p>
              <b>Trạng thái: {order.Status}</b>
            </p>
            <h6>Sản phẩm:</h6>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Tên sách
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Số lượng
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Đơn giá
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {item.Title || "Không xác định"}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {item.Quantity || 0}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {(item.Price || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {(
                          (item.Price || 0) * (item.Quantity || 0)
                        ).toLocaleString("vi-VN")}
                        đ
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Không có sản phẩm trong đơn hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              Tổng tiền:{" "}
              {order.items && order.items.length > 0
                ? order.items
                    .reduce(
                      (total, item) =>
                        total + (item.Price || 0) * (item.Quantity || 0),
                      0
                    )
                    .toLocaleString("vi-VN")
                : 0}
              đ
            </p>
          </div>
        ))}
    </div>
  );
};

export default OrderHistory;
