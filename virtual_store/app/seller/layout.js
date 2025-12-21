"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaTimes, FaBars, FaChartLine, FaUpload, FaBox, FaEnvelope } from "react-icons/fa";

export default function SellerLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  // Sidebar Menu Items
  const menuItems = [
    { name: "Dashboard", href: "/seller", icon: <FaChartLine /> },
    { name: "Upload Products", href: "/seller/upload", icon: <FaUpload /> },
    { name: "My Products", href: "/seller/product", icon: <FaBox /> },
    { name: "Messages", href: "/seller/messages", icon: <FaEnvelope /> },
    { name: "Logout", href: "/", icon: <FaTimes /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F3F4F6" }}>

      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? "250px" : "0px",
          overflow: "hidden",
          transition: "0.3s ease",
          backgroundColor: "#033c8cff",
          color: "#ffffff",
          padding: isOpen ? "20px" : "0px",
          position: "relative",
        }}
      >
        {/* Sidebar Header */}
        {isOpen && (
          <h2 style={{ fontSize: "1.6rem", marginBottom: "2rem", color: "#aaff71ff" }}>
            Seller Panel
          </h2>
        )}

        {/* Menu List */}
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {menuItems.map((item, index) => (
              <li key={index} style={{ marginBottom: "1rem" }}>
                <Link
                  href={item.href}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem",
                    borderRadius: "5px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#044a9f")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <span style={{ fontSize: "1.2rem", color: "#c8b3ff" }}>{item.icon}</span>
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Toggle for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "absolute",
            top: "20px",
            right: isOpen ? "-45px" : "-45px",
            width: "40px",
            height: "40px",
            borderRadius: "5px",
            backgroundColor: "#033c8cff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}