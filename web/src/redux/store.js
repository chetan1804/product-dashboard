import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import storesReducer from "./slices/storesSlice";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import attributesReducer from "./slices/attributesSlice";
import ordersReducer from "./slices/ordersSlice";
import analyticsReducer from "./slices/analyticsSlice";
import preferencesReducer from "./slices/preferencesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    stores: storesReducer,
    products: productsReducer,
    categories: categoriesReducer,
    attributes: attributesReducer,
    orders: ordersReducer,
    analytics: analyticsReducer,
    preferences: preferencesReducer,
  },
});

export default store;
