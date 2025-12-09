import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import errorLogger from "../../utils/errorLogger";

/**
 * productsSlice — manages products with optimistic updates
 */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (storeId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/products?storeId=${storeId || ""}`);
      // MongoDB returns { products: [], pagination: {} }
      return res.data.products || res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to load products"
      );
      errorLogger.logApiError(
        error,
        "/api/products",
        "GET",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (product, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/products", product);
      return res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to add product"
      );
      errorLogger.logApiError(
        error,
        "/api/products",
        "POST",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/products/${id}`, data);
      return res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to update product"
      );
      errorLogger.logApiError(
        error,
        `/api/products/${id}`,
        "PUT",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/products/${id}`);
      return id;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to delete product"
      );
      errorLogger.logApiError(
        error,
        `/api/products/${id}`,
        "DELETE",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { list: [], status: "idle", error: null, operationError: null },
  reducers: {
    // Optimistic update: update UI immediately
    optimisticUpdate: (state, action) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    optimisticAdd: (state, action) => {
      state.list.unshift({ ...action.payload, id: Math.random() });
    },
    optimisticDelete: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.operationError = action.payload || action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (p) => !p.id || p.id === action.meta.arg.tempId
        );
        if (idx >= 0) state.list[idx] = action.payload;
        else state.list.unshift(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p) => (p._id || p.id) !== action.payload
        );
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.list.findIndex(
          (p) => (p._id || p.id) === (action.payload._id || action.payload.id)
        );
        if (idx >= 0) state.list[idx] = action.payload;
      });
  },
});

export const { optimisticUpdate, optimisticAdd, optimisticDelete } =
  productsSlice.actions;
export default productsSlice.reducer;
