import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize user from localStorage (safe read)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("authUser");
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  });

  // Keep localStorage in sync when user changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("authUser");
      }
    } catch (err) {
      // ignore storage errors (e.g. private mode)
    }
  }, [user]);

  // login accepts optional options { persist }
  function login(payload, { persist = true } = {}) {
    // Ensure role and storeId are included
    const userWithDefaults = {
      id: payload.id || 1,
      name: payload.name || "Admin",
      email: payload.email || "admin@example.com",
      role: payload.role || "super_admin", // super_admin, admin, store_admin, editor
      storeId: payload.storeId || null, // null for super_admin/admin, store id for store_admin/editor
      permissions:
        payload.permissions ||
        getDefaultPermissions(payload.role || "super_admin"),
      ...payload,
    };
    setUser(userWithDefaults);
    try {
      if (persist)
        localStorage.setItem("authUser", JSON.stringify(userWithDefaults));
    } catch (err) {
      // ignore
    }
  }

  function switchStore(storeId) {
    if (user && (user.role === "super_admin" || user.role === "admin")) {
      setUser({ ...user, storeId });
      try {
        localStorage.setItem("authUser", JSON.stringify({ ...user, storeId }));
      } catch (err) {
        // ignore
      }
    }
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("authUser");
    } catch (err) {
      // ignore
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchStore }}>
      {children}
    </AuthContext.Provider>
  );
}

function getDefaultPermissions(role) {
  const permissions = {
    super_admin: {
      viewAllStores: true,
      manageStores: true,
      viewAllOrders: true,
      viewAllCustomers: true,
      manageUsers: true,
      manageSuperAdmins: true,
      viewAnalytics: true,
      editProducts: true,
      editSettings: true,
    },
    admin: {
      viewAllStores: true,
      manageStores: false,
      viewAllOrders: true,
      viewAllCustomers: true,
      manageUsers: false,
      manageSuperAdmins: false,
      viewAnalytics: true,
      editProducts: true,
      editSettings: false,
    },
    store_admin: {
      viewAllStores: false,
      manageStores: false,
      viewAllOrders: true,
      viewAllCustomers: true,
      manageUsers: true,
      manageSuperAdmins: false,
      viewAnalytics: true,
      editProducts: true,
      editSettings: true,
    },
    editor: {
      viewAllStores: false,
      manageStores: false,
      viewAllOrders: false,
      viewAllCustomers: false,
      manageUsers: false,
      manageSuperAdmins: false,
      viewAnalytics: false,
      editProducts: true,
      editSettings: false,
    },
  };
  return permissions[role] || permissions.editor;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
