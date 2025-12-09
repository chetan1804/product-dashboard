import { createSlice } from "@reduxjs/toolkit";

/**
 * preferencesSlice — manages user preferences (persisted to localStorage)
 */
const initialState = {
  notifications:
    JSON.parse(localStorage.getItem("preferences_notifications")) ?? true,
  emailDigest:
    JSON.parse(localStorage.getItem("preferences_emailDigest")) ?? false,
  darkMode: JSON.parse(localStorage.getItem("preferences_darkMode")) ?? false,
  compactView:
    JSON.parse(localStorage.getItem("preferences_compactView")) ?? false,
  autoRefresh:
    JSON.parse(localStorage.getItem("preferences_autoRefresh")) ?? true,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      localStorage.setItem(
        "preferences_notifications",
        JSON.stringify(action.payload)
      );
    },
    setEmailDigest: (state, action) => {
      state.emailDigest = action.payload;
      localStorage.setItem(
        "preferences_emailDigest",
        JSON.stringify(action.payload)
      );
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem(
        "preferences_darkMode",
        JSON.stringify(action.payload)
      );
    },
    setCompactView: (state, action) => {
      state.compactView = action.payload;
      localStorage.setItem(
        "preferences_compactView",
        JSON.stringify(action.payload)
      );
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
      localStorage.setItem(
        "preferences_autoRefresh",
        JSON.stringify(action.payload)
      );
    },
  },
});

export const {
  setNotifications,
  setEmailDigest,
  setDarkMode,
  setCompactView,
  setAutoRefresh,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
