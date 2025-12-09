import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Attributes from "./pages/Attributes";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Users from "./pages/Users";
import StoreManagement from "./pages/StoreManagement";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProductVariants from "./pages/ProductVariants";
import Reviews from "./pages/Reviews";
import OrderDetails from "./pages/OrderDetails";
import Coupons from "./pages/Coupons";
import EmailNotifications from "./pages/EmailNotifications";
import ActivityLogs from "./pages/ActivityLogs";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import CustomerSegmentation from "./pages/CustomerSegmentation";
import InventoryAlerts from "./pages/InventoryAlerts";
import SEOTools from "./pages/SEOTools";
import StoreAdminPanel from "./pages/StoreAdminPanel";
import StoreUsers from "./pages/StoreUsers";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import Protected from "./components/Protected";
import { useAuth } from "./contexts/AuthContext";

function AppRoutes() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { user } = useAuth();
  console.log(
    "[AppRoutes] path:",
    location.pathname,
    "isLoginPage:",
    isLoginPage,
    "user:",
    user?.name || "anon"
  );

  return (
    <>
      {!isLoginPage && <Header />}
      <div className="app-body">
        {!isLoginPage && <Sidebar />}
        <main className={isLoginPage ? "app-main login-main" : "app-main"}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              />
              <Route
                path="/products"
                element={
                  <Protected>
                    <Products />
                  </Protected>
                }
              />
              <Route
                path="/categories"
                element={
                  <Protected>
                    <Categories />
                  </Protected>
                }
              />
              <Route
                path="/attributes"
                element={
                  <Protected>
                    <Attributes />
                  </Protected>
                }
              />
              <Route
                path="/inventory"
                element={
                  <Protected>
                    <Inventory />
                  </Protected>
                }
              />
              <Route
                path="/orders"
                element={
                  <Protected>
                    <Orders />
                  </Protected>
                }
              />
              <Route
                path="/customers"
                element={
                  <Protected>
                    <Customers />
                  </Protected>
                }
              />
              <Route
                path="/stores"
                element={
                  <Protected roles={["super_admin"]}>
                    <StoreManagement />
                  </Protected>
                }
              />
              <Route
                path="/users"
                element={
                  <Protected>
                    <Users />
                  </Protected>
                }
              />
              <Route
                path="/reports"
                element={
                  <Protected>
                    <Reports />
                  </Protected>
                }
              />
              <Route
                path="/settings"
                element={
                  <Protected>
                    <Settings />
                  </Protected>
                }
              />
              <Route
                path="/product-variants"
                element={
                  <Protected>
                    <ProductVariants />
                  </Protected>
                }
              />
              <Route
                path="/reviews"
                element={
                  <Protected>
                    <Reviews />
                  </Protected>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <Protected>
                    <OrderDetails />
                  </Protected>
                }
              />
              <Route
                path="/coupons"
                element={
                  <Protected>
                    <Coupons />
                  </Protected>
                }
              />
              <Route
                path="/email-notifications"
                element={
                  <Protected>
                    <EmailNotifications />
                  </Protected>
                }
              />
              <Route
                path="/activity-logs"
                element={
                  <Protected>
                    <ActivityLogs />
                  </Protected>
                }
              />
              <Route
                path="/returns"
                element={
                  <Protected>
                    <Returns />
                  </Protected>
                }
              />
              <Route
                path="/shipping"
                element={
                  <Protected>
                    <Shipping />
                  </Protected>
                }
              />
              <Route
                path="/customer-segmentation"
                element={
                  <Protected>
                    <CustomerSegmentation />
                  </Protected>
                }
              />
              <Route
                path="/inventory-alerts"
                element={
                  <Protected>
                    <InventoryAlerts />
                  </Protected>
                }
              />
              <Route
                path="/seo-tools"
                element={
                  <Protected>
                    <SEOTools />
                  </Protected>
                }
              />
              <Route
                path="/store-admin-panel"
                element={
                  <Protected roles={["store_admin"]}>
                    <StoreAdminPanel />
                  </Protected>
                }
              />
              <Route
                path="/store-users"
                element={
                  <Protected roles={["store_admin"]}>
                    <StoreUsers />
                  </Protected>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-root">
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
}
