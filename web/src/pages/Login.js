import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = (data) => {
    // Placeholder login logic - in production, this would call the API
    // For testing, map different usernames to different roles
    let payload = {
      id: 1,
      name: "Super Admin",
      email: "super@admin.com",
      role: "super_admin",
      storeId: null, // super_admin sees all stores
    };

    // Map test usernames to different roles
    if (data.username === "admin") {
      payload = {
        id: 2,
        name: "Admin User",
        email: "admin@store.com",
        role: "admin",
        storeId: null, // admin sees all stores
      };
    } else if (data.username === "storeadmin") {
      payload = {
        id: 3,
        name: "Store Admin",
        email: "storeadmin@store.com",
        role: "store_admin",
        storeId: 1, // store_admin for NY store
      };
    } else if (data.username === "editor") {
      payload = {
        id: 4,
        name: "Editor User",
        email: "editor@store.com",
        role: "editor",
        storeId: 1, // editor for NY store
      };
    }

    login(payload);
    // navigate immediately to dashboard to avoid race with effect
    navigate("/", { replace: true });
  };

  return (
    <div className="page login-page">
      <h2>Login</h2>
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f0f8ff",
          borderRadius: "5px",
        }}>
        <h4 style={{ marginTop: 0 }}>Test Credentials:</h4>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>
            <strong>super</strong> → Super Admin (sees all stores, full
            permissions)
          </li>
          <li>
            <strong>admin</strong> → Admin (sees all stores, limited
            permissions)
          </li>
          <li>
            <strong>storeadmin</strong> → Store Admin (NY store only)
          </li>
          <li>
            <strong>editor</strong> → Editor (NY store only, limited access)
          </li>
        </ul>
        <p style={{ marginBottom: 0, fontSize: "0.9em", color: "#666" }}>
          Use any password
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input {...register("username", { required: true })} />
          {errors.username && <span>Username required</span>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
          />
          {errors.password && <span>Password required</span>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
