import React, { useState, useEffect, useCallback } from "react";
import HeaderStaff from "../Staff/HeaderStaff";
import OrderEditForm from "./OrderEditForm";
import "../ManageOrder/ManagementOrder.css";
import { jwtDecode } from "jwt-decode";

const OrderManagement = () => {
  const [managedOrders, setManagedOrders] = useState([]);
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("managed");
  const [searchTerm, setSearchTerm] = useState("");
  const [managedCurrentPage, setManagedCurrentPage] = useState(1);
  const [unassignedCurrentPage, setUnassignedCurrentPage] = useState(1);
  const [managedTotalPages, setManagedTotalPages] = useState(1);
  const [unassignedTotalPages, setUnassignedTotalPages] = useState(1);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch managed orders
  const fetchManagedOrders = useCallback(async (search = "", page = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không có token, vui lòng đăng nhập lại.");
      }
      const decodedToken = jwtDecode(token);
      const staffId = decodedToken.StaffID;
      console.log("Fetching managed orders with:", { staffId, search, page });

      const response = await fetch(
        `http://localhost:5000/api/order/get-all/staff/${staffId}?page=${page}&limit=20&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Lỗi ${response.status}: Không thể lấy đơn hàng`
        );
      }

      const data = await response.json();
      console.log("Managed orders response:", data);
      setManagedOrders(
        data.orders.filter((order) => order.StaffID && order.StaffID !== "") ||
          []
      );
      setManagedTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error("Fetch managed orders error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Fetch unassigned orders
  const fetchUnassignedOrders = useCallback(async (search = "", page = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không có token, vui lòng đăng nhập lại.");
      }
      console.log("Fetching unassigned orders with:", { search, page });

      const response = await fetch(
        `http://localhost:5000/api/order/unassigned?page=${page}&limit=20&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Lỗi ${response.status}: Không thể lấy đơn hàng chưa xử lý`
        );
      }

      const data = await response.json();
      console.log("Unassigned orders response:", data);
      setUnassignedOrders(data.orders || []);
      setUnassignedTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error("Fetch unassigned orders error:", err.message);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Handle claim order (Nhận đơn)
  const handleClaimOrder = async (order) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không có token, vui lòng đăng nhập lại.");
      }

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
            Status: "Đã xác nhận",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi nhận đơn hàng");
      }

      alert(data.message); // Thay toast bằng alert
      fetchManagedOrders(searchTerm, managedCurrentPage);
      fetchUnassignedOrders(searchTerm, unassignedCurrentPage);
    } catch (error) {
      alert(error.message); // Thay toast bằng alert
    }
  };

  // Handle edit order
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditForm(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedOrder(null);
  };

  // Handle update
  const handleUpdate = () => {
    fetchManagedOrders(searchTerm, managedCurrentPage);
    fetchUnassignedOrders(searchTerm, unassignedCurrentPage);
  };

  useEffect(() => {
    if (activeTab === "managed") {
      fetchManagedOrders(searchTerm, managedCurrentPage);
    } else {
      fetchUnassignedOrders(searchTerm, unassignedCurrentPage);
    }
  }, [
    fetchManagedOrders,
    fetchUnassignedOrders,
    activeTab,
    managedCurrentPage,
    unassignedCurrentPage,
    searchTerm,
  ]);

  const handleSearch = () => {
    setLoading(true);
    if (activeTab === "managed") {
      fetchManagedOrders(searchTerm, 1);
      setManagedCurrentPage(1);
    } else {
      fetchUnassignedOrders(searchTerm, 1);
      setUnassignedCurrentPage(1);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setManagedCurrentPage(1);
    setUnassignedCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (activeTab === "managed" && page >= 1 && page <= managedTotalPages) {
      setManagedCurrentPage(page);
    } else if (
      activeTab === "unassigned" &&
      page >= 1 &&
      page <= unassignedTotalPages
    ) {
      setUnassignedCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const totalPages =
      activeTab === "managed" ? managedTotalPages : unassignedTotalPages;
    const currentPage =
      activeTab === "managed" ? managedCurrentPage : unassignedCurrentPage;
    const pages = [];

    pages.push(
      <button
        key="prev"
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trang trước
      </button>
    );

    pages.push(
      <button
        key="1"
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(<span key="ellipsis-start">...</span>);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(<span key="ellipsis-end">...</span>);
    }

    pages.push(
      <button
        key={totalPages}
        className={`pagination-button ${
          currentPage === totalPages ? "active" : ""
        }`}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </button>
    );

    pages.push(
      <button
        key="next"
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Trang sau
      </button>
    );

    return pages;
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Có lỗi xảy ra: {error}</p>;

  return (
    <div className="order-management-container">
      <HeaderStaff></HeaderStaff>
      <header className="header">
        <h1>Quản lý đơn hàng</h1>
        <div className="search-and-add-container">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo mã đơn, địa chỉ, trạng thái, hoặc tên khách hàng..."
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button className="search-button" onClick={handleSearch}>
            Tìm kiếm
          </button>
        </div>
      </header>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "managed" ? "active" : ""}`}
          onClick={() => setActiveTab("managed")}
        >
          Đang quản lý ({managedOrders.length})
        </button>
        <button
          className={`tab-button ${activeTab === "unassigned" ? "active" : ""}`}
          onClick={() => setActiveTab("unassigned")}
        >
          Chưa xử lý ({unassignedOrders.length})
        </button>
      </div>

      <div className="table-container">
        {activeTab === "managed" ? (
          <div className="order-table">
            <h4>Danh sách đơn hàng đang quản lý</h4>
            {managedOrders.length === 0 ? (
              <p>Không có đơn hàng nào đang quản lý.</p>
            ) : (
              <table className="list-order">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên khách hàng</th>
                    <th>Địa chỉ</th>
                    <th>Ngày đặt hàng</th>
                    <th>Trạng thái</th>
                    <th>Chỉnh sửa</th>
                  </tr>
                </thead>
                <tbody>
                  {managedOrders.map((order, index) => (
                    <tr key={order.OrderID}>
                      <td>{(managedCurrentPage - 1) * 20 + index + 1}</td>
                      <td>{order.OrderID}</td>
                      <td>{order.Customer?.Name || "Không xác định"}</td>
                      <td>{order.Address}</td>
                      <td>{new Date(order.Date).toLocaleDateString()}</td>
                      <td>{order.Status}</td>
                      <td>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="edit-button"
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="order-table">
            <h4>Danh sách đơn hàng chưa xử lý</h4>
            {unassignedOrders.length === 0 ? (
              <p>Không có đơn hàng nào chưa xử lý.</p>
            ) : (
              <table className="list-order">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên khách hàng</th>
                    <th>Địa chỉ</th>
                    <th>Ngày đặt hàng</th>
                    <th>Trạng thái</th>
                    <th>Chỉnh sửa</th>
                  </tr>
                </thead>
                <tbody>
                  {unassignedOrders.map((order, index) => (
                    <tr key={order.OrderID}>
                      <td>{(unassignedCurrentPage - 1) * 20 + index + 1}</td>
                      <td>{order.OrderID}</td>
                      <td>{order.Customer?.Name || "Không xác định"}</td>
                      <td>{order.Address}</td>
                      <td>{new Date(order.Date).toLocaleDateString()}</td>
                      <td>{order.Status}</td>
                      <td>
                        <button
                          onClick={() => handleClaimOrder(order)}
                          className="edit-button"
                          disabled={order.StaffID}
                        >
                          Xác nhận
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showEditForm && selectedOrder && (
        <OrderEditForm
          order={selectedOrder}
          onClose={handleCloseForm}
          onUpdate={handleUpdate}
          token={localStorage.getItem("token")}
        />
      )}

      <div className="pagination-container">{renderPageNumbers()}</div>
    </div>
  );
};

export default OrderManagement;
