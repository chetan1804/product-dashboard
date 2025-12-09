import React, { useState } from "react";

/**
 * Customer Segmentation — Advanced customer grouping by behavior, purchase history, and value
 */
export default function CustomerSegmentation() {
  const [segments, setSegments] = useState([
    {
      id: 1,
      name: "VIP Customers",
      description: "High-value customers with 10+ orders",
      criteria: "totalOrders >= 10",
      size: 12,
      totalSpent: 15842.5,
      avgOrderValue: 1320.21,
      lastOrderDays: 5,
      retentionRate: 95,
      growth: "+12%",
    },
    {
      id: 2,
      name: "At-Risk Customers",
      description: "Inactive customers with no orders in 90+ days",
      criteria: "lastOrderDays >= 90",
      size: 34,
      totalSpent: 4250.0,
      avgOrderValue: 125.0,
      lastOrderDays: 127,
      retentionRate: 15,
      growth: "-8%",
    },
    {
      id: 3,
      name: "New Customers",
      description: "Customers with 1-2 orders in last 30 days",
      criteria: "totalOrders <= 2 AND accountAgeDays <= 30",
      size: 23,
      totalSpent: 1456.75,
      avgOrderValue: 728.38,
      lastOrderDays: 8,
      retentionRate: 65,
      growth: "+25%",
    },
    {
      id: 4,
      name: "Frequent Buyers",
      description: "Customers with 5-9 orders",
      criteria: "totalOrders BETWEEN 5 AND 9",
      size: 45,
      totalSpent: 22145.0,
      avgOrderValue: 492.11,
      lastOrderDays: 15,
      retentionRate: 78,
      growth: "+5%",
    },
  ]);

  const [customers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      segment: "VIP Customers",
      totalOrders: 15,
      totalSpent: 5240.0,
      lastOrderDays: 3,
    },
    {
      id: 2,
      name: "Alice Johnson",
      email: "alice@example.com",
      segment: "Frequent Buyers",
      totalOrders: 7,
      totalSpent: 3450.0,
      lastOrderDays: 12,
    },
    {
      id: 3,
      name: "Bob Smith",
      email: "bob@example.com",
      segment: "At-Risk Customers",
      totalOrders: 2,
      totalSpent: 450.0,
      lastOrderDays: 120,
    },
    {
      id: 4,
      name: "Carol White",
      email: "carol@example.com",
      segment: "New Customers",
      totalOrders: 1,
      totalSpent: 125.0,
      lastOrderDays: 5,
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      segment: "VIP Customers",
      totalOrders: 22,
      totalSpent: 8900.0,
      lastOrderDays: 2,
    },
  ]);

  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState("");
  const [newSegmentDesc, setNewSegmentDesc] = useState("");
  const [newSegmentCriteria, setNewSegmentCriteria] = useState("");

  const handleCreateSegment = () => {
    if (newSegmentName.trim()) {
      setSegments([
        ...segments,
        {
          id: Date.now(),
          name: newSegmentName,
          description: newSegmentDesc,
          criteria: newSegmentCriteria,
          size: Math.floor(Math.random() * 50),
          totalSpent: Math.floor(Math.random() * 50000),
          avgOrderValue: Math.floor(Math.random() * 1000),
          lastOrderDays: Math.floor(Math.random() * 180),
          retentionRate: Math.floor(Math.random() * 100),
          growth:
            (Math.random() > 0.5 ? "+" : "-") +
            Math.floor(Math.random() * 20) +
            "%",
        },
      ]);
      setNewSegmentName("");
      setNewSegmentDesc("");
      setNewSegmentCriteria("");
      setShowNewForm(false);
    }
  };

  const handleDeleteSegment = (id) => {
    if (window.confirm("Delete this segment?")) {
      setSegments(segments.filter((s) => s.id !== id));
    }
  };

  const segmentCustomers = selectedSegment
    ? customers.filter((c) => c.segment === selectedSegment.name)
    : [];

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgCustomerValue = (totalRevenue / totalCustomers).toFixed(2);

  return (
    <div className="page segmentation-page">
      <h2>Customer Segmentation</h2>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Customers</h4>
          <p className="kpi-value">{totalCustomers}</p>
        </div>
        <div className="kpi-card">
          <h4>Total Revenue</h4>
          <p className="kpi-value">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <h4>Avg Customer Value</h4>
          <p className="kpi-value">${avgCustomerValue}</p>
        </div>
        <div className="kpi-card">
          <h4>Total Segments</h4>
          <p className="kpi-value">{segments.length}</p>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}>
        {/* Segments List */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}>
            <h3>Segments</h3>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
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
              ➕ New Segment
            </button>
          </div>

          {showNewForm && (
            <section className="form-section">
              <h4>Create New Segment</h4>
              <div>
                <label>Segment Name</label>
                <input
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  placeholder="e.g., Premium Members"
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  value={newSegmentDesc}
                  onChange={(e) => setNewSegmentDesc(e.target.value)}
                  placeholder="Describe this segment..."
                  rows="3"
                />
              </div>
              <div>
                <label>Criteria (SQL-like)</label>
                <textarea
                  value={newSegmentCriteria}
                  onChange={(e) => setNewSegmentCriteria(e.target.value)}
                  placeholder="e.g., totalOrders >= 10 AND totalSpent > 1000"
                  rows="2"
                  style={{ fontFamily: "monospace", fontSize: "12px" }}
                />
              </div>
              <button
                onClick={handleCreateSegment}
                style={{ width: "100%", marginBottom: "8px" }}>
                Create Segment
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                style={{ width: "100%", background: "#6b7280" }}>
                Cancel
              </button>
            </section>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {segments.map((segment) => (
              <div
                key={segment.id}
                onClick={() => setSelectedSegment(segment)}
                style={{
                  border:
                    selectedSegment?.id === segment.id
                      ? "2px solid var(--primary)"
                      : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  background:
                    selectedSegment?.id === segment.id ? "#f0f9ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "8px",
                  }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px" }}>
                      {segment.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                      {segment.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSegment(segment.id);
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                    }}>
                    ✕
                  </button>
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
                    <span style={{ color: "#666" }}>Customers:</span>
                    <strong> {segment.size}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Total Spent:</span>
                    <strong> ${segment.totalSpent.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Avg Order:</span>
                    <strong> ${segment.avgOrderValue.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#666" }}>Retention:</span>
                    <strong> {segment.retentionRate}%</strong>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "#666" }}>Growth:</span>
                    <strong
                      style={{
                        color: segment.growth.includes("+")
                          ? "#059669"
                          : "#dc2626",
                      }}>
                      {" "}
                      {segment.growth}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Segment Details */}
        <div>
          {selectedSegment ? (
            <section className="form-section">
              <h3>{selectedSegment.name}</h3>
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "#374151",
                  }}>
                  {selectedSegment.criteria}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}>
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
                      color: "#1e40af",
                    }}>
                    Customers
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#1e40af",
                    }}>
                    {selectedSegment.size}
                  </p>
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "#d1fae5",
                    borderRadius: "8px",
                  }}>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "13px",
                      color: "#059669",
                    }}>
                    Revenue
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#059669",
                    }}>
                    ${selectedSegment.totalSpent.toFixed(0)}
                  </p>
                </div>
              </div>

              <h4 style={{ marginBottom: "12px" }}>
                Customers in this segment:
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}>
                {segmentCustomers.length > 0 ? (
                  segmentCustomers.map((cust) => (
                    <div
                      key={cust.id}
                      style={{
                        padding: "12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        background: "white",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}>
                        <div>
                          <p
                            style={{
                              margin: "0 0 2px 0",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}>
                            {cust.name}
                          </p>
                          <p
                            style={{
                              margin: "0 0 4px 0",
                              fontSize: "12px",
                              color: "#666",
                            }}>
                            {cust.email}
                          </p>
                        </div>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            background: "#f3f4f6",
                            color: "#374151",
                          }}>
                          {cust.totalOrders} orders
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "6px",
                        }}>
                        Spent: ${cust.totalSpent.toFixed(2)} • Last order:{" "}
                        {cust.lastOrderDays}d ago
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#666", fontSize: "13px" }}>
                    No customers in this segment
                  </p>
                )}
              </div>

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  background: "#fef3c7",
                  borderRadius: "8px",
                }}>
                <strong style={{ color: "#92400e" }}>💡 Action Items:</strong>
                <ul
                  style={{
                    margin: "8px 0 0 0",
                    paddingLeft: "20px",
                    fontSize: "13px",
                    color: "#92400e",
                  }}>
                  <li>Send targeted email campaign</li>
                  <li>Offer segment-specific discount</li>
                  <li>Personalize product recommendations</li>
                  <li>Schedule re-engagement outreach</li>
                </ul>
              </div>
            </section>
          ) : (
            <section className="form-section">
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  textAlign: "center",
                  padding: "40px 20px",
                }}>
                👈 Select a segment to view details
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
