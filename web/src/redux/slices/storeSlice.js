import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/api/stores");
      if (!response.ok) throw new Error("Failed to fetch stores");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addStore = createAsyncThunk(
  "stores/addStore",
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });
      if (!response.ok) throw new Error("Failed to add store");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStore = createAsyncThunk(
  "stores/updateStore",
  async ({ id, storeData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      });
      if (!response.ok) throw new Error("Failed to update store");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStore = createAsyncThunk(
  "stores/deleteStore",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/stores/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete store");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [
    {
      id: 1,
      name: "Main Store",
      slug: "main-store",
      location: "Downtown",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "+1 (212) 555-0100",
      email: "admin@mainstore.com",
      status: "active",
      storeAdminId: 1,
      storeAdminName: "John Admin",
      createdDate: "2024-01-15",
      totalOrders: 1245,
      totalRevenue: 125400.5,
      activeEditors: 3,
    },
    {
      id: 2,
      name: "Boston Store",
      slug: "boston-store",
      location: "Downtown Boston",
      address: "456 Park Avenue",
      city: "Boston",
      state: "MA",
      zip: "02101",
      phone: "+1 (617) 555-0200",
      email: "admin@bostonstore.com",
      status: "active",
      storeAdminId: 2,
      storeAdminName: "Jane Manager",
      createdDate: "2024-02-20",
      totalOrders: 856,
      totalRevenue: 89300.75,
      activeEditors: 2,
    },
    {
      id: 3,
      name: "Los Angeles Store",
      slug: "la-store",
      location: "Downtown LA",
      address: "789 Sunset Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      phone: "+1 (213) 555-0300",
      email: "admin@lastore.com",
      status: "active",
      storeAdminId: 3,
      storeAdminName: "Mike Johnson",
      createdDate: "2024-03-10",
      totalOrders: 1089,
      totalRevenue: 156200.0,
      activeEditors: 4,
    },
  ],
  selectedStore: null,
  status: "idle",
  error: null,
  operationError: null,
};

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch stores";
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addStore.rejected, (state, action) => {
        state.operationError = action.payload;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.operationError = action.payload;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.operationError = action.payload;
      });
  },
});

export const { setSelectedStore, clearError } = storeSlice.actions;
export default storeSlice.reducer;
