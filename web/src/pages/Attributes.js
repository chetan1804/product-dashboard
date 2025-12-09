import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
} from "../redux/slices/attributesSlice";
import { useAuth } from "../contexts/AuthContext";

/**
 * Attributes page — manage product attributes (e.g., color, size, weight)
 */
export default function Attributes() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const attributesState = useSelector(
    (state) => state.attributes || { list: [], status: "idle", error: null }
  );
  const { list: attributes = [], status } = attributesState;
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
    dispatch(fetchAttributes());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (editingId) {
      dispatch(updateAttribute({ id: editingId, data }));
      setEditingId(null);
    } else {
      dispatch(addAttribute(data));
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (attribute) => {
    setEditingId(attribute.id);
    reset(attribute);
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
    if (window.confirm("Delete attribute?")) {
      dispatch(deleteAttribute(id));
    }
  };

  const paginatedAttributes = attributes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(attributes.length / itemsPerPage);

  return (
    <div className="page attributes-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Attributes</h2>
        {(user?.role === "super_admin" || user?.role === "admin") && (
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
            ➕ Add New Attribute
          </button>
        )}
      </div>

      {showForm && (user?.role === "super_admin" || user?.role === "admin") && (
        <section className="form-section">
          <h3>{editingId ? "Edit Attribute" : "Add Attribute"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Name</label>
              <input
                {...register("name", { required: true })}
                placeholder="e.g. Color, Size, Weight"
              />
              {errors.name && <span className="error">Name required</span>}
            </div>
            <div>
              <label>Type</label>
              <select {...register("type")}>
                <option value="">Select Type</option>
                <option value="text">Text</option>
                <option value="color">Color</option>
                <option value="size">Size</option>
                <option value="number">Number</option>
              </select>
            </div>
            <div>
              <label>Options (comma-separated)</label>
              <input
                {...register("options")}
                placeholder="e.g. Red, Blue, Green"
              />
            </div>
            <button type="submit">
              {editingId ? "Update" : "Add"} Attribute
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="list-section">
        <h3>Attribute List ({attributes.length})</h3>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : attributes.length === 0 ? (
          <p>No attributes yet.</p>
        ) : (
          <>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Options</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttributes.map((a) => (
                  <tr key={a._id || a.id}>
                    <td>{a._id || a.id}</td>
                    <td>{a.name}</td>
                    <td>{a.type}</td>
                    <td>{a.options}</td>
                    <td>
                      {(user?.role === "super_admin" ||
                        user?.role === "admin") && (
                        <>
                          <button onClick={() => handleEdit(a)}>Edit</button>
                          <button onClick={() => handleDelete(a._id || a.id)}>
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
