import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../redux/slices/categoriesSlice";
import { useAuth } from "../contexts/AuthContext";

/**
 * Categories page — manage product categories
 */
export default function Categories() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const categoriesState = useSelector(
    (state) => state.categories || { list: [], status: "idle", error: null }
  );
  const { list: categories = [], status } = categoriesState;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (editingId) {
      dispatch(updateCategory({ id: editingId, data }));
      setEditingId(null);
    } else {
      dispatch(addCategory(data));
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    reset(category);
    setShowForm(true);
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

  const handleDelete = (id) => {
    if (window.confirm("Delete category?")) {
      dispatch(deleteCategory(id));
    }
  };

  const paginatedCategories = categories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="page categories-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Categories</h2>
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
          ➕ Add New Category
        </button>
      </div>

      {showForm && (user?.role === "super_admin" || user?.role === "admin") && (
        <section className="form-section">
          <h3>{editingId ? "Edit Category" : "Add Category"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Name</label>
              <input {...register("name", { required: true })} />
              {errors.name && <span className="error">Name required</span>}
            </div>
            <div>
              <label>Description</label>
              <textarea
                {...register("description")}
                placeholder="Category description"
              />
            </div>
            <button type="submit">
              {editingId ? "Update" : "Add"} Category
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="list-section">
        <h3>Category List ({categories.length})</h3>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories yet.</p>
        ) : (
          <>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((c) => (
                  <tr key={c._id || c.id}>
                    <td>{c._id || c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.description}</td>
                    <td>
                      {(user?.role === "super_admin" ||
                        user?.role === "admin") && (
                        <>
                          <button onClick={() => handleEdit(c)}>Edit</button>
                          <button onClick={() => handleDelete(c._id || c.id)}>
                            Delete
                          </button>
                        </>
                      )}
                      {(user?.role === "store_admin" ||
                        user?.role === "editor") && (
                        <span style={{ color: "#999", fontSize: "14px" }}>
                          View Only
                        </span>
                      )}
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
                {page} / {totalPages}
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
