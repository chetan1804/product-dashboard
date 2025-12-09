import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import errorLogger from "../../utils/errorLogger";

/**
 * ordersSlice — manages orders with status updates and error handling
 */
export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`/api/orders${query ? "?" + query : ""}`);
      return res.data.orders || res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to load orders"
      );
      errorLogger.logApiError(
        error,
        "/api/orders",
        "GET",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

export const addOrder = createAsyncThunk(
  "orders/add",
  async (order, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/orders", order);
      return res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to add order"
      );
      errorLogger.logApiError(
        error,
        "/api/orders",
        "POST",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/orders/${id}`, { status });
      return res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to update order status"
      );
      errorLogger.logApiError(
        error,
        `/api/orders/${id}`,
        "PUT",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/orders/${id}`);
      return id;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to delete order"
      );
      errorLogger.logApiError(
        error,
        `/api/orders/${id}`,
        "DELETE",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], status: "idle", error: null, operationError: null },
  reducers: {
    optimisticStatusUpdate: (state, action) => {
      const idx = state.list.findIndex((o) => o.id === action.payload.id);
      if (idx >= 0) state.list[idx].status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.list = state.list.filter((o) => o.id !== action.payload);
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((o) => o.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      });
  },
});

export const { optimisticStatusUpdate } = ordersSlice.actions;
export default ordersSlice.reducer;
