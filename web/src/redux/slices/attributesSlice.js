import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * attributesSlice — manages product attributes (e.g., color, size, weight)
 */
export const fetchAttributes = createAsyncThunk(
  "attributes/fetch",
  async () => {
    const res = await axios.get("/api/attributes");
    return res.data.attributes || res.data;
  }
);

export const addAttribute = createAsyncThunk(
  "attributes/add",
  async (attribute) => {
    const res = await axios.post("/api/attributes", attribute);
    return res.data;
  }
);

export const updateAttribute = createAsyncThunk(
  "attributes/update",
  async ({ id, data }) => {
    const res = await axios.put(`/api/attributes/${id}`, data);
    return res.data;
  }
);

export const deleteAttribute = createAsyncThunk(
  "attributes/delete",
  async (id) => {
    await axios.delete(`/api/attributes/${id}`);
    return id;
  }
);

const attributesSlice = createSlice({
  name: "attributes",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addAttribute.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteAttribute.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (a) => (a._id || a.id) !== action.payload
        );
      })
      .addCase(updateAttribute.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      });
  },
});

export default attributesSlice.reducer;
