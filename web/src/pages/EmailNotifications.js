import React, { useState } from "react";

/**
 * Email Notifications — Manage email templates and notifications
 */
export default function EmailNotifications() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Order Confirmation",
      subject: "Your order has been confirmed - Order #{{orderNumber}}",
      type: "transactional",
      trigger: "order_placed",
      enabled: true,
      content:
        "Dear {{customerName}},\n\nThank you for your order! Your order #{{orderNumber}} has been confirmed.\n\nOrder Total: ${{orderTotal}}\n\nWe'll send you another email when your order ships.\n\nThank you for shopping with us!",
      lastSent: "2024-12-04",
      sentCount: 156,
    },
    {
      id: 2,
      name: "Shipping Notification",
      subject: "Your order has shipped - Track #{{trackingNumber}}",
      type: "transactional",
      trigger: "order_shipped",
      enabled: true,
      content:
        "Hello {{customerName}},\n\nGreat news! Your order #{{orderNumber}} has been shipped.\n\nTracking Number: {{trackingNumber}}\nExpected Delivery: {{expectedDelivery}}\n\nYou can track your package at: {{trackingUrl}}",
      lastSent: "2024-12-03",
      sentCount: 89,
    },
    {
      id: 3,
      name: "Welcome Email",
      subject: "Welcome to {{storeName}}!",
      type: "marketing",
      trigger: "customer_registered",
      enabled: true,
      content:
        "Welcome {{customerName}}!\n\nThank you for joining {{storeName}}. We're excited to have you!\n\nAs a welcome gift, here's a 10% discount code: WELCOME10\n\nHappy shopping!",
      lastSent: "2024-12-04",
      sentCount: 45,
    },
    {
      id: 4,
      name: "Abandoned Cart",
      subject: "You left something in your cart!",
      type: "marketing",
      trigger: "cart_abandoned",
      enabled: false,
      content:
        "Hi {{customerName}},\n\nWe noticed you left some items in your cart:\n\n{{cartItems}}\n\nCome back and complete your purchase! Your cart is waiting.\n\nUse code COMEBACK5 for 5% off.",
      lastSent: null,
      sentCount: 0,
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [emailLogs, setEmailLogs] = useState([
    {
      id: 1,
      template: "Order Confirmation",
      recipient: "john@example.com",
      status: "sent",
      date: "2024-12-04 10:30",
    },
    {
      id: 2,
      template: "Shipping Notification",
      recipient: "alice@example.com",
      status: "sent",
      date: "2024-12-03 15:20",
    },
    {
      id: 3,
      template: "Welcome Email",
      recipient: "bob@example.com",
      status: "failed",
      date: "2024-12-04 09:15",
    },
  ]);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (template) => {
    setEditingId(template.id);
    setCurrentTemplate({ ...template });
    setShowEditor(true);
  };

  const handleSave = () => {
    if (editingId) {
      setTemplates(
        templates.map((t) => (t.id === editingId ? currentTemplate : t))
      );
    } else {
      setTemplates([
        ...templates,
        {
          id: Date.now(),
          ...currentTemplate,
          sentCount: 0,
          lastSent: null,
          enabled: true,
        },
      ]);
    }
    setShowEditor(false);
    setEditingId(null);
    setCurrentTemplate(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const toggleEnabled = (id) => {
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleTestEmail = (template) => {
    const email = prompt("Enter email address to send test:");
    if (email) {
      alert(
        `Test email sent to ${email}!\n\nTemplate: ${template.name}\nSubject: ${template.subject}`
      );
    }
  };

  const enabledCount = templates.filter((t) => t.enabled).length;
  const totalSent = templates.reduce((sum, t) => sum + t.sentCount, 0);

  return (
    <div className="page email-notifications-page">
      <h2>Email Notifications</h2>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Templates</h4>
          <p className="kpi-value">{templates.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Active Templates</h4>
          <p className="kpi-value">{enabledCount}</p>
        </div>
        <div className="kpi-card">
          <h4>Emails Sent (Total)</h4>
          <p className="kpi-value">{totalSent}</p>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: showEditor ? "1fr 1fr" : "1fr",
          gap: "24px",
        }}>
        {/* Templates List */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}>
            <h3>Email Templates</h3>
            <button
              onClick={() => {
                setEditingId(null);
                setCurrentTemplate({
                  name: "",
                  subject: "",
                  type: "transactional",
                  trigger: "",
                  content: "",
                });
                setShowEditor(true);
              }}
              style={{
                padding: "8px 16px",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}>
              ➕ New Template
            </button>
          </div>

          <section className="search-filters">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="transactional">Transactional</option>
              <option value="marketing">Marketing</option>
            </select>
          </section>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "16px",
            }}>
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "white",
                }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "8px",
                  }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                      {template.name}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#666",
                        fontStyle: "italic",
                      }}>
                      {template.subject}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "500",
                        background:
                          template.type === "transactional"
                            ? "#dbeafe"
                            : "#fce7f3",
                        color:
                          template.type === "transactional"
                            ? "#1e40af"
                            : "#be185d",
                      }}>
                      {template.type}
                    </span>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}>
                      <input
                        type="checkbox"
                        checked={template.enabled}
                        onChange={() => toggleEnabled(template.id)}
                        style={{ marginRight: "4px" }}
                      />
                      Enabled
                    </label>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "12px",
                    paddingTop: "8px",
                    borderTop: "1px solid #f3f4f6",
                  }}>
                  <span>
                    📧 Sent: <strong>{template.sentCount}</strong>
                  </span>
                  <span>
                    🔔 Trigger:{" "}
                    <strong>{template.trigger.replace(/_/g, " ")}</strong>
                  </span>
                  {template.lastSent && (
                    <span>
                      📅 Last: <strong>{template.lastSent}</strong>
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEdit(template)}
                    style={{ flex: 1 }}>
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleTestEmail(template)}
                    style={{ flex: 1, background: "#3b82f6" }}>
                    📤 Test
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    style={{ background: "#ef4444" }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Editor */}
        {showEditor && currentTemplate && (
          <div>
            <section className="form-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}>
                <h3>{editingId ? "Edit Template" : "New Template"}</h3>
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setEditingId(null);
                    setCurrentTemplate(null);
                  }}
                  style={{
                    background: "transparent",
                    color: "#666",
                    border: "1px solid #ddd",
                  }}>
                  ✕ Close
                </button>
              </div>

              <div>
                <label>Template Name</label>
                <input
                  value={currentTemplate.name}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Order Confirmation"
                />
              </div>

              <div>
                <label>Email Subject</label>
                <input
                  value={currentTemplate.subject}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Use {{variables}} for dynamic content"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}>
                <div>
                  <label>Type</label>
                  <select
                    value={currentTemplate.type}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        type: e.target.value,
                      })
                    }>
                    <option value="transactional">Transactional</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label>Trigger Event</label>
                  <select
                    value={currentTemplate.trigger}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        trigger: e.target.value,
                      })
                    }>
                    <option value="">Select trigger</option>
                    <option value="order_placed">Order Placed</option>
                    <option value="order_shipped">Order Shipped</option>
                    <option value="order_delivered">Order Delivered</option>
                    <option value="customer_registered">
                      Customer Registered
                    </option>
                    <option value="cart_abandoned">Cart Abandoned</option>
                    <option value="password_reset">Password Reset</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Email Content</label>
                <textarea
                  value={currentTemplate.content}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      content: e.target.value,
                    })
                  }
                  rows="12"
                  placeholder="Write your email content here. Use {{variables}} for dynamic content."
                  style={{ fontFamily: "monospace", fontSize: "13px" }}
                />
              </div>

              <div
                style={{
                  padding: "12px",
                  background: "#f0f9ff",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}>
                <strong>Available Variables:</strong>
                <div
                  style={{
                    marginTop: "8px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                  <span>• {`{{customerName}}`}</span>
                  <span>• {`{{orderNumber}}`}</span>
                  <span>• {`{{orderTotal}}`}</span>
                  <span>• {`{{trackingNumber}}`}</span>
                  <span>• {`{{storeName}}`}</span>
                  <span>• {`{{productName}}`}</span>
                </div>
              </div>

              <button onClick={handleSave} style={{ width: "100%" }}>
                {editingId ? "Update Template" : "Create Template"}
              </button>
            </section>
          </div>
        )}
      </div>

      {/* Email Logs */}
      <section className="list-section" style={{ marginTop: "24px" }}>
        <h3>Recent Email Activity</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Template</th>
              <th>Recipient</th>
              <th>Status</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.template}</td>
                <td>{log.recipient}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: log.status === "sent" ? "#d1fae5" : "#fee2e2",
                      color: log.status === "sent" ? "#059669" : "#dc2626",
                    }}>
                    {log.status === "sent" ? "✓ Sent" : "✕ Failed"}
                  </span>
                </td>
                <td>{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
