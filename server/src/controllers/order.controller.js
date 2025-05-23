const db = require("../models");
const Order = db.Order;
const Shipment = db.Shipment;
const Customer = db.Customer;
const ContainEdition = db.ContainEdition;
const ContainIssue = db.ContainIssue;
const Cart = db.Cart;
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

const createOrder = async (req, res) => {
  try {
    const { customerId, books, address } = req.body;
    console.log(books);
    // Kiểm tra dữ liệu đầu vào
    if (!customerId || !books || !books.length || !address) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Tạo OrderID duy nhất
    const timestamp = Date.now();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `OR${timestamp}${randomNum}`.slice(0, 8);

    // Tạo bản ghi trong collection order
    const newOrder = await Order.create({
      OrderID: orderId,
      Date: new Date(),
      CustomerID: customerId,
      StaffID: null,
      ShipmentID: `SH${timestamp}${randomNum}`.slice(0, 6),
      ShipmentCost: 23000, // Có thể tính động dựa trên address
      Address: address,
      Status: "Chờ xử lý",
    });

    // Thêm các bản ghi vào contain_edition hoặc contain_issue dựa trên tiền tố BookID
    for (const book of books) {
      const bookId = book.BookID;
      const prefix = bookId.substring(0, 2).toUpperCase();

      if (["NO", "RE"].includes(prefix)) {
        // Thêm vào contain_edition
        await ContainEdition.create({
          OrderID: orderId,
          BookID: bookId, // Lưu BookID thay vì ISBN
          Quantity: book.numOfBooks,
        });
      } else if (["CO", "MA"].includes(prefix)) {
        // Thêm vào contain_issue
        await ContainIssue.create({
          OrderID: orderId,
          BookID: bookId, // Lưu BookID thay vì ISSN
          Quantity: book.numOfBooks,
        });
      } else {
        // Nếu BookID không hợp lệ, trả về lỗi
        return res
          .status(400)
          .json({ message: `BookID không hợp lệ: ${bookId}` });
      }

      // Xóa sách khỏi cart
      await Cart.deleteOne({
        CustomerID: customerId,
        BookID: bookId,
      });
    }

    res.status(201).json({
      message: "Đơn hàng đã được tạo thành công",
      order: newOrder,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error.message);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const orders = await Order.aggregate([
      { $match: { CustomerID: customerId } },

      {
        $lookup: {
          from: "contain_edition",
          localField: "OrderID",
          foreignField: "OrderID",
          as: "editions",
        },
      },
      {
        $lookup: {
          from: "contain_issue",
          localField: "OrderID",
          foreignField: "OrderID",
          as: "issues",
        },
      },
      {
        $project: {
          OrderID: 1,
          Date: 1,
          CustomerID: 1,
          StaffID: 1,
          ShipmentID: 1,
          ShipmentCost: 1,
          Address: 1,
          Status: 1,
          items: {
            $concatArrays: ["$editions", "$issues"],
          },
        },
      },
      {
        $unwind: {
          path: "$items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "book",
          localField: "items.BookID",
          foreignField: "BookID",
          as: "bookDetails",
        },
      },
      {
        $unwind: {
          path: "$bookDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "edition",
          localField: "items.BookID",
          foreignField: "BookID",
          as: "editionDetails",
        },
      },
      {
        $lookup: {
          from: "issue",
          localField: "items.BookID",
          foreignField: "BookID",
          as: "issueDetails",
        },
      },
      {
        $project: {
          OrderID: 1,
          Date: 1,
          CustomerID: 1,
          StaffID: 1,
          ShipmentID: 1,
          ShipmentCost: 1,
          Address: 1,
          Status: 1,
          items: {
            BookID: "$items.BookID",
            Quantity: "$items.Quantity",
            Title: { $ifNull: ["$bookDetails.Title", "Không xác định"] },
            Price: {
              $cond: {
                if: {
                  $in: [{ $substr: ["$items.BookID", 0, 2] }, ["NO", "RE"]],
                },
                then: {
                  $ifNull: [{ $arrayElemAt: ["$editionDetails.Price", 0] }, 0],
                },
                else: {
                  $ifNull: [{ $arrayElemAt: ["$issueDetails.Price", 0] }, 0],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$OrderID",
          OrderID: { $first: "$OrderID" },
          Date: { $first: "$Date" },
          CustomerID: { $first: "$CustomerID" },
          StaffID: { $first: "$StaffID" },
          ShipmentID: { $first: "$ShipmentID" },
          ShipmentCost: { $first: "$ShipmentCost" },
          Address: { $first: "$Address" },
          Status: { $first: "$Status" },
          items: {
            $push: {
              BookID: "$items.BookID",
              Quantity: "$items.Quantity",
              Title: "$items.Title",
              Price: "$items.Price",
            },
          },
        },
      },
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
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
  createOrder,
  getOrdersByCustomerId,
};
