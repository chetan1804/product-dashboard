import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import errorLogger from "../../utils/errorLogger";

/**
 * analyticsSlice — manages dashboard analytics data with error handling
 */
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`/api/analytics${query ? "?" + query : ""}`);
      return res.data;
    } catch (error) {
      const message = errorLogger.getUserFriendlyMessage(
        error,
        "Failed to load analytics"
      );
      errorLogger.logApiError(
        error,
        "/api/analytics",
        "GET",
        error.response?.status
      );
      return rejectWithValue(message);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    salesData: [],
    revenueData: [],
    storeComparison: [],
    topProducts: [],
    totalSales: 0,
    totalRevenue: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.salesData = action.payload.salesData || [];
        state.revenueData = action.payload.revenueData || [];
        state.storeComparison = action.payload.storeComparison || [];
        state.topProducts = action.payload.topProducts || [];
        state.totalSales = action.payload.totalSales || 0;
        state.totalRevenue = action.payload.totalRevenue || 0;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
