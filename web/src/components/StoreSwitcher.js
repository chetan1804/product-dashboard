import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedStore } from "../redux/slices/storeSlice";

/**
 * Store Switcher — Dropdown for super_admin and admin to switch between stores
 * Allows super_admin/admin to view data from different stores
 */
export default function StoreSwitcher() {
  const { user, switchStore } = useAuth();
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.stores?.list || []);
  const currentStore = useSelector((state) => state.stores?.selectedStore);
  const [isOpen, setIsOpen] = useState(false);

  // Only show for super_admin and admin
  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    return null;
  }

  const handleStoreSwitch = (storeId) => {
    // Update user context
    switchStore(storeId);

    // Update Redux selected store
    dispatch(setSelectedStore(storeId));

    setIsOpen(false);
  };

  const selectedStoreData = stores.find(
    (s) => s.id === (currentStore || user?.storeId)
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "8px 16px",
          background: "var(--primary)",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
        🏪 {selectedStoreData?.name || "Select Store"}
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "8px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            minWidth: "280px",
          }}>
          <div style={{ padding: "8px 0" }}>
            {stores.length === 0 ? (
              <div
                style={{
                  padding: "12px 16px",
                  color: "#999",
                  textAlign: "center",
                }}>
                No stores available
              </div>
            ) : (
              stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreSwitch(store.id)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    background:
                      (currentStore || user?.storeId) === store.id
                        ? "#f3f4f6"
                        : "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "0.2s",
                    borderLeft:
                      (currentStore || user?.storeId) === store.id
                        ? "3px solid var(--primary)"
                        : "3px solid transparent",
                    paddingLeft: "13px",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#f9fafb")}
                  onMouseLeave={(e) =>
                    (e.target.style.background =
                      (currentStore || user?.storeId) === store.id
                        ? "#f3f4f6"
                        : "transparent")
                  }>
                  <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                    {(currentStore || user?.storeId) === store.id && "✓ "}
                    {store.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    {store.city}, {store.state}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* All Stores Link */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "8px 0",
            }}>
            <button
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                transition: "0.2s",
                fontSize: "14px",
                color: "#0084ff",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f9fafb")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}>
              📊 View All Stores
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
