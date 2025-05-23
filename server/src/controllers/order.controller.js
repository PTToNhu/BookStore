const db = require("../models");
const Order = db.Order;
const Shipment = db.Shipment;
const Customer = db.Customer;
const getAllOrderByCustomerId = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "shipment",
          localField: "ShipmentID",
          foreignField: "ShipmentID",
          as: "ShipmentDetails",
        },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the customer." });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by customer:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllOrderByStaffId = async (req, res) => {
  try {
    const { staffId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search ? req.query.search.trim() : "";

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }

    const matchQuery = {
      $or: [{ StaffID: null }, { StaffID: staffId }],
    };

    const filOrd = [
      // Match orders by StaffID
      { $match: matchQuery },

      {
        $lookup: {
          from: "customer",
          localField: "CustomerID",
          foreignField: "CustomerID",
          as: "customer",
        },
      },

      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { OrderID: { $regex: searchTerm, $options: "i" } },
                  { Address: { $regex: searchTerm, $options: "i" } },
                  { Status: { $regex: searchTerm, $options: "i" } },
                  { "customer.Name": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          OrderID: 1,
          Date: 1,
          CustomerID: 1,
          StaffID: 1,
          ShipmentCost: 1,
          Address: 1,
          Status: 1,
          Customer: {
            CustomerID: "$customer.CustomerID",
            Name: "$customer.Name",
          },
        },
      },
      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    const orders = await Order.aggregate(filOrd);

    // Count total documents for pagination
    const countFilOrd = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "customer",
          localField: "CustomerID",
          foreignField: "CustomerID",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { OrderID: { $regex: searchTerm, $options: "i" } },
                  { Address: { $regex: searchTerm, $options: "i" } },
                  { Status: { $regex: searchTerm, $options: "i" } },
                  { "customer.Name": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      { $count: "total" },
    ];

    const countResult = await Order.aggregate(countFilOrd);
    const totalOrders = countResult.length > 0 ? countResult[0].total : 0;
    console.log("Total orders count:", totalOrders);

    if (!orders.length) {
      return res.status(200).json({
        orders: [],
        totalPages: 0,
        currentPage: page,
        message: "No orders found for the given criteria.",
      });
    }

    // Format response
    const ordersWithCustomerDetails = orders.map((order) => {
      return {
        OrderID: order.OrderID,
        Date: order.Date ? order.Date.toISOString() : "Unknown",
        Customer: order.Customer
          ? {
              CustomerID:
                order.Customer.CustomerID || order.CustomerID || "Unknown",
              Name: order.Customer.Name || "Unknown Customer",
            }
          : {
              CustomerID: order.CustomerID || "Unknown",
              Name: "Unknown Customer",
            },
        StaffID: order.StaffID,
        ShipmentCost: order.ShipmentCost,
        Address: order.Address,
        Status: order.Status,
      };
    });

    res.status(200).json({
      orders: ordersWithCustomerDetails,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateStatusOrder = async (req, res) => {
  const StaffID = req.user.StaffID;
  console.log("StaffID: ", StaffID);
  const { OrderID, Status } = req.body;

  try {
    let ord = await Order.findOne({ OrderID });

    if (ord) {
      if (!ord.StaffID) {
        ord.StaffID = StaffID;
        ord.Status = Status;
        await ord.save();

        res.status(200).json({
          message:
            "Đơn hàng được gán cho nhân viên và trạng thái cập nhật thành công!",
          order: ord,
        });
      } else if (ord.StaffID === StaffID) {
        ord.Status = Status;
        await ord.save();

        res.status(200).json({
          message: "Trạng thái đơn hàng đã được cập nhật thành công!",
          order: ord,
        });
      } else {
        res.status(403).json({
          error: "Bạn không được phép thay đổi trạng thái đơn hàng này!",
        });
      }
    } else {
      res.status(404).json({
        error: "Đơn hàng không tồn tại!",
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại sau!" });
  }
};

const getUnassignedOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search ? req.query.search.trim() : "";

    // Build base match query for unassigned orders (StaffID: null)
    const matchQuery = {
      StaffID: null,
    };

    const filOrd = [
      { $match: matchQuery },

      {
        $lookup: {
          from: "customer",
          localField: "CustomerID",
          foreignField: "CustomerID",
          as: "customer",
        },
      },

      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      // Match search term
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { OrderID: { $regex: searchTerm, $options: "i" } },
                  { Address: { $regex: searchTerm, $options: "i" } },
                  { Status: { $regex: searchTerm, $options: "i" } },
                  { "customer.Name": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          OrderID: 1,
          Date: 1,
          CustomerID: 1,
          StaffID: 1,
          ShipmentCost: 1,
          Address: 1,
          Status: 1,
          Customer: {
            CustomerID: "$customer.CustomerID",
            Name: "$customer.Name",
          },
        },
      },
      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    const orders = await Order.aggregate(filOrd);

    // Count total documents for pagination
    const countFilOrd = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "customer",
          localField: "CustomerID",
          foreignField: "CustomerID",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      ...(searchTerm
        ? [
            {
              $match: {
                $or: [
                  { OrderID: { $regex: searchTerm, $options: "i" } },
                  { Address: { $regex: searchTerm, $options: "i" } },
                  { Status: { $regex: searchTerm, $options: "i" } },
                  { "customer.Name": { $regex: searchTerm, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      { $count: "total" },
    ];

    const countResult = await Order.aggregate(countFilOrd);
    const totalOrders = countResult.length > 0 ? countResult[0].total : 0;

    if (!orders.length) {
      return res.status(200).json({
        orders: [],
        totalPages: 0,
        currentPage: page,
        message: "No unassigned orders found.",
      });
    }

    const ordersWithCustomerDetails = orders.map((order) => ({
      OrderID: order.OrderID,
      Date: order.Date ? order.Date.toISOString() : "Unknown",
      Customer: order.Customer
        ? {
            CustomerID:
              order.Customer.CustomerID || order.CustomerID || "Unknown",
            Name: order.Customer.Name || "Unknown Customer",
          }
        : {
            CustomerID: order.CustomerID || "Unknown",
            Name: "Unknown Customer",
          },
      StaffID: order.StaffID,
      ShipmentCost: order.ShipmentCost,
      Address: order.Address,
      Status: order.Status,
    }));

    res.status(200).json({
      orders: ordersWithCustomerDetails,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching unassigned orders:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getAllOrderByCustomerId,
  getAllOrderByStaffId,
  updateStatusOrder,
  getUnassignedOrders,
};
