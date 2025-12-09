import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  optimisticStatusUpdate,
} from "../redux/slices/ordersSlice";
import { LoadingError, ErrorAlert } from "../components/ErrorPage";
import { useAuth } from "../contexts/AuthContext";
import { formatDate, formatId } from "../utils/formatters";

/**
 * Orders page — list with status dropdown, inline editing, and date range filters
 */
export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ordersState = useSelector(
    (state) =>
      state.orders || {
        list: [],
        status: "idle",
        error: null,
        operationError: null,
      }
  );
  const { list: orders = [], status, error, operationError } = ordersState;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [alertError, setAlertError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 10;

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    const loadOrders = async () => {
      const result = await dispatch(fetchOrders());
      if (result.type === fetchOrders.rejected.type) {
        setAlertError(result.payload || "Failed to load orders");
      }
    };
    loadOrders();
  }, [dispatch]);

  const filteredOrders = orders.filter((o) => {
    // Store filtering: store_admin and editor see only their store's orders
    const matchesStore =
      user?.role === "super_admin" || user?.role === "admin"
        ? true
        : o.storeId === user?.storeId;
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const orderDate = new Date(o.created_at);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);
    return matchesStore && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const onSubmit = async (data) => {
    setAlertError(null);
    const result = await dispatch(
      addOrder({
        ...data,
        status: "pending",
        created_at: new Date().toISOString(),
      })
    );
    if (result.type === addOrder.rejected.type) {
      setAlertError(result.payload || "Failed to add order");
    } else {
      reset();
      setShowAddForm(false);
      setPage(1);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setAlertError(null);
    dispatch(optimisticStatusUpdate({ id, status: newStatus }));
    const result = await dispatch(updateOrderStatus({ id, status: newStatus }));
    if (result.type === updateOrderStatus.rejected.type) {
      setAlertError(result.payload || "Failed to update order status");
    }
  };

  const handleDelete = (id) => {
    setAlertError(null);
    if (window.confirm("Delete order?")) {
      dispatch(deleteOrder(id)).then((res) => {
        if (res.type === deleteOrder.rejected.type) {
          setAlertError(res.payload || "Failed to delete order");
        }
      });
    }
  };

  return (
    <div className="page orders-page">
      <h2>Orders</h2>

      {error && (
        <LoadingError
          error={error}
          onRetry={() => dispatch(fetchOrders())}
          message="Failed to load orders"
        />
      )}

      {(alertError || operationError) && (
        <ErrorAlert
          message={alertError || operationError}
          onClose={() => setAlertError(null)}
          type="error"
        />
      )}

      <section className="filters-section">
        <div className="filter-row">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            placeholder="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            placeholder="To date"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Order"}
          </button>
        </div>
      </section>

      {showAddForm && (
        <section className="form-section">
          <h3>Add New Order</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Customer Name</label>
              <input {...register("customer_name", { required: true })} />
              {errors.customer_name && (
                <span className="error">Customer name required</span>
              )}
            </div>
            <div>
              <label>Total</label>
              <input type="number" step="0.01" {...register("total")} />
            </div>
            <button type="submit">Create Order</button>
          </form>
        </section>
      )}

      <section className="list-section">
        <h3>Order List ({filteredOrders.length})</h3>
        {status === "loading" ? (
          <p>Loading orders...</p>
        ) : status === "failed" ? (
          <LoadingError
            error={error}
            onRetry={() => dispatch(fetchOrders())}
            message="Failed to load orders"
          />
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((o) => (
                  <tr key={o._id || o.id} style={{ cursor: "pointer" }}>
                    <td onClick={() => navigate(`/orders/${o._id || o.id}`)}>
                      {o._id || o.id}
                    </td>
                    <td onClick={() => navigate(`/orders/${o._id || o.id}`)}>
                      {o.customer_name}
                    </td>
                    <td onClick={() => navigate(`/orders/${o._id || o.id}`)}>
                      ${o.total}
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
                        className="status-select">
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td onClick={() => navigate(`/orders/${o._id || o.id}`)}>
                      {formatDate(o.createdAt || o.created_at)}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/orders/${o._id || o.id}`)}>
                        View
                      </button>
                      <button onClick={() => handleDelete(o._id || o.id)}>
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
