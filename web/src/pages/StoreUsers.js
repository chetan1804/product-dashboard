import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

/**
 * Store Users (Editors) Management — For store_admin to manage editors in their store
 */
export default function StoreUsers() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: editingUser?.name || "",
      email: editingUser?.email || "",
      role: "editor",
      status: "active",
    },
  });

  // Check authorization - only store_admin can manage users
  if (user?.role !== "store_admin") {
    return (
      <div className="page">
        <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
          <h2>🔒 Access Denied</h2>
          <p>Only store admins can manage store users.</p>
        </div>
      </div>
    );
  }

  // Mock data for store editors (in real app, this would come from Redux + API)
  const [editors, setEditors] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@store.com",
      role: "editor",
      status: "active",
      joinedDate: "2024-01-15",
      productsEdited: 24,
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@store.com",
      role: "editor",
      status: "active",
      joinedDate: "2024-02-01",
      productsEdited: 18,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@store.com",
      role: "editor",
      status: "inactive",
      joinedDate: "2023-11-20",
      productsEdited: 42,
    },
  ]);

  const handleAddUser = (data) => {
    if (editingUser) {
      // Update existing
      setEditors(
        editors.map((e) =>
          e.id === editingUser.id ? { ...e, ...data, id: e.id } : e
        )
      );
      setEditingUser(null);
    } else {
      // Add new
      setEditors([
        ...editors,
        {
          ...data,
          id: Math.max(...editors.map((e) => e.id), 0) + 1,
          joinedDate: new Date().toISOString().split("T")[0],
          productsEdited: 0,
        },
      ]);
    }
    reset();
    setIsFormOpen(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this editor?")) {
      setEditors(editors.filter((e) => e.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    reset();
    setIsFormOpen(false);
  };

  // Filter editors
  const filteredEditors = editors.filter((editor) => {
    const matchesSearch =
      editor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      editor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "all" || editor.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page">
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 8px 0" }}>👥 Manage Store Editors</h2>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          Add and manage editors who can edit products for your store
        </p>
      </div>

      {/* KPI Cards */}
      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Editors</h4>
          <p className="kpi-value">{editors.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Active Editors</h4>
          <p className="kpi-value">
            {editors.filter((e) => e.status === "active").length}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Products Edited</h4>
          <p className="kpi-value">
            {editors.reduce((sum, e) => sum + e.productsEdited, 0)}
          </p>
        </div>
      </section>

      {/* Add Editor Button & Search Bar */}
      <section className="form-section" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}>
          <div style={{ flex: 1, display: "flex", gap: "12px" }}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                minWidth: "140px",
              }}>
              <option value="all">All Roles</option>
              <option value="editor">Editors</option>
            </select>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              background: "var(--primary)",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}>
            ➕ Add Editor
          </button>
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <div
            style={{
              background: "#f9fafb",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              marginBottom: "20px",
            }}>
            <h3 style={{ marginTop: 0 }}>
              {editingUser ? "Edit Editor" : "Add New Editor"}
            </h3>
            <form onSubmit={handleSubmit(handleAddUser)}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: errors.name
                        ? "1px solid #dc2626"
                        : "1px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.name && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: errors.email
                        ? "1px solid #dc2626"
                        : "1px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.email && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    {...register("status")}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                    }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}>
                  {editingUser ? "Update Editor" : "Add Editor"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: "#e5e7eb",
                    color: "#333",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Editors Table */}
      <section className="form-section">
        {filteredEditors.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#999",
            }}>
            <p>
              No editors found.{" "}
              {!isFormOpen && "Click 'Add Editor' to create one."}
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "2px solid #e5e7eb",
                }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Name
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Email
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Role
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Status
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Products Edited
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Joined Date
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    fontWeight: "700",
                  }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEditors.map((editor) => (
                <tr
                  key={editor.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }>
                  <td style={{ padding: "12px" }}>
                    <strong>{editor.name}</strong>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#666",
                      fontSize: "14px",
                    }}>
                    {editor.email}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background: "#e0e7ff",
                        color: "#4338ca",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}>
                      {editor.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background:
                          editor.status === "active" ? "#dcfce7" : "#fecaca",
                        color:
                          editor.status === "active" ? "#166534" : "#dc2626",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}>
                      {editor.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#666",
                    }}>
                    {editor.productsEdited}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "#666",
                      fontSize: "14px",
                    }}>
                    {editor.joinedDate}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(editor)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#3b82f6",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginRight: "12px",
                      }}>
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(editor.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}>
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
