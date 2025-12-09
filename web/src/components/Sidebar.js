import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    {
      path: "/store-admin-panel",
      label: "My Store",
      icon: "🏪",
      hideFor: ["super_admin", "admin", "editor"],
    },
    { path: "/products", label: "Products", icon: "📦" },
    { path: "/categories", label: "Categories", icon: "🏷️", indent: true },
    { path: "/attributes", label: "Attributes", icon: "⚙️", indent: true },
    { path: "/product-variants", label: "Variants", icon: "🎨", indent: true },
    { path: "/inventory", label: "Inventory", icon: "📋" },
    {
      path: "/inventory-alerts",
      label: "Alerts & Automation",
      icon: "🚨",
      indent: true,
    },
    { path: "/orders", label: "Orders", icon: "🛒" },
    { path: "/customers", label: "Customers", icon: "👥" },
    {
      path: "/customer-segmentation",
      label: "Segmentation",
      icon: "📊",
      indent: true,
    },
    { path: "/reviews", label: "Reviews", icon: "⭐" },
    { path: "/coupons", label: "Coupons", icon: "🎟️" },
    { path: "/returns", label: "Returns", icon: "↩️" },
    { path: "/shipping", label: "Shipping", icon: "🚚" },
    {
      path: "/stores",
      label: "Stores",
      icon: "🏪",
      hideFor: ["admin", "store_admin", "editor"],
    },
    {
      path: "/store-users",
      label: "Store Editors",
      icon: "👥",
      indent: true,
      hideFor: ["super_admin", "admin", "editor"],
    },
    { path: "/users", label: "Users", icon: "👤" },
    { path: "/email-notifications", label: "Email Templates", icon: "✉️" },
    { path: "/activity-logs", label: "Activity Logs", icon: "📝" },
    { path: "/seo-tools", label: "SEO Tools", icon: "🔍" },
    { path: "/reports", label: "Reports", icon: "📈" },
    { path: "/settings", label: "Settings", icon: "⚡" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <h3>Jordan Admin</h3>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          // Hide items based on role
          if (item.hideFor && item.hideFor.includes(user?.role)) {
            return null;
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""} ${
                  item.indent ? "indent" : ""
                }`
              }>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
