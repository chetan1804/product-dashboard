import React, { useState } from "react";

/**
 * Inventory Alerts & Automation — Automated low stock alerts and reorder management
 */
export default function InventoryAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      productName: "Laptop Pro 15",
      sku: "LAP-PRO-15",
      currentStock: 3,
      minStock: 10,
      maxStock: 100,
      reorderLevel: 15,
      reorderQuantity: 50,
      status: "critical",
      lastRestockDate: "2024-11-20",
      daysUntilStockout: 2,
      automationEnabled: true,
      autoReorderTriggered: true,
    },
    {
      id: 2,
      productName: "Wireless Mouse",
      sku: "MOUSE-WL-01",
      currentStock: 8,
      minStock: 5,
      maxStock: 100,
      reorderLevel: 20,
      reorderQuantity: 100,
      status: "warning",
      lastRestockDate: "2024-11-28",
      daysUntilStockout: 5,
      automationEnabled: true,
      autoReorderTriggered: false,
    },
    {
      id: 3,
      productName: "USB-C Cable",
      sku: "CABLE-USB-C",
      currentStock: 45,
      minStock: 10,
      maxStock: 200,
      reorderLevel: 30,
      reorderQuantity: 100,
      status: "healthy",
      lastRestockDate: "2024-12-01",
      daysUntilStockout: 30,
      automationEnabled: true,
      autoReorderTriggered: false,
    },
    {
      id: 4,
      productName: "HDMI Cable",
      sku: "CABLE-HDMI",
      currentStock: 2,
      minStock: 5,
      maxStock: 150,
      reorderLevel: 20,
      reorderQuantity: 75,
      status: "critical",
      lastRestockDate: "2024-11-10",
      daysUntilStockout: 1,
      automationEnabled: true,
      autoReorderTriggered: true,
    },
  ]);

  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: "Auto Reorder Critical",
      trigger: "When stock < reorder level",
      action: "Automatically create purchase order",
      enabled: true,
    },
    {
      id: 2,
      name: "Send Alert Email",
      trigger: "When stock < minimum",
      action: "Send email to inventory manager",
      enabled: true,
    },
    {
      id: 3,
      name: "Pause Sales",
      trigger: "When stock = 0",
      action: "Mark product as out of stock",
      enabled: false,
    },
  ]);

  const [showRuleForm, setShowRuleForm] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", trigger: "", action: "" });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAutomation, setFilterAutomation] = useState("");

  const filteredAlerts = alerts.filter((a) => {
    const matchesStatus = !filterStatus || a.status === filterStatus;
    const matchesAutomation =
      !filterAutomation ||
      (filterAutomation === "enabled" && a.automationEnabled) ||
      (filterAutomation === "disabled" && !a.automationEnabled);
    return matchesStatus && matchesAutomation;
  });

  const criticalCount = alerts.filter((a) => a.status === "critical").length;
  const warningCount = alerts.filter((a) => a.status === "warning").length;
  const automatedOrders = alerts.filter((a) => a.autoReorderTriggered).length;

  const handleUpdateStock = (id, newStock) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              currentStock: newStock,
              status:
                newStock < a.minStock
                  ? "critical"
                  : newStock < a.reorderLevel
                  ? "warning"
                  : "healthy",
            }
          : a
      )
    );
  };

  const handleCreateRule = () => {
    if (newRule.name.trim()) {
      setAutomationRules([
        ...automationRules,
        { id: Date.now(), ...newRule, enabled: true },
      ]);
      setNewRule({ name: "", trigger: "", action: "" });
      setShowRuleForm(false);
    }
  };

  const handleToggleRule = (id) => {
    setAutomationRules(
      automationRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const handleDeleteRule = (id) => {
    if (window.confirm("Delete this automation rule?")) {
      setAutomationRules(automationRules.filter((r) => r.id !== id));
    }
  };

  const handleManualReorder = (alert) => {
    alert(
      `Manual purchase order created for ${alert.productName}\n\nQty: ${alert.reorderQuantity} units\nEstimated arrival: 5-7 business days`
    );
  };

  return (
    <div className="page inventory-alerts-page">
      <h2>Inventory Alerts & Automation</h2>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card" style={{ background: "#fee2e2" }}>
          <h4>Critical Alerts</h4>
          <p className="kpi-value" style={{ color: "#dc2626" }}>
            {criticalCount}
          </p>
        </div>
        <div className="kpi-card" style={{ background: "#fef3c7" }}>
          <h4>Warnings</h4>
          <p className="kpi-value" style={{ color: "#92400e" }}>
            {warningCount}
          </p>
        </div>
        <div className="kpi-card" style={{ background: "#dbeafe" }}>
          <h4>Auto Reorders</h4>
          <p className="kpi-value" style={{ color: "#1e40af" }}>
            {automatedOrders}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Total Tracked</h4>
          <p className="kpi-value">{alerts.length}</p>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}>
        {/* Alerts Section */}
        <div>
          <h3 style={{ marginBottom: "16px" }}>Stock Alerts</h3>

          <section className="search-filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="critical">🔴 Critical</option>
              <option value="warning">🟡 Warning</option>
              <option value="healthy">🟢 Healthy</option>
            </select>
            <select
              value={filterAutomation}
              onChange={(e) => setFilterAutomation(e.target.value)}>
              <option value="">All Automation</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </section>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                style={{
                  border:
                    selectedAlert?.id === alert.id
                      ? "2px solid var(--primary)"
                      : "1px solid #e5e7eb",
                  borderLeft:
                    alert.status === "critical"
                      ? "4px solid #dc2626"
                      : alert.status === "warning"
                      ? "4px solid #f59e0b"
                      : "4px solid #10b981",
                  borderRadius: "8px",
                  padding: "16px",
                  background:
                    selectedAlert?.id === alert.id ? "#f0f9ff" : "white",
                  cursor: "pointer",
                }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "12px",
                  }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px" }}>
                      {alert.productName}
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                      SKU: {alert.sku}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        alert.status === "critical"
                          ? "#fecaca"
                          : alert.status === "warning"
                          ? "#fed7aa"
                          : "#bbf7d0",
                      color:
                        alert.status === "critical"
                          ? "#991b1b"
                          : alert.status === "warning"
                          ? "#92400e"
                          : "#166534",
                    }}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    fontSize: "13px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f3f4f6",
                  }}>
                  <div>
                    <span style={{ color: "#666" }}>Current Stock:</span>
                    <strong style={{ fontSize: "16px" }}>
                      {alert.currentStock}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Min/Max:</span>
                    <strong>
                      {alert.minStock} / {alert.maxStock}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Reorder Level:</span>
                    <strong>{alert.reorderLevel}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Days Until Out:</span>
                    <strong
                      style={{
                        color:
                          alert.daysUntilStockout <= 2 ? "#dc2626" : "#f59e0b",
                      }}>
                      {alert.daysUntilStockout}
                    </strong>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}>
                      <input
                        type="checkbox"
                        checked={alert.automationEnabled}
                        onChange={() => {
                          setAlerts(
                            alerts.map((a) =>
                              a.id === alert.id
                                ? {
                                    ...a,
                                    automationEnabled: !a.automationEnabled,
                                  }
                                : a
                            )
                          );
                        }}
                      />
                      <span style={{ fontSize: "12px" }}>
                        🤖 Auto-reorder{" "}
                        {alert.automationEnabled ? "enabled" : "disabled"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details & Rules */}
        <div>
          {selectedAlert ? (
            <section className="form-section">
              <h4>{selectedAlert.productName}</h4>
              <div style={{ marginBottom: "16px" }}>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "13px",
                    color: "#666",
                  }}>
                  <strong>Last Restock:</strong> {selectedAlert.lastRestockDate}
                </p>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "13px",
                    color: "#666",
                  }}>
                  <strong>Reorder Qty:</strong> {selectedAlert.reorderQuantity}{" "}
                  units
                </p>
                <button
                  onClick={() => handleManualReorder(selectedAlert)}
                  style={{ width: "100%", background: "#10b981" }}>
                  📦 Create Purchase Order
                </button>
              </div>

              <h4 style={{ marginBottom: "12px" }}>Adjust Stock</h4>
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input
                  type="number"
                  defaultValue={selectedAlert.currentStock}
                  id="stock-input"
                  min="0"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("stock-input");
                    handleUpdateStock(selectedAlert.id, parseInt(input.value));
                  }}
                  style={{ background: "#3b82f6" }}>
                  Update
                </button>
              </div>
            </section>
          ) : (
            <section className="form-section">
              <p
                style={{
                  color: "#666",
                  fontSize: "13px",
                  textAlign: "center",
                }}>
                👈 Select an alert to view details
              </p>
            </section>
          )}

          <section className="form-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}>
              <h4 style={{ margin: 0 }}>Automation Rules</h4>
              <button
                onClick={() => setShowRuleForm(!showRuleForm)}
                style={{
                  padding: "4px 12px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}>
                ➕ Add Rule
              </button>
            </div>

            {showRuleForm && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                }}>
                <div>
                  <label>Rule Name</label>
                  <input
                    value={newRule.name}
                    onChange={(e) =>
                      setNewRule({ ...newRule, name: e.target.value })
                    }
                    placeholder="e.g., Auto reorder laptops"
                  />
                </div>
                <div>
                  <label>Trigger</label>
                  <input
                    value={newRule.trigger}
                    onChange={(e) =>
                      setNewRule({ ...newRule, trigger: e.target.value })
                    }
                    placeholder="When condition is met..."
                  />
                </div>
                <div>
                  <label>Action</label>
                  <input
                    value={newRule.action}
                    onChange={(e) =>
                      setNewRule({ ...newRule, action: e.target.value })
                    }
                    placeholder="What should happen..."
                  />
                </div>
                <button
                  onClick={handleCreateRule}
                  style={{ width: "100%", marginBottom: "8px" }}>
                  Create Rule
                </button>
                <button
                  onClick={() => setShowRuleForm(false)}
                  style={{ width: "100%", background: "#6b7280" }}>
                  Cancel
                </button>
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    padding: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    background: rule.enabled ? "#f0fdf4" : "#f3f4f6",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "8px",
                    }}>
                    <strong style={{ fontSize: "13px" }}>{rule.name}</strong>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}>
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={() => handleToggleRule(rule.id)}
                      />
                      <span style={{ fontSize: "11px" }}>
                        {rule.enabled ? "ON" : "OFF"}
                      </span>
                    </label>
                  </div>
                  <p
                    style={{
                      margin: "4px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    {rule.trigger}
                  </p>
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    {rule.action}
                  </p>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    style={{
                      padding: "2px 8px",
                      fontSize: "11px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
