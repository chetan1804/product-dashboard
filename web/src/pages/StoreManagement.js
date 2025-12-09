import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchStores,
  addStore,
  updateStore,
  deleteStore,
} from "../redux/slices/storeSlice";
import { useAuth } from "../contexts/AuthContext";

/**
 * Store Management — Multi-store configuration for super_admin
 */
export default function StoreManagement() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const storesState = useSelector(
    (state) => state.stores || { list: [], status: "idle" }
  );
  const { list: stores = [], status } = storesState;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Check authorization
  if (user?.role !== "super_admin") {
    return (
      <div className="page">
        <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
          <h2>🔒 Access Denied</h2>
          <p>Only super admins can manage stores.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStores());
    }
  }, [dispatch, status]);

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      !searchTerm ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || store.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = (data) => {
    if (editingId) {
      dispatch(updateStore({ id: editingId, storeData: data }));
      setEditingId(null);
    } else {
      dispatch(addStore(data));
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (store) => {
    setEditingId(store.id);
    reset(store);
    setShowForm(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}" store?`)) {
      dispatch(deleteStore(id));
    }
  };

  const activeStores = stores.filter((s) => s.status === "active").length;
  const totalRevenue = stores.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalOrders = stores.reduce((sum, s) => sum + s.totalOrders, 0);

  return (
    <div className="page store-management-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Store Management</h2>
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
          ➕ Add New Store
        </button>
      </div>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Stores</h4>
          <p className="kpi-value">{stores.length}</p>
        </div>
        <div className="kpi-card" style={{ background: "#d1fae5" }}>
          <h4>Active Stores</h4>
          <p className="kpi-value" style={{ color: "#059669" }}>
            {activeStores}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Total Revenue</h4>
          <p className="kpi-value">${totalRevenue.toFixed(0)}</p>
        </div>
        <div className="kpi-card">
          <h4>Total Orders</h4>
          <p className="kpi-value">{totalOrders}</p>
        </div>
      </section>

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Store" : "Add New Store"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Store Name</label>
                <input
                  {...register("name", { required: true })}
                  placeholder="e.g., New York Store"
                />
                {errors.name && (
                  <span className="error">Store name required</span>
                )}
              </div>
              <div>
                <label>Store Slug</label>
                <input
                  {...register("slug", { required: true })}
                  placeholder="e.g., ny-store"
                />
                {errors.slug && <span className="error">Slug required</span>}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Location</label>
                <input
                  {...register("location")}
                  placeholder="e.g., Downtown NY"
                />
              </div>
              <div>
                <label>City</label>
                <input {...register("city", { required: true })} />
                {errors.city && <span className="error">City required</span>}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>State</label>
                <input {...register("state")} placeholder="NY" maxLength="2" />
              </div>
              <div>
                <label>Zip Code</label>
                <input {...register("zip")} />
              </div>
              <div>
                <label>Phone</label>
                <input type="tel" {...register("phone")} />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                />
                {errors.email && <span className="error">Email required</span>}
              </div>
              <div>
                <label>Status</label>
                <select {...register("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label>Address</label>
              <input {...register("address")} placeholder="Street address" />
            </div>

            <button type="submit">
              {editingId ? "Update" : "Create"} Store
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
          placeholder="Search by store name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </section>

      <section className="list-section">
        <h3>Stores List ({filteredStores.length})</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>Store Name</th>
              <th>City</th>
              <th>Store Admin</th>
              <th>Status</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Editors</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => (
              <tr key={store.id}>
                <td>
                  <strong>{store.name}</strong>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "2px",
                    }}>
                    {store.location}
                  </div>
                </td>
                <td>
                  {store.city}, {store.state}
                </td>
                <td>{store.storeAdminName}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        store.status === "active"
                          ? "#d1fae5"
                          : store.status === "inactive"
                          ? "#f3f4f6"
                          : "#fee2e2",
                      color:
                        store.status === "active"
                          ? "#059669"
                          : store.status === "inactive"
                          ? "#374151"
                          : "#dc2626",
                    }}>
                    {store.status}
                  </span>
                </td>
                <td>{store.totalOrders}</td>
                <td>${store.totalRevenue.toFixed(0)}</td>
                <td>{store.activeEditors}</td>
                <td>{store.createdDate}</td>
                <td>
                  <button onClick={() => handleEdit(store)}>Edit</button>
                  <button onClick={() => handleDelete(store.id, store.name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
