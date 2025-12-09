import React, { useState } from "react";

/**
 * Inventory Management — Track stock levels and low stock alerts
 */
export default function Inventory() {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      productName: "Laptop Pro 15",
      sku: "LAP-001",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      location: "Warehouse A",
      lastRestocked: "2024-12-01",
    },
    {
      id: 2,
      productName: "Wireless Mouse",
      sku: "MOU-002",
      currentStock: 5,
      minStock: 20,
      maxStock: 200,
      location: "Warehouse B",
      lastRestocked: "2024-11-28",
    },
    {
      id: 3,
      productName: "USB-C Cable",
      sku: "CAB-003",
      currentStock: 150,
      minStock: 50,
      maxStock: 500,
      location: "Warehouse A",
      lastRestocked: "2024-12-02",
    },
    {
      id: 4,
      productName: "Keyboard Mechanical",
      sku: "KEY-004",
      currentStock: 8,
      minStock: 15,
      maxStock: 75,
      location: "Warehouse C",
      lastRestocked: "2024-11-25",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [alertFilter, setAlertFilter] = useState("all");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const isLowStock = item.currentStock <= item.minStock;
    const matchesAlert =
      alertFilter === "all" ||
      (alertFilter === "low" && isLowStock) ||
      (alertFilter === "ok" && !isLowStock);

    return matchesSearch && matchesAlert;
  });

  const lowStockCount = inventory.filter(
    (i) => i.currentStock <= i.minStock
  ).length;

  return (
    <div className="page inventory-page">
      <h2>Inventory Management</h2>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Items</h4>
          <p className="kpi-value">{inventory.length}</p>
        </div>
        <div
          className="kpi-card"
          style={{ background: lowStockCount > 0 ? "#fee2e2" : "#d1fae5" }}>
          <h4>Low Stock Alerts</h4>
          <p
            className="kpi-value"
            style={{ color: lowStockCount > 0 ? "#dc2626" : "#059669" }}>
            {lowStockCount}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Total Stock Value</h4>
          <p className="kpi-value">
            {inventory.reduce((sum, i) => sum + i.currentStock, 0)}
          </p>
        </div>
      </section>

      <section className="search-filters">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={alertFilter}
          onChange={(e) => setAlertFilter(e.target.value)}>
          <option value="all">All Items</option>
          <option value="low">Low Stock</option>
          <option value="ok">Normal Stock</option>
        </select>
      </section>

      <section className="list-section">
        <h3>Inventory List</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Max Stock</th>
              <th>Location</th>
              <th>Last Restocked</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => {
              const isLowStock = item.currentStock <= item.minStock;
              return (
                <tr
                  key={item.id}
                  style={{
                    background: isLowStock ? "#fef2f2" : "transparent",
                  }}>
                  <td>
                    <strong>{item.sku}</strong>
                  </td>
                  <td>{item.productName}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: "600",
                        color: isLowStock ? "#dc2626" : "#059669",
                      }}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td>{item.minStock}</td>
                  <td>{item.maxStock}</td>
                  <td>{item.location}</td>
                  <td>{item.lastRestocked}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: isLowStock ? "#fee2e2" : "#d1fae5",
                        color: isLowStock ? "#dc2626" : "#059669",
                      }}>
                      {isLowStock ? "⚠️ Low Stock" : "✓ Normal"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
