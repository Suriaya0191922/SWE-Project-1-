"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaCog } from "react-icons/fa";

export default function SellerLayout({ children }) {
  const [seller, setSeller] = useState({ name: "Loading...", email: "" });
  const [currentPath, setCurrentPath] = useState("/seller");

  // Fetch seller data from backend
  useEffect(() => {
    const fetchSellerData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setSeller({ name: "Guest", email: "" });
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Seller data fetched:", data);
          setSeller({
            name: data.user.name || data.user.username || "Seller",
            email: data.user.email || "",
          });
        } else if (res.status === 401) {
          console.error("❌ Token expired or invalid. Redirecting to login.");
          localStorage.removeItem("token");
          window.location.href = "/signup";
        } else {
          console.error("❌ Failed to fetch seller data. Status:", res.status);
          setSeller({ name: "Seller", email: "" });
        }
      } catch (err) {
        console.error("❌ Error fetching seller data:", err);
        setSeller({ name: "Seller", email: "" });
      }
    };

    fetchSellerData();
    
    // Get current path from window location
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", href: "/seller", icon: "📊" },
    { name: "Upload Products", href: "/seller/upload", icon: "📤" },
    { name: "My Products", href: "/seller/product", icon: "📦" },
    { name: "Messages", href: "/seller/message", icon: "✉️" },
    { name: "Logout", href: "/", icon: "🚪" },
    { name: "Profile", href: "/seller/profile", icon: <FaUser /> },
    { name: "Settings", href: "/seller/settings", icon: <FaCog /> },
  ];

  const isActive = (href) => {
    if (href === "/seller") return currentPath === href;
    return currentPath?.startsWith(href);
  };

  const handleNavigation = (href) => {
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  const styles = {
    wrapper: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
      width: "280px",
      backgroundColor: "#033c8c",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      padding: "32px 0",
      boxShadow: "4px 0 24px rgba(3,60,140,0.12)",
    },
    header: {
      padding: "0 24px 32px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      marginBottom: "24px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logoIcon: { fontSize: "30px" },
    title: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#aaff71",
      margin: 0,
    },
    subtitle: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.7)",
      margin: 0,
    },
    nav: { flex: 1 },
    ul: {
      listStyle: "none",
      padding: "0 16px",
      margin: 0,
    },
    link: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "10px",
      color: "rgba(255,255,255,0.8)",
      fontWeight: 500,
      transition: "0.2s ease",
      position: "relative",
      cursor: "pointer",
      border: "none",
      background: "transparent",
      width: "100%",
      textAlign: "left",
    },
    linkActive: {
      backgroundColor: "rgba(170,255,113,0.15)",
      color: "#aaff71",
    },
    icon: {
      fontSize: "18px",
    },
    indicator: {
      position: "absolute",
      right: "8px",
      width: "4px",
      height: "20px",
      backgroundColor: "#aaff71",
      borderRadius: "2px",
    },
    footer: {
      padding: "24px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
    },
    userCard: {
      display: "flex",
      gap: "12px",
      padding: "12px",
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
    avatar: {
      width: "40px",
      height: "40px",
      backgroundColor: "#aaff71",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    main: {
      flex: 1,
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      padding: "24px",
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🏪</div>
            <div>
              <h2 style={styles.title}>ShopHub</h2>
              <p style={styles.subtitle}>Seller Panel</p>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <ul style={styles.ul}>
            {menuItems.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={i}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    style={{
                      ...styles.link,
                      ...(active ? styles.linkActive : {}),
                    }}
                  >
                    <span style={styles.icon}>{item.icon}</span>
                    {item.name}
                    {active && <div style={styles.indicator} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={styles.footer}>
          <div style={styles.userCard}>
            <div style={styles.avatar}>👤</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{seller.name}</p>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
                {seller.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}
