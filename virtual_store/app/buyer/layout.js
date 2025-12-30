"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaBoxOpen,
  FaUser,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

export default function BuyerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({ name: "Loading...", email: "Loading...", id: null });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signup");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          
          /**
           * FIX: Your backend authController sends { user: { ... } }
           * We must extract data.user specifically.
           */
          const profile = data.user; 

          if (profile) {
            setUser({
              name: profile.name || profile.username || "User",
              email: profile.email || "No email",
              id: profile.id,
            });
            localStorage.setItem("userId", profile.id);
          }
        } else {
          localStorage.removeItem("token");
          router.push("/signup");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({ name: "Error", email: "Connection failed", id: null });
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/");
  };

  const menuItems = [
    { name: "Dashboard", href: "/buyer", icon: <FaShoppingBag /> },
    { name: "All Products", href: "/buyer/allproducts", icon: <FaShoppingBag /> },
    { name: "Cart & Wishlist", href: "/buyer/cart", icon: <FaShoppingCart /> },
    { name: "My Orders", href: "/buyer/myorders", icon: <FaBoxOpen /> },
    { name: "Messages", href: "/buyer/message", icon: <FaUser /> },
    { name: "Profile", href: "/buyer/profile", icon: <FaUser /> },
    { name: "Logout", href: "/", icon: <FaSignOutAlt />, isLogout: true },
  ];

  const isActive = (href) => {
    if (href === "/buyer") return pathname === href;
    return pathname?.startsWith(href);
  };

  const styles = {
    wrapper: { display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
    sidebar: { width: "280px", padding: "32px 0", backgroundColor: "#033c8c", color: "#fff", display: "flex", flexDirection: "column", boxShadow: "4px 0 24px rgba(3, 60, 140, 0.12)" },
    sidebarHeader: { padding: "0 24px 32px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "24px" },
    logoContainer: { display: "flex", alignItems: "center", gap: "12px" },
    logoIcon: { fontSize: "32px", lineHeight: 1 },
    logoTitle: { fontSize: "24px", fontWeight: "700", color: "#aaff71", margin: "0 0 4px 0" },
    logoSubtitle: { fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: "500" },
    nav: { flex: 1, overflowY: "auto", overflowX: "hidden" },
    menuList: { listStyle: "none", padding: "0 16px", margin: 0 },
    menuItem: { marginBottom: "4px" },
    menuLink: { display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "12px 16px", borderRadius: "10px", transition: "all 0.2s ease", position: "relative", fontSize: "15px", fontWeight: "500", cursor: "pointer" },
    menuLinkActive: { backgroundColor: "rgba(170, 255, 113, 0.15)", color: "#aaff71" },
    menuIcon: { fontSize: "18px", color: "#c8b3ff", width: "20px", display: "flex", alignItems: "center", justifyContent: "center" },
    menuIconActive: { color: "#aaff71" },
    menuText: { flex: 1 },
    activeIndicator: { position: "absolute", right: "8px", width: "4px", height: "20px", backgroundColor: "#aaff71", borderRadius: "2px" },
    sidebarFooter: { padding: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", marginTop: "auto" },
    userCard: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "12px" },
    userAvatar: { width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#aaff71", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#033c8c", fontWeight: "bold" },
    userInfo: { flex: 1, minWidth: 0 },
    userName: { fontSize: "14px", fontWeight: "600", color: "#fff", margin: "0 0 2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    userEmail: { fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    main: { flex: 1, backgroundColor: "#f8fafc", minHeight: "100vh" },
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>🛍️</div>
            <div>
              <h2 style={styles.logoTitle}>ShopHub</h2>
              <p style={styles.logoSubtitle}>Buyer Panel</p>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <ul style={styles.menuList}>
            {menuItems.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li key={i} style={styles.menuItem}>
                  <Link
                    href={item.href}
                    onClick={item.isLogout ? handleLogout : undefined}
                    style={{
                      ...styles.menuLink,
                      ...(active ? styles.menuLinkActive : {}),
                    }}
                  >
                    <span style={{ ...styles.menuIcon, ...(active ? styles.menuIconActive : {}) }}>
                      {item.icon}
                    </span>
                    <span style={styles.menuText}>{item.name}</span>
                    {active && <div style={styles.activeIndicator} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              {user.name && user.name !== "Loading..." 
                ? user.name.charAt(0).toUpperCase() 
                : "👤"}
            </div>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{user.name}</p>
              <p style={styles.userEmail}>{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}