"use client";

import { useState, useEffect } from "react";

export default function SellerDashboardPage() {
  const [products, setProducts] = useState([]);
  const [featuredCount, setFeaturedCount] = useState(0);

  // Load products from API / localStorage
  const loadProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data || []);
      setFeaturedCount((data || []).filter((p) => p.featured).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(data.message);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Styles
  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7f9",
    minHeight: "100vh",
  };

  const headerStyle = {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#033c8c",
    color: "#aaff71",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const cardContainerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  };

  const cardStyle = {
    flex: "1 1 200px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    color: "#033c8c",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffffcc",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const thStyle = {
    backgroundColor: "#033c8c",
    color: "#aaff71",
    padding: "10px",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  };

  const statusStyle = (status) => ({
    padding: "5px 10px",
    borderRadius: "5px",
    backgroundColor:
      status === "Sold"
        ? "#4caf50"
        : status === "Pending"
        ? "#ff9800"
        : "#2196f3",
    color: "#fff",
    fontWeight: "bold",
    display: "inline-block",
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1>Welcome Seller - Your Dashboard</h1>
      </div>

      {/* Dashboard Cards */}
      <div style={cardContainerStyle}>
        <div style={{ ...cardStyle, backgroundColor: "#c9fba8" }}>
          <h3>Total Products</h3>
          <p>{products.length} items</p>
        </div>
        <div style={{ ...cardStyle, backgroundColor: "#e0cff6" }}>
          <h3>Products Sold</h3>
          <p>{products.reduce((acc, p) => acc + (p.sold || 0), 0)} items</p>
        </div>
        <div style={{ ...cardStyle, backgroundColor: "#d0f5cd" }}>
          <h3>New Messages</h3>
          <p>{products.filter((p) => p.messages && p.messages.length > 0).length}</p>
        </div>
        <div style={{ ...cardStyle, backgroundColor: "#e7d4f7" }}>
          <h3>Featured Products</h3>
          <p>{featuredCount} items</p>
        </div>
      </div>

      {/* Products Table */}
      <div>
        <h2 style={{ color: "#033c8c", marginBottom: "10px" }}>Recent Activity</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.action || "N/A"}</td>
                <td style={tdStyle}>{p.dateAdded || "N/A"}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(p.status)}>{p.status || "Pending"}</span>
                </td>
                <td style={tdStyle}>
                  <button
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}