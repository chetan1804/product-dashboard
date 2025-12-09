import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StoreSwitcher from "./StoreSwitcher";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    try {
      logout();
    } finally {
      // ensure navigation even if logout is async in future
      navigate("/login", { replace: true });
    }
  }

  return (
    <header className="app-header">
      <div className="brand">Jordan Admin</div>
      <div className="header-right">
        {user ? (
          <>
            <StoreSwitcher />
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>Not signed in</span>
        )}
      </div>
    </header>
  );
}
