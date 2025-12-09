import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { ErrorAlert } from "../components/ErrorPage";
import { formatDate } from "../utils/formatters";
import {
  setNotifications,
  setEmailDigest,
  setDarkMode,
  setCompactView,
  setAutoRefresh,
} from "../redux/slices/preferencesSlice";

/**
 * Settings page — theme switcher, profile settings, and user preferences
 */
export default function Settings() {
  const dispatch = useDispatch();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const prefs = useSelector((state) => state.preferences);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [preferenceError, setPreferenceError] = useState(null);

  const onProfileSubmit = (data) => {
    try {
      // In production, this would call an API to update the user profile
      console.log("Profile updated:", data);
      setSaveError(null);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      setSaveError("Failed to save profile. Please try again.");
      console.error("Profile save error:", error);
    }
  };

  const handleThemeToggle = () => {
    try {
      setPreferenceError(null);
      toggle();
      dispatch(setDarkMode(!prefs.darkMode));
    } catch (error) {
      setPreferenceError("Failed to update theme preference.");
      console.error("Theme toggle error:", error);
    }
  };

  const handleNotificationsToggle = () => {
    try {
      setPreferenceError(null);
      dispatch(setNotifications(!prefs.notifications));
    } catch (error) {
      setPreferenceError("Failed to update notifications preference.");
      console.error("Notifications toggle error:", error);
    }
  };

  const handleEmailDigestToggle = () => {
    try {
      setPreferenceError(null);
      dispatch(setEmailDigest(!prefs.emailDigest));
    } catch (error) {
      setPreferenceError("Failed to update email digest preference.");
      console.error("Email digest toggle error:", error);
    }
  };

  const handleCompactViewToggle = () => {
    try {
      setPreferenceError(null);
      dispatch(setCompactView(!prefs.compactView));
    } catch (error) {
      setPreferenceError("Failed to update display preference.");
      console.error("Compact view toggle error:", error);
    }
  };

  const handleAutoRefreshToggle = () => {
    try {
      setPreferenceError(null);
      dispatch(setAutoRefresh(!prefs.autoRefresh));
    } catch (error) {
      setPreferenceError("Failed to update auto-refresh preference.");
      console.error("Auto refresh toggle error:", error);
    }
  };

  return (
    <div className="page settings-page">
      <h2>Settings</h2>

      {saveError && (
        <ErrorAlert
          message={saveError}
          onClose={() => setSaveError(null)}
          type="error"
        />
      )}

      {preferenceError && (
        <ErrorAlert
          message={preferenceError}
          onClose={() => setPreferenceError(null)}
          type="error"
        />
      )}

      <div className="settings-grid">
        {/* Theme Settings */}
        <section className="settings-section">
          <h3>Theme</h3>
          <div className="setting-item">
            <label>Dark Mode</label>
            <div className="setting-control">
              <span>{theme === "dark" ? "On" : "Off"}</span>
              <button
                className={`toggle-btn ${theme === "dark" ? "active" : ""}`}
                onClick={handleThemeToggle}>
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
            </div>
          </div>
        </section>

        {/* Profile Settings */}
        <section className="settings-section">
          <h3>Profile</h3>
          <form onSubmit={handleSubmit(onProfileSubmit)}>
            <div>
              <label>Full Name</label>
              <input {...register("name")} />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                {...register("email", { required: "Email required" })}
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>
            <button type="submit">Save Profile</button>
            {profileSaved && <p className="success">Profile saved!</p>}
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <input
              type="checkbox"
              checked={prefs.notifications}
              onChange={handleNotificationsToggle}
            />
          </div>
          <div className="setting-item">
            <label>Email Digest (Weekly)</label>
            <input
              type="checkbox"
              checked={prefs.emailDigest}
              onChange={handleEmailDigestToggle}
              disabled={!prefs.notifications}
            />
          </div>
        </section>

        {/* Display Preferences */}
        <section className="settings-section">
          <h3>Display</h3>
          <div className="setting-item">
            <label>Compact View</label>
            <input
              type="checkbox"
              checked={prefs.compactView}
              onChange={handleCompactViewToggle}
            />
          </div>
          <div className="setting-item">
            <label>Auto-Refresh Data</label>
            <input
              type="checkbox"
              checked={prefs.autoRefresh}
              onChange={handleAutoRefreshToggle}
            />
          </div>
        </section>

        {/* System Info */}
        <section className="settings-section">
          <h3>System</h3>
          <div className="setting-item">
            <p>App Version: 0.1.0</p>
            <p>Role: {user?.role || "N/A"}</p>
            <p>Last Updated: {formatDate(new Date())}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
