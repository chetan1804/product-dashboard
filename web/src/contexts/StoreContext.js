import React, { createContext, useContext, useState } from "react";

const StoreContext = createContext();

/**
 * StoreProvider — manages active store and list of stores
 * Provides: activeStore, setActiveStore, stores, setStores
 */
export function StoreProvider({ children }) {
  const [activeStore, setActiveStore] = useState(null);
  const [stores, setStores] = useState([]);

  return (
    <StoreContext.Provider
      value={{ activeStore, setActiveStore, stores, setStores }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export default StoreContext;
