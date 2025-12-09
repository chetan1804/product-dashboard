import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchStores,
  addStore,
  updateStore,
  deleteStore,
} from "../redux/slices/storesSlice";

/**
 * Stores page — CRUD for stores with pagination
 * Features: list with pagination, add, edit, delete
 */
export default function Stores() {
  const dispatch = useDispatch();
  const storesState = useSelector(
    (state) => state.stores || { list: [], status: "idle", error: null }
  );
  const { list: stores = [], status } = storesState;
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
    dispatch(fetchStores());
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (editingId) {
      dispatch(updateStore({ id: editingId, data }));
      setEditingId(null);
    } else {
      dispatch(addStore(data));
    }
    reset();
    setShowForm(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setShowForm(true);
  };

  const handleEdit = (store) => {
    setEditingId(store.id);
    reset(store);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete store?")) {
      dispatch(deleteStore(id));
    }
  };

  const paginatedStores = stores.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(stores.length / itemsPerPage);

  return (
    <div className="page stores-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Stores</h2>
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
          ➕ Add New Store
        </button>
      </div>

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Store" : "Add Store"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Name</label>
              <input {...register("name", { required: true })} />
              {errors.name && <span className="error">Name required</span>}
            </div>
            <div>
              <label>Slug</label>
              <input {...register("slug")} placeholder="e.g. store-1" />
            </div>
            <div>
              <label>Description</label>
              <textarea
                {...register("description")}
                placeholder="Store description"
              />
            </div>
            <button type="submit">{editingId ? "Update" : "Add"} Store</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="list-section">
        <h3>Store List ({stores.length})</h3>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : stores.length === 0 ? (
          <p>No stores yet.</p>
        ) : (
          <>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.slug}</td>
                    <td>{s.description}</td>
                    <td>
                      <button onClick={() => handleEdit(s)}>Edit</button>
                      <button onClick={() => handleDelete(s.id)}>Delete</button>
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
