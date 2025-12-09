import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../redux/slices/analyticsSlice";
import { LoadingError } from "../components/ErrorPage";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Dashboard — analytics with sales trends, revenue, and multi-store comparison
 * Uses useMemo for performance optimization and lazy loading
 */
export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    salesData,
    revenueData,
    storeComparison,
    topProducts,
    totalSales,
    totalRevenue,
    status,
    error,
  } = useSelector((state) => state.analytics);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    dispatch(fetchAnalytics({ timeRange }));
  }, [dispatch, timeRange]);

  // Memoized computations for performance
  const avgRevenuePerDay = useMemo(() => {
    return revenueData.length > 0
      ? (
          revenueData.reduce((sum, d) => sum + d.revenue, 0) /
          revenueData.length
        ).toFixed(2)
      : 0;
  }, [revenueData]);

  const topStore = useMemo(() => {
    if (storeComparison.length === 0) return null;
    return storeComparison.reduce((max, s) =>
      s.revenue > max.revenue ? s : max
    );
  }, [storeComparison]);

  const colors = ["#0066cc", "#00cc66", "#cc6600", "#cc0066", "#66cc00"];

  return (
    <div className="page dashboard-page">
      <h2>Dashboard Analytics</h2>

      <section className="dashboard-controls">
        <label>Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </section>

      {error && (
        <LoadingError
          error={error}
          onRetry={() => dispatch(fetchAnalytics({ timeRange }))}
          message="Failed to load analytics data"
        />
      )}

      {status === "loading" ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          <section className="dashboard-kpis">
            <div className="kpi-card">
              <h4>Total Sales</h4>
              <p className="kpi-value">{totalSales}</p>
            </div>
            <div className="kpi-card">
              <h4>Total Revenue</h4>
              <p className="kpi-value">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="kpi-card">
              <h4>Avg Revenue/Day</h4>
              <p className="kpi-value">${avgRevenuePerDay}</p>
            </div>
            {topStore && (
              <div className="kpi-card">
                <h4>Top Store</h4>
                <p className="kpi-value">{topStore.name}</p>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  ${topStore.revenue.toFixed(2)}
                </p>
              </div>
            )}
          </section>

          <section className="dashboard-charts">
            <div className="chart-container">
              <h3>Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#0066cc"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#00cc66" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Store Comparison (Revenue)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={storeComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#cc6600" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {topProducts.length > 0 && (
              <div className="chart-container">
                <h3>Top Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProducts}
                      dataKey="sales"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label>
                      {topProducts.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
