import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { formatDate, formatId } from "../utils/formatters";

/**
 * Customers page — Manage customer data with advanced filters
 */
export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1234567890",
      totalOrders: 15,
      totalSpent: 1250.5,
      status: "active",
      joinedDate: "2024-01-15",
      storeId: 1, // Main Store NY
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1234567891",
      totalOrders: 8,
      totalSpent: 680.0,
      status: "active",
      joinedDate: "2024-02-20",
      storeId: 2, // Boston Store
    },
    {
      id: 3,
      name: "Carol White",
      email: "carol@example.com",
      phone: "+1234567892",
      totalOrders: 22,
      totalSpent: 3200.75,
      status: "vip",
      joinedDate: "2023-11-10",
      storeId: 1, // Main Store NY
    },
    {
      id: 4,
      name: "David Brown",
      email: "david@example.com",
      phone: "+1234567893",
      totalOrders: 5,
      totalSpent: 450.0,
      status: "active",
      joinedDate: "2024-03-10",
      storeId: 3, // LA Store
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const filteredCustomers = customers.filter((c) => {
    // Store filtering: store_admin and editor see only their store's customers
    const matchesStore =
      user?.role === "super_admin" || user?.role === "admin"
        ? true
        : c.storeId === user?.storeId;
    const matchesSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesStore && matchesSearch && matchesStatus;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const onSubmit = (data) => {
    if (editingId) {
      setCustomers(
        customers.map((c) => (c.id === editingId ? { ...c, ...data } : c))
      );
      setEditingId(null);
    } else {
      setCustomers([
        ...customers,
        {
          id: Date.now(),
          ...data,
          totalOrders: 0,
          totalSpent: 0,
          joinedDate: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    reset(customer);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="page customers-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Customers</h2>
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
          ➕ Add New Customer
        </button>
      </div>

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Customer" : "Add New Customer"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Name</label>
              <input {...register("name", { required: true })} />
              {errors.name && <span className="error">Name is required</span>}
            </div>
            <div>
              <label>Email</label>
              <input type="email" {...register("email", { required: true })} />
              {errors.email && <span className="error">Email is required</span>}
            </div>
            <div>
              <label>Phone</label>
              <input {...register("phone")} placeholder="+1234567890" />
            </div>
            <div>
              <label>Status</label>
              <select {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <button type="submit">
              {editingId ? "Update" : "Add"} Customer
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
          placeholder="Search by name or email..."
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
          <option value="vip">VIP</option>
        </select>
      </section>

      <section className="list-section">
        <h3>Customer List ({filteredCustomers.length})</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((c) => (
              <tr key={c._id || c.id}>
                <td>{formatId(c._id || c.id)}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.totalOrders}</td>
                <td>${c.totalSpent?.toFixed(2)}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        c.status === "vip"
                          ? "#fef3c7"
                          : c.status === "active"
                          ? "#dbeafe"
                          : "#f3f4f6",
                      color:
                        c.status === "vip"
                          ? "#92400e"
                          : c.status === "active"
                          ? "#1e3a8a"
                          : "#374151",
                    }}>
                    {c.status}
                  </span>
                </td>
                <td>{formatDate(c.joinedDate || c.createdAt)}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Edit</button>
                  <button onClick={() => handleDelete(c._id || c.id)}>
                    Delete
                  </button>
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
