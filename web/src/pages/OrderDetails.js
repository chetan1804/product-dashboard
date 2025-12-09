import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Order Details — Comprehensive order information page
 */
export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Mock order data
  const [order] = useState({
    id: orderId || "ORD-2024-001",
    orderNumber: orderId || "ORD-2024-001",
    date: "2024-12-04",
    status: "processing",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 234 567 8900",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    items: [
      {
        id: 1,
        name: "Laptop Pro 15",
        sku: "LAP-PRO-15",
        variant: "Silver - 16GB RAM",
        price: 1299.99,
        quantity: 1,
        image: "",
      },
      {
        id: 2,
        name: "Wireless Mouse",
        sku: "MOUSE-WL-01",
        variant: "Black",
        price: 29.99,
        quantity: 2,
        image: "",
      },
    ],
    subtotal: 1359.97,
    shipping: 15.0,
    tax: 137.0,
    discount: 50.0,
    total: 1461.97,
    paymentMethod: "Credit Card (**** 4242)",
    paymentStatus: "paid",
    shippingMethod: "Standard Shipping (5-7 days)",
    trackingNumber: "1Z999AA10123456784",
    notes: "Please deliver before 5 PM",
    timeline: [
      { date: "2024-12-04 10:30", event: "Order placed", status: "completed" },
      {
        date: "2024-12-04 11:15",
        event: "Payment confirmed",
        status: "completed",
      },
      { date: "2024-12-04 14:20", event: "Order processing", status: "active" },
      { date: "Expected: 2024-12-06", event: "Shipped", status: "pending" },
      { date: "Expected: 2024-12-10", event: "Delivered", status: "pending" },
    ],
  });

  const [newNote, setNewNote] = useState("");
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleStatusUpdate = () => {
    alert(`Order status updated to: ${currentStatus}`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Note added: ${newNote}`);
      setNewNote("");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="page order-details-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <div>
          <button
            onClick={() => navigate("/orders")}
            style={{
              background: "transparent",
              color: "var(--primary)",
              border: "1px solid var(--primary)",
              marginBottom: "12px",
            }}>
            ← Back to Orders
          </button>
          <h2 style={{ margin: 0 }}>Order Details</h2>
          <p style={{ color: "#666", margin: "4px 0 0 0" }}>
            Order #{order.orderNumber}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handlePrintInvoice}
            style={{ background: "#6b7280" }}>
            🖨️ Print Invoice
          </button>
          <button style={{ background: "#3b82f6" }}>✉️ Email Customer</button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Order Items */}
          <section className="form-section">
            <h3>Order Items</h3>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Variant</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.variant}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                }}>
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                }}>
                <span>Shipping:</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                }}>
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "250px",
                    color: "#059669",
                  }}>
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                  fontSize: "18px",
                  fontWeight: "700",
                  paddingTop: "8px",
                  borderTop: "2px solid #111",
                }}>
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <section className="form-section">
            <h3>Customer Information</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                  }}>
                  Name
                </label>
                <p style={{ margin: 0 }}>{order.customer.name}</p>
              </div>
              <div>
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                  }}>
                  Email
                </label>
                <p style={{ margin: 0 }}>{order.customer.email}</p>
              </div>
              <div>
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                  }}>
                  Phone
                </label>
                <p style={{ margin: 0 }}>{order.customer.phone}</p>
              </div>
              <div>
                <label
                  style={{
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                  }}>
                  Address
                </label>
                <p style={{ margin: 0 }}>
                  {order.customer.address}
                  <br />
                  {order.customer.city}, {order.customer.state}{" "}
                  {order.customer.zip}
                  <br />
                  {order.customer.country}
                </p>
              </div>
            </div>
          </section>

          {/* Order Timeline */}
          <section className="form-section">
            <h3>Order Timeline</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {order.timeline.map((event, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px",
                    background:
                      event.status === "active" ? "#eff6ff" : "#f9fafb",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${
                      event.status === "completed"
                        ? "#10b981"
                        : event.status === "active"
                        ? "#3b82f6"
                        : "#d1d5db"
                    }`,
                  }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        event.status === "completed"
                          ? "#10b981"
                          : event.status === "active"
                          ? "#3b82f6"
                          : "#d1d5db",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}>
                    {event.status === "completed" ? "✓" : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "600" }}>
                      {event.event}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Order Status */}
          <section className="form-section">
            <h3>Order Status</h3>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              style={{ width: "100%", marginBottom: "12px" }}>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={handleStatusUpdate} style={{ width: "100%" }}>
              Update Status
            </button>
          </section>

          {/* Payment Info */}
          <section className="form-section">
            <h3>Payment Information</h3>
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}>
                Payment Method
              </label>
              <p style={{ margin: 0 }}>{order.paymentMethod}</p>
            </div>
            <div>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}>
                Payment Status
              </label>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "500",
                  background:
                    order.paymentStatus === "paid" ? "#d1fae5" : "#fee2e2",
                  color: order.paymentStatus === "paid" ? "#059669" : "#dc2626",
                }}>
                {order.paymentStatus.toUpperCase()}
              </span>
            </div>
          </section>

          {/* Shipping Info */}
          <section className="form-section">
            <h3>Shipping Information</h3>
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}>
                Shipping Method
              </label>
              <p style={{ margin: 0 }}>{order.shippingMethod}</p>
            </div>
            <div>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "4px",
                }}>
                Tracking Number
              </label>
              <p
                style={{
                  margin: 0,
                  padding: "8px",
                  background: "#f3f4f6",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "13px",
                }}>
                {order.trackingNumber}
              </p>
              <button
                style={{
                  width: "100%",
                  marginTop: "8px",
                  background: "#6b7280",
                }}>
                📦 Track Package
              </button>
            </div>
          </section>

          {/* Notes */}
          <section className="form-section">
            <h3>Order Notes</h3>
            {order.notes && (
              <div
                style={{
                  padding: "12px",
                  background: "#fef3c7",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}>
                📝 {order.notes}
              </div>
            )}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows="3"
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <button onClick={handleAddNote} style={{ width: "100%" }}>
              Add Note
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
