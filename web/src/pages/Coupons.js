import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

/**
 * Coupons & Discounts — Manage promotional codes and discounts
 */
export default function Coupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "WELCOME10",
      description: "10% off for new customers",
      type: "percentage",
      value: 10,
      minPurchase: 50,
      maxDiscount: 100,
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      usageLimit: 100,
      usedCount: 23,
      status: "active",
      storeId: null, // Global coupon
    },
    {
      id: 2,
      code: "SAVE50",
      description: "$50 off orders over $200",
      type: "fixed",
      value: 50,
      minPurchase: 200,
      maxDiscount: null,
      startDate: "2024-12-01",
      endDate: "2024-12-15",
      usageLimit: 50,
      usedCount: 48,
      status: "active",
      storeId: 1, // Store-specific coupon
    },
    {
      id: 3,
      code: "FREESHIP",
      description: "Free shipping on all orders",
      type: "free_shipping",
      value: 0,
      minPurchase: 0,
      maxDiscount: null,
      startDate: "2024-11-01",
      endDate: "2024-11-30",
      usageLimit: null,
      usedCount: 156,
      status: "expired",
      storeId: null, // Global coupon
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const couponType = watch("type");

  const filteredCoupons = coupons.filter((c) => {
    // Store filtering: store_admin sees only their store coupons + global coupons (storeId = null)
    const matchesStore =
      user?.role === "super_admin" || user?.role === "admin"
        ? true
        : c.storeId === null || c.storeId === user?.storeId;
    const matchesSearch =
      !searchTerm ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesStore && matchesSearch && matchesStatus;
  });

  const paginatedCoupons = filteredCoupons.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  const onSubmit = (data) => {
    if (editingId) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...data,
                usedCount: c.usedCount,
              }
            : c
        )
      );
      setEditingId(null);
    } else {
      setCoupons([
        ...coupons,
        {
          id: Date.now(),
          ...data,
          usedCount: 0,
          status: "active",
        },
      ]);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    reset(coupon);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this coupon?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setCoupons(
      coupons.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  };

  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="page coupons-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Coupons & Discounts</h2>
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
          ➕ Create Coupon
        </button>
      </div>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Coupons</h4>
          <p className="kpi-value">{coupons.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Active Coupons</h4>
          <p className="kpi-value">{activeCoupons}</p>
        </div>
        <div className="kpi-card">
          <h4>Total Usage</h4>
          <p className="kpi-value">{totalUsage}</p>
        </div>
      </section>

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Coupon" : "Create New Coupon"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Coupon Code</label>
                <input
                  {...register("code", { required: true })}
                  placeholder="e.g. SAVE20"
                  style={{ textTransform: "uppercase" }}
                />
                {errors.code && <span className="error">Code is required</span>}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    const code = generateRandomCode();
                    reset({ ...watch(), code });
                  }}
                  style={{ width: "100%", background: "#6b7280" }}>
                  🎲 Generate
                </button>
              </div>
            </div>

            <div>
              <label>Description</label>
              <input
                {...register("description", { required: true })}
                placeholder="Brief description of the offer"
              />
              {errors.description && (
                <span className="error">Description is required</span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Discount Type</label>
                <select {...register("type", { required: true })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
                {errors.type && <span className="error">Type is required</span>}
              </div>
              {couponType !== "free_shipping" && (
                <div>
                  <label>Discount Value</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("value", {
                      required: couponType !== "free_shipping",
                    })}
                    placeholder={
                      couponType === "percentage" ? "e.g. 10" : "e.g. 50"
                    }
                  />
                  {errors.value && (
                    <span className="error">Value is required</span>
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Minimum Purchase ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("minPurchase")}
                  placeholder="0 for no minimum"
                />
              </div>
              <div>
                <label>Max Discount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("maxDiscount")}
                  placeholder="Leave empty for no limit"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  {...register("startDate", { required: true })}
                />
                {errors.startDate && (
                  <span className="error">Start date is required</span>
                )}
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  {...register("endDate", { required: true })}
                />
                {errors.endDate && (
                  <span className="error">End date is required</span>
                )}
              </div>
              <div>
                <label>Usage Limit</label>
                <input
                  type="number"
                  {...register("usageLimit")}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <button type="submit">
              {editingId ? "Update" : "Create"} Coupon
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
          placeholder="Search by code or description..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </section>

      <section className="list-section">
        <h3>Coupon List ({filteredCoupons.length})</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Purchase</th>
              <th>Usage</th>
              <th>Valid Period</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoupons.map((coupon) => {
              const isExpired = new Date(coupon.endDate) < new Date();
              const isLimitReached =
                coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
              const usagePercent = coupon.usageLimit
                ? Math.round((coupon.usedCount / coupon.usageLimit) * 100)
                : 0;

              return (
                <tr key={coupon.id}>
                  <td>
                    <strong
                      style={{
                        fontFamily: "monospace",
                        fontSize: "14px",
                        padding: "4px 8px",
                        background: "#f3f4f6",
                        borderRadius: "4px",
                      }}>
                      {coupon.code}
                    </strong>
                  </td>
                  <td>{coupon.description}</td>
                  <td>
                    <span style={{ textTransform: "capitalize" }}>
                      {coupon.type.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : coupon.type === "fixed"
                      ? `$${coupon.value}`
                      : "Free"}
                  </td>
                  <td>${coupon.minPurchase || 0}</td>
                  <td>
                    <div>
                      <span>{coupon.usedCount}</span>
                      {coupon.usageLimit && (
                        <span style={{ color: "#666" }}>
                          {" "}
                          / {coupon.usageLimit}
                        </span>
                      )}
                    </div>
                    {coupon.usageLimit && (
                      <div
                        style={{
                          width: "100%",
                          height: "4px",
                          background: "#e5e7eb",
                          borderRadius: "2px",
                          marginTop: "4px",
                        }}>
                        <div
                          style={{
                            width: `${usagePercent}%`,
                            height: "100%",
                            background:
                              usagePercent >= 90 ? "#ef4444" : "#3b82f6",
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: "13px" }}>
                    {coupon.startDate}
                    <br />
                    to
                    <br />
                    {coupon.endDate}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background:
                          isExpired || isLimitReached
                            ? "#fee2e2"
                            : coupon.status === "active"
                            ? "#d1fae5"
                            : "#f3f4f6",
                        color:
                          isExpired || isLimitReached
                            ? "#dc2626"
                            : coupon.status === "active"
                            ? "#059669"
                            : "#374151",
                      }}>
                      {isExpired
                        ? "Expired"
                        : isLimitReached
                        ? "Limit Reached"
                        : coupon.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(coupon)}>Edit</button>
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      style={{
                        background:
                          coupon.status === "active" ? "#f59e0b" : "#10b981",
                      }}>
                      {coupon.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => handleDelete(coupon.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
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
