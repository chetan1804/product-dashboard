import React, { useState } from "react";
import { formatDateTime } from "../utils/formatters";

/**
 * Activity Logs — Track all system activities and user actions
 */
export default function ActivityLogs() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: "2024-12-04 10:35:22",
      user: "admin@store.com",
      action: "create",
      entity: "product",
      entityName: "Laptop Pro 15",
      details: "Created new product with SKU LAP-PRO-15",
      ipAddress: "192.168.1.100",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-12-04 10:30:15",
      user: "john.doe@example.com",
      action: "purchase",
      entity: "order",
      entityName: "Order #ORD-2024-001",
      details: "Placed order worth $1,461.97",
      ipAddress: "203.45.67.89",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-12-04 10:25:40",
      user: "admin@store.com",
      action: "update",
      entity: "coupon",
      entityName: "SAVE50",
      details: "Updated coupon expiry date to 2024-12-15",
      ipAddress: "192.168.1.100",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2024-12-04 10:20:05",
      user: "system",
      action: "alert",
      entity: "inventory",
      entityName: "USB-C Cable",
      details: "Low stock alert: Only 8 units remaining",
      ipAddress: "127.0.0.1",
      severity: "warning",
    },
    {
      id: 5,
      timestamp: "2024-12-04 10:15:30",
      user: "admin@store.com",
      action: "delete",
      entity: "user",
      entityName: "spam.user@fake.com",
      details: "Deleted spam user account",
      ipAddress: "192.168.1.100",
      severity: "warning",
    },
    {
      id: 6,
      timestamp: "2024-12-04 10:10:18",
      user: "alice@example.com",
      action: "login_failed",
      entity: "auth",
      entityName: "Authentication",
      details: "Failed login attempt - incorrect password",
      ipAddress: "198.51.100.42",
      severity: "error",
    },
    {
      id: 7,
      timestamp: "2024-12-04 10:05:00",
      user: "system",
      action: "backup",
      entity: "database",
      entityName: "Database Backup",
      details: "Automatic database backup completed successfully",
      ipAddress: "127.0.0.1",
      severity: "info",
    },
    {
      id: 8,
      timestamp: "2024-12-04 09:55:42",
      user: "admin@store.com",
      action: "login",
      entity: "auth",
      entityName: "Authentication",
      details: "Admin user logged in successfully",
      ipAddress: "192.168.1.100",
      severity: "info",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchTerm ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesSeverity = !severityFilter || log.severity === severityFilter;
    const matchesEntity = !entityFilter || log.entity === entityFilter;
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    return (
      matchesSearch &&
      matchesAction &&
      matchesSeverity &&
      matchesEntity &&
      matchesDate
    );
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "📝";
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "create":
        return "➕";
      case "update":
        return "✏️";
      case "delete":
        return "🗑️";
      case "login":
        return "🔐";
      case "login_failed":
        return "🚫";
      case "purchase":
        return "🛒";
      case "alert":
        return "🔔";
      case "backup":
        return "💾";
      default:
        return "📄";
    }
  };

  const handleExport = () => {
    const csv = [
      [
        "Timestamp",
        "User",
        "Action",
        "Entity",
        "Entity Name",
        "Details",
        "IP Address",
        "Severity",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.user,
        log.action,
        log.entity,
        log.entityName,
        log.details,
        log.ipAddress,
        log.severity,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const infoCount = logs.filter((l) => l.severity === "info").length;
  const warningCount = logs.filter((l) => l.severity === "warning").length;
  const errorCount = logs.filter((l) => l.severity === "error").length;

  return (
    <div className="page activity-logs-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Activity Logs</h2>
        <button onClick={handleExport} style={{ background: "#10b981" }}>
          📥 Export to CSV
        </button>
      </div>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Logs</h4>
          <p className="kpi-value">{logs.length}</p>
        </div>
        <div className="kpi-card" style={{ background: "#dbeafe" }}>
          <h4>Info</h4>
          <p className="kpi-value" style={{ color: "#1e40af" }}>
            {infoCount}
          </p>
        </div>
        <div className="kpi-card" style={{ background: "#fef3c7" }}>
          <h4>Warnings</h4>
          <p className="kpi-value" style={{ color: "#92400e" }}>
            {warningCount}
          </p>
        </div>
        <div className="kpi-card" style={{ background: "#fee2e2" }}>
          <h4>Errors</h4>
          <p className="kpi-value" style={{ color: "#dc2626" }}>
            {errorCount}
          </p>
        </div>
      </section>

      <section className="search-filters">
        <input
          type="text"
          placeholder="Search by user, entity, or details..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
          style={{ gridColumn: "1 / -1" }}
        />
        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="login">Login</option>
          <option value="login_failed">Login Failed</option>
          <option value="purchase">Purchase</option>
          <option value="alert">Alert</option>
          <option value="backup">Backup</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => {
            setEntityFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Entities</option>
          <option value="product">Product</option>
          <option value="order">Order</option>
          <option value="user">User</option>
          <option value="coupon">Coupon</option>
          <option value="inventory">Inventory</option>
          <option value="auth">Authentication</option>
          <option value="database">Database</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
        />
      </section>

      <section className="list-section">
        <h3>Activity Log Entries ({filteredLogs.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {paginatedLogs.map((log) => (
            <div
              key={log.id}
              style={{
                border: "1px solid #e5e7eb",
                borderLeft: `4px solid ${
                  log.severity === "error"
                    ? "#dc2626"
                    : log.severity === "warning"
                    ? "#f59e0b"
                    : "#3b82f6"
                }`,
                borderRadius: "8px",
                padding: "12px 16px",
                background: "white",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: "16px",
                alignItems: "center",
              }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "24px" }}>
                  {getActionIcon(log.action)}
                </span>
                <span style={{ fontSize: "24px" }}>
                  {getSeverityIcon(log.severity)}
                </span>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "4px",
                  }}>
                  <strong style={{ fontSize: "14px" }}>{log.entityName}</strong>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: "#f3f4f6",
                      color: "#374151",
                      textTransform: "uppercase",
                    }}>
                    {log.action.replace("_", " ")}
                  </span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "500",
                      background: "#ede9fe",
                      color: "#6b21a8",
                    }}>
                    {log.entity}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    color: "#374151",
                  }}>
                  {log.details}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}>
                  <span>👤 {log.user}</span>
                  <span>🌐 {log.ipAddress}</span>
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#6b7280",
                }}>
                {formatDateTime(log.timestamp)}
              </div>
            </div>
          ))}
        </div>

        <div className="pagination" style={{ marginTop: "24px" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            {page} / {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
