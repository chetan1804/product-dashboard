import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await axios.get("/api/users");
  return res.data.users || res.data;
});

export const addUser = createAsyncThunk("users/add", async (user) => {
  const res = await axios.post("/api/users", user);
  return res.data;
});

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }) => {
    const res = await axios.put(`/api/users/${id}`, data);
    return res.data;
  }
);

export const deleteUser = createAsyncThunk("users/delete", async (id) => {
  await axios.delete(`/api/users/${id}`);
  return id;
});

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
