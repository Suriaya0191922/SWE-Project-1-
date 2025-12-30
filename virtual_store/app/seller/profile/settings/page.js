"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [theme, setTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- LOAD THEME ---------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsLoading(false);
  }, []);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  /* ---------- PASSWORD ---------- */
    const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5001/user/password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            oldPassword,
            newPassword,
        }),
        });

        const data = await res.json();

        if (!res.ok) {
        alert(data.message || "Failed to update password");
        return;
        }

        alert("Password updated successfully");

        // Clear inputs
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    } catch (err) {
        alert("Server error while updating password");
    }
    };


  /* ---------- DELETE ACCOUNT ---------- */
  const handleDeleteAccount = async () => {
  const confirmed = window.confirm(
    "This will permanently delete your seller account. Continue?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5001/user", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to delete account");
      return;
    }

    alert("Account deleted successfully");

    // Clear session and redirect
    localStorage.clear();
    router.push("/login");
  } catch (err) {
    alert("Server error while deleting account");
  }
};


  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="settings-wrapper">
      <h1 className="page-title">Settings</h1>
      <p className="subtitle">Manage your account and preferences</p>

      <div className="settings-grid">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* APPEARANCE */}
          <div className="card">
            <h2>Appearance</h2>

            <div className="row">
              <span>Theme Mode</span>
              <select
                className="dropdown"
                value={theme}
                onChange={handleThemeChange}
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="card">
            <h2>Notifications</h2>

            <div className="toggle-row">
              <span>Email Notifications</span>
              <input type="checkbox" />
            </div>

            <div className="toggle-row">
              <span>Message Alerts</span>
              <input type="checkbox" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          {/* PASSWORD */}
          <div className="card">
            <h2>Password Change</h2>

            <label>Current Password</label>
            <input
              type="password"
              className="input"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <label>New Password</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="save-btn" onClick={handlePasswordUpdate}>
              Update Password
            </button>
          </div>

          {/* DELETE ACCOUNT */}
          <div className="card danger-card">
            <h2>Delete Account</h2>

            <p className="danger-text">
              Once deleted, all seller data will be permanently removed.
            </p>

            <button className="delete-btn" onClick={handleDeleteAccount}>
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>

      {/* ===== GLOBAL + THEME CSS (UNCHANGED) ===== */}
      <style jsx global>{`
        :root[data-theme="dark"] {
          --bg: linear-gradient(135deg, #0a1929 0%, #1a2332 100%);
          --text: #e0e7ff;
          --card-bg: rgba(30, 41, 59, 0.55);
          --border: rgba(99, 102, 241, 0.25);
          --accent: #6366f1;
          --hover: rgba(99, 102, 241, 0.35);
        }

        :root[data-theme="light"] {
          --bg: #f3f4f6;
          --text: #1e293b;
          --card-bg: #ffffff;
          --border: rgba(148, 163, 184, 0.4);
          --accent: #4f46e5;
          --hover: rgba(79, 70, 229, 0.1);
        }

        body {
          background: var(--bg) !important;
          color: var(--text) !important;
        }
      `}</style>

      {/* ===== COMPONENT CSS (UNCHANGED) ===== */}
      <style jsx>{`
        .settings-wrapper {
          padding: 32px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text);
        }

        .subtitle {
          color: #94a3b8;
          margin-bottom: 24px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px;
        }

        h2 {
          margin: 0 0 16px;
          color: var(--text);
        }

        .row,
        .toggle-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .dropdown {
          padding: 10px;
          background: var(--card-bg);
          color: var(--text);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .input {
          width: 100%;
          padding: 10px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          margin-bottom: 10px;
        }

        .save-btn {
          padding: 10px 16px;
          background: var(--accent);
          color: white;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .danger-card {
          border-color: #ef4444;
        }

        .danger-text {
          color: #f87171;
          margin-bottom: 12px;
        }

        .delete-btn {
          padding: 10px 16px;
          background: #ef4444;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}