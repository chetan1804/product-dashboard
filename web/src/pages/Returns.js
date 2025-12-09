import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

/**
 * Returns & Refunds Management — Handle product returns, RMA tracking, and refund processing
 */
export default function Returns() {
  const { user } = useAuth();
  const [returns, setReturns] = useState([
    {
      id: 1,
      rmaNumber: "RMA-2024-001",
      orderNumber: "ORD-2024-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      productName: "Laptop Pro 15",
      quantity: 1,
      reason: "defective",
      status: "pending",
      returnDate: "2024-12-01",
      refundAmount: 1299.99,
      refundStatus: "pending",
      notes: "Screen flickering issue",
      resolutionType: "refund",
      storeId: 1,
    },
    {
      id: 2,
      rmaNumber: "RMA-2024-002",
      orderNumber: "ORD-2024-002",
      customerName: "Alice Johnson",
      customerEmail: "alice@example.com",
      productName: "Wireless Mouse",
      quantity: 2,
      reason: "not_as_described",
      status: "approved",
      returnDate: "2024-12-02",
      refundAmount: 59.98,
      refundStatus: "processing",
      notes: "Different color received",
      resolutionType: "refund",
      storeId: 2,
    },
    {
      id: 3,
      rmaNumber: "RMA-2024-003",
      orderNumber: "ORD-2024-003",
      customerName: "Bob Smith",
      customerEmail: "bob@example.com",
      productName: "USB-C Cable",
      quantity: 3,
      reason: "damaged",
      status: "received",
      returnDate: "2024-12-03",
      refundAmount: 29.97,
      refundStatus: "completed",
      notes: "Package arrived damaged",
      resolutionType: "replacement",
      storeId: 1,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const reasons = [
    { value: "defective", label: "Defective/Not Working" },
    { value: "not_as_described", label: "Not As Described" },
    { value: "damaged", label: "Damaged" },
    { value: "wrong_item", label: "Wrong Item Received" },
    { value: "changed_mind", label: "Changed Mind" },
    { value: "other", label: "Other" },
  ];

  const returnStatuses = [
    "pending",
    "approved",
    "rejected",
    "received",
    "shipped",
  ];
  const refundStatuses = ["pending", "processing", "completed", "failed"];
  const resolutionTypes = ["refund", "replacement", "store_credit"];

  const filteredReturns = returns.filter((r) => {
    // Store filtering: store_admin sees only returns from their store
    const matchesStore =
      user?.role === "super_admin" || user?.role === "admin"
        ? true
        : r.storeId === user?.storeId;
    const matchesSearch =
      !searchTerm ||
      r.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesReason = !reasonFilter || r.reason === reasonFilter;
    return matchesStore && matchesSearch && matchesStatus && matchesReason;
  });

  const paginatedReturns = filteredReturns.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

  const onSubmit = (data) => {
    if (editingId) {
      setReturns(
        returns.map((r) => (r.id === editingId ? { ...r, ...data } : r))
      );
      setEditingId(null);
    } else {
      setReturns([
        ...returns,
        {
          id: Date.now(),
          ...data,
          status: "pending",
          refundStatus: "pending",
        },
      ]);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (returnItem) => {
    setEditingId(returnItem.id);
    reset(returnItem);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this return request?")) {
      setReturns(returns.filter((r) => r.id !== id));
    }
  };

  const handleGenerateLabel = (returnItem) => {
    alert(
      `Shipping label generated for RMA ${returnItem.rmaNumber}\n\nLabel printed to default printer.`
    );
  };

  const pendingCount = returns.filter((r) => r.status === "pending").length;
  const approvedCount = returns.filter((r) => r.status === "approved").length;
  const totalRefunds = returns.reduce((sum, r) => sum + r.refundAmount, 0);

  return (
    <div className="page returns-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Returns & Refunds</h2>
        <button
          onClick={() => {
            setEditingId(null);
            reset();
            setShowForm(true);
          }}
          style={{
            padding: "10px 20px",
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
          }}>
          ➕ New Return Request
        </button>
      </div>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Returns</h4>
          <p className="kpi-value">{returns.length}</p>
        </div>
        <div className="kpi-card" style={{ background: "#fef3c7" }}>
          <h4>Pending Review</h4>
          <p className="kpi-value" style={{ color: "#92400e" }}>
            {pendingCount}
          </p>
        </div>
        <div className="kpi-card" style={{ background: "#d1fae5" }}>
          <h4>Approved</h4>
          <p className="kpi-value" style={{ color: "#059669" }}>
            {approvedCount}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Total Refunds</h4>
          <p className="kpi-value">${totalRefunds.toFixed(2)}</p>
        </div>
      </section>

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Return" : "Create New Return Request"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>RMA Number</label>
                <input
                  {...register("rmaNumber", { required: true })}
                  placeholder="RMA-2024-XXX"
                />
                {errors.rmaNumber && (
                  <span className="error">RMA number required</span>
                )}
              </div>
              <div>
                <label>Order Number</label>
                <input
                  {...register("orderNumber", { required: true })}
                  placeholder="ORD-2024-XXX"
                />
                {errors.orderNumber && (
                  <span className="error">Order number required</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Customer Name</label>
                <input {...register("customerName", { required: true })} />
                {errors.customerName && (
                  <span className="error">Customer name required</span>
                )}
              </div>
              <div>
                <label>Customer Email</label>
                <input
                  type="email"
                  {...register("customerEmail", { required: true })}
                />
                {errors.customerEmail && (
                  <span className="error">Email required</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Product Name</label>
                <input {...register("productName", { required: true })} />
                {errors.productName && (
                  <span className="error">Product name required</span>
                )}
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  {...register("quantity", { required: true })}
                />
                {errors.quantity && (
                  <span className="error">Quantity required</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Return Reason</label>
                <select {...register("reason", { required: true })}>
                  <option value="">Select reason</option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <span className="error">Reason required</span>
                )}
              </div>
              <div>
                <label>Refund Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("refundAmount", { required: true })}
                />
                {errors.refundAmount && (
                  <span className="error">Amount required</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Resolution Type</label>
                <select {...register("resolutionType", { required: true })}>
                  {resolutionTypes.map((rt) => (
                    <option key={rt} value={rt}>
                      {rt.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Return Date</label>
                <input
                  type="date"
                  {...register("returnDate", { required: true })}
                />
                {errors.returnDate && (
                  <span className="error">Date required</span>
                )}
              </div>
            </div>

            <div>
              <label>Customer Notes</label>
              <textarea
                {...register("notes")}
                placeholder="Describe the issue or reason for return..."
                rows="4"
              />
            </div>

            <button type="submit">
              {editingId ? "Update" : "Create"} Return
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                reset();
              }}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="search-filters">
        <input
          type="text"
          placeholder="Search by RMA, customer, or product..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Status</option>
          {returnStatuses.map((st) => (
            <option key={st} value={st}>
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={reasonFilter}
          onChange={(e) => {
            setReasonFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Reasons</option>
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </section>

      <section className="list-section">
        <h3>Return Requests ({filteredReturns.length})</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>RMA</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Reason</th>
              <th>Refund</th>
              <th>Status</th>
              <th>Refund Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReturns.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.rmaNumber}</strong>
                </td>
                <td>{r.orderNumber}</td>
                <td>{r.customerName}</td>
                <td>{r.productName}</td>
                <td>{reasons.find((rs) => rs.value === r.reason)?.label}</td>
                <td>${r.refundAmount.toFixed(2)}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        r.status === "pending"
                          ? "#fef3c7"
                          : r.status === "approved"
                          ? "#d1fae5"
                          : r.status === "rejected"
                          ? "#fee2e2"
                          : "#dbeafe",
                      color:
                        r.status === "pending"
                          ? "#92400e"
                          : r.status === "approved"
                          ? "#059669"
                          : r.status === "rejected"
                          ? "#dc2626"
                          : "#1e40af",
                    }}>
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        r.refundStatus === "completed" ? "#d1fae5" : "#fef3c7",
                      color:
                        r.refundStatus === "completed" ? "#059669" : "#92400e",
                    }}>
                    {r.refundStatus}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(r)}>Edit</button>
                  <button
                    onClick={() => handleGenerateLabel(r)}
                    style={{ background: "#3b82f6" }}>
                    📦 Label
                  </button>
                  <button onClick={() => handleDelete(r)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
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
