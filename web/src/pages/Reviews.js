import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { formatDate } from "../utils/formatters";

/**
 * Product Reviews — Manage customer reviews and ratings
 */
export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: "Laptop Pro 15",
      customerName: "Alice Johnson",
      rating: 5,
      comment: "Excellent product! Works perfectly and fast delivery.",
      date: "2024-12-01",
      status: "approved",
      helpful: 12,
      storeId: 1,
    },
    {
      id: 2,
      productName: "Wireless Mouse",
      customerName: "Bob Smith",
      rating: 4,
      comment:
        "Good mouse, comfortable to use but battery life could be better.",
      date: "2024-12-02",
      status: "pending",
      helpful: 5,
      storeId: 2,
    },
    {
      id: 3,
      productName: "USB-C Cable",
      customerName: "Carol White",
      rating: 2,
      comment: "Cable stopped working after 2 weeks. Not durable.",
      date: "2024-12-03",
      status: "pending",
      helpful: 8,
      storeId: 1,
    },
  ]);

  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredReviews = reviews.filter((r) => {
    // Store filtering: store_admin sees only reviews from their store
    const matchesStore =
      user?.role === "super_admin" || user?.role === "admin"
        ? true
        : r.storeId === user?.storeId;
    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesRating = !ratingFilter || r.rating === parseInt(ratingFilter);
    const matchesSearch =
      !searchTerm ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStore && matchesStatus && matchesRating && matchesSearch;
  });

  const paginatedReviews = filteredReviews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handleStatusChange = (id, newStatus) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  const handleResponse = (review) => {
    setSelectedReview(review);
    setResponseText("");
  };

  const submitResponse = () => {
    alert(`Response sent to ${selectedReview.customerName}: ${responseText}`);
    setSelectedReview(null);
    setResponseText("");
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="page reviews-page">
      <h2>Product Reviews</h2>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Reviews</h4>
          <p className="kpi-value">{reviews.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Average Rating</h4>
          <p className="kpi-value">{avgRating} ⭐</p>
        </div>
        <div
          className="kpi-card"
          style={{ background: pendingCount > 0 ? "#fef3c7" : "#d1fae5" }}>
          <h4>Pending Reviews</h4>
          <p
            className="kpi-value"
            style={{ color: pendingCount > 0 ? "#92400e" : "#059669" }}>
            {pendingCount}
          </p>
        </div>
      </section>

      <section className="search-filters">
        <input
          type="text"
          placeholder="Search by product or customer name..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setPage(1);
          }}>
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </section>

      <section className="list-section">
        <h3>Reviews List ({filteredReviews.length})</h3>
        <div style={{ display: "grid", gap: "16px" }}>
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                background: review.status === "pending" ? "#fffbeb" : "white",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
                }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>
                    {review.productName}
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    by <strong>{review.customerName}</strong> on{" "}
                    {formatDate(review.date || review.createdAt)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>
                    {renderStars(review.rating)}
                  </div>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        review.status === "approved"
                          ? "#d1fae5"
                          : review.status === "pending"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        review.status === "approved"
                          ? "#059669"
                          : review.status === "pending"
                          ? "#92400e"
                          : "#dc2626",
                    }}>
                    {review.status}
                  </span>
                </div>
              </div>

              <p
                style={{
                  margin: "12px 0",
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "4px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}>
                "{review.comment}"
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "12px",
                }}>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  👍 {review.helpful} people found this helpful
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {review.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(review.id, "approved")
                        }
                        style={{ background: "#10b981", color: "white" }}>
                        ✓ Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(review.id, "rejected")
                        }
                        style={{ background: "#ef4444", color: "white" }}>
                        ✕ Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => handleResponse(review)}>
                    💬 Respond
                  </button>
                  <button onClick={() => handleDelete(review.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination" style={{ marginTop: "24px" }}>
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

      {selectedReview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}>
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
            }}>
            <h3>Respond to Review</h3>
            <p
              style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
              Review by <strong>{selectedReview.customerName}</strong> on{" "}
              <strong>{selectedReview.productName}</strong>
            </p>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Type your response here..."
              rows="5"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={submitResponse} style={{ flex: 1 }}>
                Send Response
              </button>
              <button
                onClick={() => setSelectedReview(null)}
                style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
