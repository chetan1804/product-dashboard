import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";

const router = express.Router();

// GET /api/analytics - Get analytics data
router.get("/", async (req, res) => {
  try {
    const { storeId, dateFrom, dateTo } = req.query;

    // Build date filter
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    // Build store filter
    const storeFilter = storeId ? { storeId: parseInt(storeId) } : {};

    // Combine filters
    const orderFilter = { ...dateFilter, ...storeFilter };

    // Get order statistics
    const totalOrders = await Order.countDocuments(orderFilter);
    const orderStats = await Order.aggregate([
      { $match: orderFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    // Get order status breakdown
    const ordersByStatus = await Order.aggregate([
      { $match: orderFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get product count
    const totalProducts = await Product.countDocuments({ status: "active" });

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 },
      status: "active",
    });

    // Get store statistics
    const totalStores = await Store.countDocuments({ status: "active" });

    res.json({
      totalOrders,
      totalRevenue: orderStats[0]?.totalRevenue || 0,
      avgOrderValue: orderStats[0]?.avgOrderValue || 0,
      totalProducts,
      lowStockProducts,
      totalStores,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/revenue - Get revenue over time
router.get("/revenue", async (req, res) => {
  try {
    const { storeId, period = "daily" } = req.query;
    const storeFilter = storeId ? { storeId: parseInt(storeId) } : {};

    // Group by period
    const groupByFormat =
      period === "monthly"
        ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }
        : {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          };

    const revenueData = await Order.aggregate([
      { $match: storeFilter },
      {
        $group: {
          _id: groupByFormat,
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 30 },
    ]);

    res.json({ revenueData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
