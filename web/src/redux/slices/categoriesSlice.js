import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * categoriesSlice — manages product categories
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const res = await axios.get("/api/categories");
    return res.data.categories || res.data;
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (category) => {
    const res = await axios.post("/api/categories", category);
    return res.data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }) => {
    const res = await axios.put(`/api/categories/${id}`, data);
    return res.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id) => {
    await axios.delete(`/api/categories/${id}`);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (c) => (c._id || c.id) !== action.payload
        );
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
