import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSelector } from "react-redux";

/**
 * Store Admin Panel — Dashboard for store_admin to manage their specific store
 */
export default function StoreAdminPanel() {
  const { user } = useAuth();
  const stores = useSelector((state) => state.stores?.list || []);
  const currentStore = stores.find((s) => s.id === user?.storeId);

  const [activeTab, setActiveTab] = useState("overview");

  // Check authorization
  if (user?.role !== "store_admin") {
    return (
      <div className="page">
        <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
          <h2>🔒 Access Denied</h2>
          <p>Only store admins can access this panel.</p>
        </div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="page">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Store Not Found</h2>
          <p>Unable to load store information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page store-admin-panel">
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0" }}>🏪 {currentStore.name}</h2>
        <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "14px" }}>
          {currentStore.location} • {currentStore.city}, {currentStore.state} •{" "}
          {currentStore.phone}
        </p>
      </div>

      {/* Store Metrics */}
      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Orders</h4>
          <p className="kpi-value">{currentStore.totalOrders}</p>
        </div>
        <div className="kpi-card">
          <h4>Total Revenue</h4>
          <p className="kpi-value">${currentStore.totalRevenue.toFixed(0)}</p>
        </div>
        <div className="kpi-card">
          <h4>Active Editors</h4>
          <p className="kpi-value">{currentStore.activeEditors}</p>
        </div>
        <div className="kpi-card">
          <h4>Avg Order Value</h4>
          <p className="kpi-value">
            ${(currentStore.totalRevenue / currentStore.totalOrders).toFixed(0)}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          borderBottom: "1px solid #e5e7eb",
        }}>
        {["overview", "orders", "products", "editors", "settings"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 16px",
                border: "none",
                background:
                  activeTab === tab ? "var(--primary)" : "transparent",
                color: activeTab === tab ? "white" : "#666",
                borderRadius: activeTab === tab ? "8px 8px 0 0" : "0",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
              }}>
              {tab}
            </button>
          )
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}>
          <section className="form-section">
            <h3>Store Information</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}>
                  Store Name
                </label>
                <p style={{ margin: 0 }}>{currentStore.name}</p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}>
                  Address
                </label>
                <p style={{ margin: 0 }}>{currentStore.address}</p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}>
                  City/State/Zip
                </label>
                <p style={{ margin: 0 }}>
                  {currentStore.city}, {currentStore.state} {currentStore.zip}
                </p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}>
                  Phone
                </label>
                <p style={{ margin: 0 }}>{currentStore.phone}</p>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}>
                  Email
                </label>
                <p style={{ margin: 0 }}>{currentStore.email}</p>
              </div>
              <button style={{ marginTop: "12px" }}>Edit Store Details</button>
            </div>
          </section>

          <section className="form-section">
            <h3>Quick Stats</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  padding: "12px",
                  background: "#f0fdf4",
                  borderRadius: "8px",
                }}>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    color: "#666",
                  }}>
                  Status
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#059669",
                  }}>
                  ✓ {currentStore.status}
                </p>
              </div>
              <div
                style={{
                  padding: "12px",
                  background: "#dbeafe",
                  borderRadius: "8px",
                }}>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    color: "#666",
                  }}>
                  Created
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1e40af",
                  }}>
                  {currentStore.createdDate}
                </p>
              </div>
              <div
                style={{
                  padding: "12px",
                  background: "#fef3c7",
                  borderRadius: "8px",
                }}>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    color: "#666",
                  }}>
                  Store Admin
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#92400e",
                  }}>
                  {currentStore.storeAdminName}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f3f4f6",
                borderRadius: "8px",
              }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                Useful Links
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                <button
                  style={{
                    background: "#3b82f6",
                    justifyContent: "flex-start",
                  }}>
                  📊 View Store Analytics
                </button>
                <button
                  style={{
                    background: "#3b82f6",
                    justifyContent: "flex-start",
                  }}>
                  👥 Manage Editors
                </button>
                <button
                  style={{
                    background: "#3b82f6",
                    justifyContent: "flex-start",
                  }}>
                  🛒 View Store Orders
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "orders" && (
        <section className="form-section">
          <h3>Store Orders</h3>
          <p style={{ color: "#666" }}>
            Only orders from {currentStore.name} are displayed below.
          </p>
          <p style={{ marginTop: "16px", textAlign: "center", color: "#999" }}>
            Orders will be shown here - integration with Orders page
          </p>
        </section>
      )}

      {activeTab === "products" && (
        <section className="form-section">
          <h3>Store Products</h3>
          <p style={{ color: "#666" }}>
            All products created in dashboard are available for{" "}
            {currentStore.name} to sell.
          </p>
          <p style={{ marginTop: "16px", textAlign: "center", color: "#999" }}>
            Products list will be shown here - integration with Products page
          </p>
        </section>
      )}

      {activeTab === "editors" && (
        <section className="form-section">
          <h3>Manage Editors</h3>
          <p style={{ color: "#666", marginBottom: "16px" }}>
            Add and manage editors who can manage products for{" "}
            {currentStore.name}.
          </p>
          <button style={{ marginBottom: "16px" }}>➕ Add Editor</button>
          <p style={{ textAlign: "center", color: "#999" }}>
            Editors management will be shown here
          </p>
        </section>
      )}

      {activeTab === "settings" && (
        <section className="form-section">
          <h3>Store Settings</h3>
          <div style={{ display: "grid", gap: "16px" }}>
            <div>
              <label>Store Name</label>
              <input type="text" defaultValue={currentStore.name} />
            </div>
            <div>
              <label>Store Email</label>
              <input type="email" defaultValue={currentStore.email} />
            </div>
            <div>
              <label>Store Phone</label>
              <input type="tel" defaultValue={currentStore.phone} />
            </div>
            <button>Save Settings</button>
          </div>
        </section>
      )}
    </div>
  );
}
