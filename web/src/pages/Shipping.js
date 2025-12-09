import React, { useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Shipping Management — Manage shipping carriers, rates, labels, and tracking
 */
export default function Shipping() {
  const [shipments, setShipments] = useState([
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      customerName: "John Doe",
      carrier: "fedex",
      service: "overnight",
      trackingNumber: "7249382947239",
      weight: 2.5,
      dimensions: "12x8x6",
      cost: 45.99,
      status: "shipped",
      shippedDate: "2024-12-03",
      estimatedDelivery: "2024-12-04",
      destination: "New York, NY",
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      customerName: "Alice Johnson",
      carrier: "usps",
      service: "priority",
      trackingNumber: "9400111899223456789012",
      weight: 0.5,
      dimensions: "8x6x4",
      cost: 12.5,
      status: "in_transit",
      shippedDate: "2024-12-02",
      estimatedDelivery: "2024-12-05",
      destination: "Los Angeles, CA",
    },
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      customerName: "Bob Smith",
      carrier: "ups",
      service: "ground",
      trackingNumber: "1Z999AA10123456784",
      weight: 1.8,
      dimensions: "10x7x5",
      cost: 8.99,
      status: "delivered",
      shippedDate: "2024-12-01",
      estimatedDelivery: "2024-12-04",
      destination: "Chicago, IL",
    },
  ]);

  const [rates, setRates] = useState([
    {
      id: 1,
      carrier: "fedex",
      service: "overnight",
      baseRate: 45.0,
      perPound: 0.5,
    },
    { id: 2, carrier: "fedex", service: "2day", baseRate: 25.0, perPound: 0.3 },
    {
      id: 3,
      carrier: "usps",
      service: "priority",
      baseRate: 8.5,
      perPound: 0.15,
    },
    { id: 4, carrier: "ups", service: "ground", baseRate: 6.0, perPound: 0.1 },
  ]);

  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const carriers = [
    { value: "fedex", label: "FedEx" },
    { value: "usps", label: "USPS" },
    { value: "ups", label: "UPS" },
    { value: "dhl", label: "DHL" },
  ];

  const services = {
    fedex: ["overnight", "2day", "ground"],
    usps: ["priority", "first_class", "media"],
    ups: ["ground", "2day", "overnight"],
    dhl: ["express", "standard"],
  };

  const shipmentStatuses = [
    "pending",
    "shipped",
    "in_transit",
    "delivered",
    "failed",
  ];
  const selectedCarrier = watch("carrier");

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      !searchTerm ||
      s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCarrier = !carrierFilter || s.carrier === carrierFilter;
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesCarrier && matchesStatus;
  });

  const paginatedShipments = filteredShipments.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

  const onSubmitShipment = (data) => {
    if (editingId) {
      setShipments(
        shipments.map((s) => (s.id === editingId ? { ...s, ...data } : s))
      );
      setEditingId(null);
    } else {
      setShipments([
        ...shipments,
        {
          id: Date.now(),
          ...data,
          status: "pending",
        },
      ]);
    }
    reset();
    setShowShipmentForm(false);
  };

  const onSubmitRate = (data) => {
    setRates([
      ...rates,
      {
        id: Date.now(),
        ...data,
        baseRate: parseFloat(data.baseRate),
        perPound: parseFloat(data.perPound),
      },
    ]);
    reset();
    setShowRateForm(false);
  };

  const handleDeleteShipment = (id) => {
    if (window.confirm("Delete this shipment?")) {
      setShipments(shipments.filter((s) => s.id !== id));
    }
  };

  const handleDeleteRate = (id) => {
    if (window.confirm("Delete this rate?")) {
      setRates(rates.filter((r) => r.id !== id));
    }
  };

  const handlePrintLabel = (shipment) => {
    alert(
      `Shipping label printed for Order ${
        shipment.orderNumber
      }\n\nCarrier: ${shipment.carrier.toUpperCase()}\nTracking: ${
        shipment.trackingNumber
      }`
    );
  };

  const shippedCount = shipments.filter((s) => s.status === "shipped").length;
  const intransitCount = shipments.filter(
    (s) => s.status === "in_transit"
  ).length;
  const deliveredCount = shipments.filter(
    (s) => s.status === "delivered"
  ).length;
  const totalShippingCost = shipments.reduce((sum, s) => sum + s.cost, 0);

  return (
    <div className="page shipping-page">
      <h2>Shipping Management</h2>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Shipments</h4>
          <p className="kpi-value">{shipments.length}</p>
        </div>
        <div className="kpi-card" style={{ background: "#dbeafe" }}>
          <h4>In Transit</h4>
          <p className="kpi-value" style={{ color: "#1e40af" }}>
            {intransitCount}
          </p>
        </div>
        <div className="kpi-card" style={{ background: "#d1fae5" }}>
          <h4>Delivered</h4>
          <p className="kpi-value" style={{ color: "#059669" }}>
            {deliveredCount}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Shipping Cost</h4>
          <p className="kpi-value">${totalShippingCost.toFixed(2)}</p>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}>
        {/* Shipments Section */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}>
            <h3>Shipments</h3>
            <button
              onClick={() => {
                setEditingId(null);
                reset();
                setShowShipmentForm(true);
              }}
              style={{
                padding: "8px 16px",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}>
              ➕ New Shipment
            </button>
          </div>

          {showShipmentForm && (
            <section className="form-section">
              <h4>Create Shipment</h4>
              <form onSubmit={handleSubmit(onSubmitShipment)}>
                <div>
                  <label>Order Number</label>
                  <input
                    {...register("orderNumber", { required: true })}
                    placeholder="ORD-2024-XXX"
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                  <div>
                    <label>Customer</label>
                    <input {...register("customerName", { required: true })} />
                  </div>
                  <div>
                    <label>Destination</label>
                    <input {...register("destination", { required: true })} />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                  <div>
                    <label>Carrier</label>
                    <select {...register("carrier", { required: true })}>
                      <option value="">Select Carrier</option>
                      {carriers.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Service</label>
                    <select {...register("service", { required: true })}>
                      <option value="">Select Service</option>
                      {selectedCarrier &&
                        services[selectedCarrier].map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                  <div>
                    <label>Weight (lbs)</label>
                    <input type="number" step="0.1" {...register("weight")} />
                  </div>
                  <div>
                    <label>Cost ($)</label>
                    <input type="number" step="0.01" {...register("cost")} />
                  </div>
                </div>
                <button type="submit" style={{ width: "100%" }}>
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowShipmentForm(false)}
                  style={{ width: "100%", background: "#6b7280" }}>
                  Cancel
                </button>
              </form>
            </section>
          )}

          <section className="search-filters">
            <input
              type="text"
              placeholder="Search tracking or order..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
            <select
              value={carrierFilter}
              onChange={(e) => {
                setCarrierFilter(e.target.value);
                setPage(1);
              }}>
              <option value="">All Carriers</option>
              {carriers.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}>
              <option value="">All Status</option>
              {shipmentStatuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace("_", " ")}
                </option>
              ))}
            </select>
          </section>

          <section className="list-section">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Carrier</th>
                  <th>Tracking</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th>Est. Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedShipments.map((s) => (
                  <tr key={s.id}>
                    <td>{s.orderNumber}</td>
                    <td>
                      {carriers.find((c) => c.value === s.carrier)?.label}
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                      {s.trackingNumber}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          background:
                            s.status === "delivered"
                              ? "#d1fae5"
                              : s.status === "in_transit"
                              ? "#dbeafe"
                              : s.status === "shipped"
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            s.status === "delivered"
                              ? "#059669"
                              : s.status === "in_transit"
                              ? "#1e40af"
                              : s.status === "shipped"
                              ? "#92400e"
                              : "#dc2626",
                        }}>
                        {s.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>${s.cost.toFixed(2)}</td>
                    <td>{s.estimatedDelivery}</td>
                    <td>
                      <button
                        onClick={() => handlePrintLabel(s)}
                        style={{ background: "#3b82f6" }}>
                        🏷️ Label
                      </button>
                      <button onClick={() => handleDeleteShipment(s.id)}>
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

        {/* Rates Section */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}>
            <h3>Shipping Rates</h3>
            <button
              onClick={() => {
                reset();
                setShowRateForm(true);
              }}
              style={{
                padding: "8px 16px",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
              }}>
              ➕ New Rate
            </button>
          </div>

          {showRateForm && (
            <section className="form-section">
              <h4>Add Shipping Rate</h4>
              <form onSubmit={handleSubmit(onSubmitRate)}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                  <div>
                    <label>Carrier</label>
                    <select {...register("carrier", { required: true })}>
                      <option value="">Select</option>
                      {carriers.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Service</label>
                    <input {...register("service", { required: true })} />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                  <div>
                    <label>Base Rate ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("baseRate")}
                    />
                  </div>
                  <div>
                    <label>Per Pound ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("perPound")}
                    />
                  </div>
                </div>
                <button type="submit" style={{ width: "100%" }}>
                  Add Rate
                </button>
                <button
                  type="button"
                  onClick={() => setShowRateForm(false)}
                  style={{ width: "100%", background: "#6b7280" }}>
                  Cancel
                </button>
              </form>
            </section>
          )}

          <section className="list-section">
            <h4>Rate Configuration</h4>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Carrier</th>
                  <th>Service</th>
                  <th>Base ($)</th>
                  <th>Per lb ($)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {carriers.find((c) => c.value === r.carrier)?.label}
                    </td>
                    <td>{r.service}</td>
                    <td>${r.baseRate.toFixed(2)}</td>
                    <td>${r.perPound.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteRate(r.id)}
                        style={{ background: "#ef4444" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
