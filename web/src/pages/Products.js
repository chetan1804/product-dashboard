import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  optimisticUpdate,
  optimisticAdd,
  optimisticDelete,
} from "../redux/slices/productsSlice";
import { fetchAttributes } from "../redux/slices/attributesSlice";
import useDebounce from "../hooks/useDebounce";
import { LoadingError, ErrorAlert } from "../components/ErrorPage";
import { useAuth } from "../contexts/AuthContext";
import { formatId } from "../utils/formatters";

/**
 * Products page — CRUD with search, filters, pagination, and optimistic updates
 * Enhanced with error handling and user-friendly error messages
 */
export default function Products() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const productsState = useSelector(
    (state) => state.products || { list: [], status: "idle", error: null }
  );
  const { list: products = [], status, error } = productsState;

  const attributesState = useSelector(
    (state) => state.attributes || { list: [], status: "idle", error: null }
  );
  const { list: attributes = [] } = attributesState;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [alertError, setAlertError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const itemsPerPage = 5;

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const loadProducts = async () => {
      const result = await dispatch(fetchProducts());
      if (result.type === fetchProducts.rejected.type) {
        setAlertError(result.payload || "Failed to load products");
      }
    };
    loadProducts();
    dispatch(fetchAttributes());
  }, [dispatch]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const onSubmit = async (data) => {
    setAlertError(null);
    const productData = {
      ...data,
      mainImage,
      galleryImages,
      attributes: selectedAttributes,
    };

    if (editingId) {
      dispatch(optimisticUpdate({ id: editingId, ...productData }));
      const result = await dispatch(
        updateProduct({ id: editingId, data: productData })
      );
      if (result.type === updateProduct.rejected.type) {
        setAlertError(result.payload || "Failed to update product");
      }
      setEditingId(null);
    } else {
      dispatch(optimisticAdd(productData));
      const result = await dispatch(addProduct(productData));
      if (result.type === addProduct.rejected.type) {
        setAlertError(result.payload || "Failed to add product");
      }
    }
    reset();
    setMainImage("");
    setGalleryImages([]);
    setSelectedAttributes({});
    setShowForm(false);
    setPage(1);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    reset(product);
    setMainImage(product.mainImage || "");
    setGalleryImages(product.galleryImages || []);
    setSelectedAttributes(product.attributes || {});
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setMainImage("");
    setGalleryImages([]);
    setSelectedAttributes({});
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
    setMainImage("");
    setGalleryImages([]);
    setSelectedAttributes({});
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setAlertError(null);
    if (window.confirm("Delete product?")) {
      dispatch(optimisticDelete(id));
      dispatch(deleteProduct(id)).then((res) => {
        if (res.type === deleteProduct.rejected.type) {
          setAlertError(res.payload || "Failed to delete product");
        }
      });
    }
  };

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <div className="page products-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>Products</h2>
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
            ➕ Add New Product
          </button>
        )}
      </div>

      {error && (
        <LoadingError
          error={error}
          onRetry={() => dispatch(fetchProducts())}
          message="Failed to load products"
        />
      )}

      {alertError && (
        <ErrorAlert
          message={alertError}
          onClose={() => setAlertError(null)}
          type="error"
        />
      )}

      {showForm && (
        <section className="form-section">
          <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Title</label>
              <input {...register("title", { required: true })} />
              {errors.title && <span className="error">Title required</span>}
            </div>
            <div>
              <label>Price</label>
              <input type="number" step="0.01" {...register("price")} />
            </div>
            <div>
              <label>Stock</label>
              <input type="number" {...register("stock")} />
            </div>
            <div>
              <label>Category</label>
              <input {...register("category")} placeholder="e.g. Electronics" />
            </div>
            <div>
              <label>SKU</label>
              <input {...register("sku")} placeholder="e.g. PROD-001" />
            </div>
            <div>
              <label>Brand</label>
              <input {...register("brand")} placeholder="e.g. Apple, Samsung" />
            </div>
            <div>
              <label>Description</label>
              <textarea
                {...register("description")}
                placeholder="Product description"
                rows="3"
              />
            </div>
            <div>
              <label>Cost Price</label>
              <input
                type="number"
                step="0.01"
                {...register("costPrice")}
                placeholder="0.00"
              />
            </div>
            <div>
              <label>Sale Price</label>
              <input
                type="number"
                step="0.01"
                {...register("salePrice")}
                placeholder="0.00"
              />
            </div>
            <div>
              <label>Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                {...register("weight")}
                placeholder="0.00"
              />
            </div>
            <div>
              <label>Status</label>
              <select {...register("status")}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="outofstock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <div>
              <label>Featured Product</label>
              <input type="checkbox" {...register("featured")} />
            </div>

            <div>
              <label>Main Image URL</label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {mainImage && (
                <div style={{ marginTop: "8px" }}>
                  <img
                    src={mainImage}
                    alt="Main preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label>Gallery Images (comma-separated URLs)</label>
              <textarea
                value={galleryImages.join(", ")}
                onChange={(e) =>
                  setGalleryImages(
                    e.target.value
                      .split(",")
                      .map((url) => url.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                rows="3"
              />
              {galleryImages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                    flexWrap: "wrap",
                  }}>
                  {galleryImages.map((url, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGalleryImages(
                            galleryImages.filter((_, i) => i !== idx)
                          )
                        }
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "0",
                        }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label>Product Attributes</label>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  background: "#f9fafb",
                }}>
                {attributes.length === 0 ? (
                  <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                    No attributes available
                  </p>
                ) : (
                  attributes.map((attr) => (
                    <div key={attr.id} style={{ marginBottom: "12px" }}>
                      <label
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                          display: "block",
                          marginBottom: "4px",
                        }}>
                        {attr.name}
                      </label>
                      {attr.options ? (
                        <select
                          value={selectedAttributes[attr.name] || ""}
                          onChange={(e) =>
                            setSelectedAttributes({
                              ...selectedAttributes,
                              [attr.name]: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}>
                          <option value="">Select {attr.name}</option>
                          {attr.options.split(",").map((opt, idx) => (
                            <option key={idx} value={opt.trim()}>
                              {opt.trim()}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={selectedAttributes[attr.name] || ""}
                          onChange={(e) =>
                            setSelectedAttributes({
                              ...selectedAttributes,
                              [attr.name]: e.target.value,
                            })
                          }
                          placeholder={`Enter ${attr.name}`}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <button type="submit">
              {editingId ? "Update" : "Add"} Product
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </section>
      )}

      <section className="search-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </section>

      <section className="list-section">
        <h3>Product List ({filteredProducts.length})</h3>
        {status === "loading" ? (
          <p>Loading products...</p>
        ) : status === "failed" ? (
          <LoadingError
            error={error}
            onRetry={() => dispatch(fetchProducts())}
            message="Failed to load products"
          />
        ) : products.length === 0 ? (
          <p>No products yet.</p>
        ) : (
          <>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((p) => (
                  <tr key={p._id || p.id}>
                    <td>{formatId(p._id || p.id)}</td>
                    <td>{p.title}</td>
                    <td>${p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.category}</td>
                    <td>
                      {(user?.role === "super_admin" ||
                        user?.role === "admin") && (
                        <>
                          <button onClick={() => handleEdit(p)}>Edit</button>
                          <button onClick={() => handleDelete(p._id || p.id)}>
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
