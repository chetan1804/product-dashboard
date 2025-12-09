import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../redux/slices/usersSlice";
import { useAuth } from "../contexts/AuthContext";
import { formatId } from "../utils/formatters";

/**
 * Users page — CRUD with filters and role management
 */
export default function Users() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const usersState = useSelector(
    (state) => state.users || { list: [], status: "idle", error: null }
  );
  const { list: users = [], status, error } = usersState;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [editingId, setEditingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 10;

  const roles = ["super_admin", "admin", "store_admin", "editor"];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter((u) => {
    // Store filtering: store_admin sees only editors from their store
    const matchesStore =
      user?.role === "super_admin" || user?.role === "admin"
        ? true
        : u.storeId === user?.storeId;
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesSearch =
      !searchTerm ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStore && matchesRole && matchesSearch;
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const onSubmit = async (data) => {
    if (editingId) {
      await dispatch(updateUser({ id: editingId, data }));
      setEditingId(null);
    } else {
      await dispatch(addUser(data));
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    reset(user);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
    setShowForm(false);
  };

  return (
    <div className="page users-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Users Management</h2>
        <button
          onClick={handleAddNew}
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
            transition: "var(--transition)",
          }}>
          ➕ Add New User
        </button>
      </div>

      {error && <div className="error-alert alert-error">{error}</div>}

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit User" : "Add New User"}</h3>
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
              <label>Role</label>
              <select {...register("role", { required: true })}>
                <option value="">Select role...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && <span className="error">Role is required</span>}
            </div>
            {!editingId && (
              <div>
                <label>Password</label>
                <input
                  type="password"
                  {...register("password", { required: !editingId })}
                />
                {errors.password && (
                  <span className="error">Password is required</span>
                )}
              </div>
            )}
            <button type="submit">{editingId ? "Update" : "Add"} User</button>
            <button type="button" onClick={handleCancel}>
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
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </section>

      <section className="list-section">
        <h3>User List ({filteredUsers.length})</h3>
        {status === "loading" ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users yet.</p>
        ) : (
          <>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>{formatId(u._id || u.id)}</td>
                    <td>{u.name}</td>
                    <td>{u.email || "N/A"}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          background:
                            u.role === "superadmin"
                              ? "#fef3c7"
                              : u.role === "admin"
                              ? "#dbeafe"
                              : u.role === "storeadmin"
                              ? "#ede9fe"
                              : "#f3f4f6",
                          color:
                            u.role === "superadmin"
                              ? "#92400e"
                              : u.role === "admin"
                              ? "#1e3a8a"
                              : u.role === "storeadmin"
                              ? "#5b21b6"
                              : "#374151",
                        }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(u)}>Edit</button>
                      <button onClick={() => handleDelete(u._id || u.id)}>
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
          </>
        )}
      </section>
    </div>
  );
}
