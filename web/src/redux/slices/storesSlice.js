import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * storesSlice — manages list of stores and their crud state
 */
export const fetchStores = createAsyncThunk("stores/fetch", async () => {
  const res = await axios.get("/api/stores");
  return res.data;
});

export const addStore = createAsyncThunk("stores/add", async (store) => {
  const res = await axios.post("/api/stores", store);
  return res.data;
});

export const updateStore = createAsyncThunk(
  "stores/update",
  async ({ id, data }) => {
    const res = await axios.put(`/api/stores/${id}`, data);
    return res.data;
  }
);

export const deleteStore = createAsyncThunk("stores/delete", async (id) => {
  await axios.delete(`/api/stores/${id}`);
  return id;
});

const storesSlice = createSlice({
  name: "stores",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const idx = state.list.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      });
  },
});

export default storesSlice.reducer;
