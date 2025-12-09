import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Reports — Advanced reporting and analytics
 */
export default function Reports() {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("month");

  const salesReport = [
    { period: "Week 1", sales: 1250, orders: 45 },
    { period: "Week 2", sales: 1580, orders: 52 },
    { period: "Week 3", sales: 2100, orders: 68 },
    { period: "Week 4", sales: 1890, orders: 61 },
  ];

  const customerReport = [
    { period: "Week 1", newCustomers: 12, returning: 33 },
    { period: "Week 2", newCustomers: 18, returning: 34 },
    { period: "Week 3", newCustomers: 22, returning: 46 },
    { period: "Week 4", newCustomers: 15, returning: 46 },
  ];

  const productPerformance = [
    { name: "Laptop Pro", sales: 45, revenue: 45000 },
    { name: "Mouse Wireless", sales: 120, revenue: 3600 },
    { name: "Keyboard", sales: 78, revenue: 7800 },
    { name: "Monitor 4K", sales: 32, revenue: 16000 },
  ];

  return (
    <div className="page reports-page">
      <h2>Reports & Analytics</h2>

      <section className="dashboard-controls" style={{ marginBottom: "24px" }}>
        <div>
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}>
            <option value="sales">Sales Report</option>
            <option value="customers">Customer Report</option>
            <option value="products">Product Performance</option>
          </select>
        </div>
        <div>
          <label>Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <button
          style={{
            padding: "10px 20px",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}>
          📥 Export PDF
        </button>
      </section>

      {reportType === "sales" && (
        <section className="dashboard-charts">
          <div className="chart-container">
            <h3>Sales & Orders Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Sales ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="kpi-card" style={{ marginTop: "24px" }}>
            <h4>Total Sales This Period</h4>
            <p className="kpi-value">
              ${salesReport.reduce((sum, s) => sum + s.sales, 0).toFixed(2)}
            </p>
          </div>
        </section>
      )}

      {reportType === "customers" && (
        <section className="dashboard-charts">
          <div className="chart-container">
            <h3>Customer Acquisition & Retention</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={customerReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="newCustomers"
                  fill="#10b981"
                  name="New Customers"
                />
                <Bar
                  dataKey="returning"
                  fill="#3b82f6"
                  name="Returning Customers"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {reportType === "products" && (
        <section className="list-section">
          <h3>Product Performance Report</h3>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Total Sales</th>
                <th>Revenue</th>
                <th>Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.sales}</td>
                  <td>${p.revenue.toFixed(2)}</td>
                  <td>${(p.revenue / p.sales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
