import React, { useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Product Variants — Manage product variations (size, color, etc.)
 */
export default function ProductVariants() {
  const [variants, setVariants] = useState([
    {
      id: 1,
      productName: "T-Shirt Classic",
      variantName: "Red - Small",
      sku: "TSH-RED-S",
      size: "S",
      color: "Red",
      price: 19.99,
      stock: 50,
      image: "",
      status: "active",
    },
    {
      id: 2,
      productName: "T-Shirt Classic",
      variantName: "Red - Medium",
      sku: "TSH-RED-M",
      size: "M",
      color: "Red",
      price: 19.99,
      stock: 75,
      image: "",
      status: "active",
    },
    {
      id: 3,
      productName: "T-Shirt Classic",
      variantName: "Blue - Large",
      sku: "TSH-BLU-L",
      size: "L",
      color: "Blue",
      price: 19.99,
      stock: 30,
      image: "",
      status: "active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const filteredVariants = variants.filter(
    (v) =>
      !searchTerm ||
      v.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.variantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVariants = filteredVariants.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);

  const onSubmit = (data) => {
    if (editingId) {
      setVariants(
        variants.map((v) => (v.id === editingId ? { ...v, ...data } : v))
      );
      setEditingId(null);
    } else {
      setVariants([
        ...variants,
        {
          id: Date.now(),
          ...data,
          variantName: `${data.color} - ${data.size}`,
          status: "active",
        },
      ]);
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (variant) => {
    setEditingId(variant.id);
    reset(variant);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this variant?")) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="page variants-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Product Variants</h2>
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
          ➕ Add New Variant
        </button>
      </div>

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Variant" : "Add New Variant"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Product Name</label>
              <input {...register("productName", { required: true })} />
              {errors.productName && (
                <span className="error">Product name is required</span>
              )}
            </div>
            <div>
              <label>SKU</label>
              <input
                {...register("sku", { required: true })}
                placeholder="e.g. TSH-RED-M"
              />
              {errors.sku && <span className="error">SKU is required</span>}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Color</label>
                <input
                  {...register("color", { required: true })}
                  placeholder="e.g. Red, Blue"
                />
                {errors.color && (
                  <span className="error">Color is required</span>
                )}
              </div>
              <div>
                <label>Size</label>
                <select {...register("size", { required: true })}>
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
                {errors.size && <span className="error">Size is required</span>}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <span className="error">Price is required</span>
                )}
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  {...register("stock", { required: true })}
                />
                {errors.stock && (
                  <span className="error">Stock is required</span>
                )}
              </div>
            </div>
            <div>
              <label>Variant Image URL</label>
              <input
                {...register("image")}
                placeholder="https://example.com/variant-image.jpg"
              />
            </div>
            <button type="submit">
              {editingId ? "Update" : "Add"} Variant
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
          placeholder="Search by product name, SKU, or variant..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
      </section>

      <section className="list-section">
        <h3>Variant List ({filteredVariants.length})</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Variant</th>
              <th>Color</th>
              <th>Size</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVariants.map((v) => (
              <tr key={v.id}>
                <td>
                  <strong>{v.sku}</strong>
                </td>
                <td>{v.productName}</td>
                <td>{v.variantName}</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      background: v.color.toLowerCase(),
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}>
                    {v.color}
                  </span>
                </td>
                <td>
                  <strong>{v.size}</strong>
                </td>
                <td>${v.price?.toFixed(2)}</td>
                <td>
                  <span
                    style={{
                      color: v.stock < 20 ? "#dc2626" : "#059669",
                      fontWeight: "600",
                    }}>
                    {v.stock}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: v.status === "active" ? "#d1fae5" : "#f3f4f6",
                      color: v.status === "active" ? "#059669" : "#374151",
                    }}>
                    {v.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(v)}>Edit</button>
                  <button onClick={() => handleDelete(v.id)}>Delete</button>
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
