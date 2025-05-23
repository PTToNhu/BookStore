import React, { useState } from "react";
import "./OrderEditForm.css";

const OrderEditForm = ({ order, onClose, onUpdate, token }) => {
  const [status, setStatus] = useState(order.Status);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["Đã giao", "Đang vận chuyển", "Đã xác nhận", "Đã hủy"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/order/status/${order.OrderID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            OrderID: order.OrderID,
            Status: status,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi cập nhật trạng thái đơn hàng");
      }

      alert(data.message); // Thay toast bằng alert
      onUpdate();
      onClose();
    } catch (error) {
      alert(error.message); // Thay toast bằng alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-edit-form-overlay">
      <div className="order-edit-form">
        <h3>Chỉnh sửa đơn hàng {order.OrderID}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã đơn hàng:</label>
            <input type="text" value={order.OrderID} disabled />
          </div>
          <div className="form-group">
            <label>Tên khách hàng:</label>
            <input
              type="text"
              value={order.Customer?.Name || "Không xác định"}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ:</label>
            <input type="text" value={order.Address} />
          </div>
          <div className="form-group">
            <label>Ngày đặt hàng:</label>
            <input
              type="text"
              value={new Date(order.Date).toLocaleDateString()}
            />
          </div>
          <div className="form-group">
            <label>Phí vận chuyển:</label>
            <input type="text" value={order.ShipmentCost} disabled />
          </div>
          <div className="form-group">
            <label>Trạng thái:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Chọn trạng thái</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEditForm;
