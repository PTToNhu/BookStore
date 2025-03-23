const db = require("../models");
const Order = db.Order;
const Shipment = db.Shipment;

const getAllOrderByCustomerId = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Tìm tất cả các đơn hàng theo CustomerID
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "shipment", // Collection của Shipment
          localField: "ShipmentID",
          foreignField: "ShipmentID",
          as: "ShipmentDetails",
        },
      },
    ]);

    // Kiểm tra nếu không có đơn hàng
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the customer." });
    }

    // Trả về danh sách đơn hàng
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by customer:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllOrderByStaffId = async (req, res) => {
  const staffId = req.params.staffId;

  try {
    // Tìm tất cả các đơn hàng theo StaffID
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "shipment", // Collection của Shipment
          localField: "ShipmentID",
          foreignField: "ShipmentID",
          as: "ShipmentDetails",
        },
      },
    ]);

    // Kiểm tra nếu không có đơn hàng
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the staff." });
    }

    // Trả về danh sách đơn hàng
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by staff:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllOrderByCustomerId,
  getAllOrderByStaffId,
};
