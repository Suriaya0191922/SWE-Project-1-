"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import productsData from "@/app/buyer/data/products";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setProducts(productsData);
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Welcome Back!</h1>
          <p style={styles.headerSubtitle}>Here's what's happening with your store today</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.statCard1 }}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Products</p>
            <h2 style={styles.statValue}>{products.length}</h2>
            <p style={styles.statChange}>Available items</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCard2 }}>
          <div style={styles.statIcon}>🛒</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Cart Items</p>
            <h2 style={styles.statValue}>{cart.length}</h2>
            <p style={styles.statChange}>Ready to checkout</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCard3 }}>
          <div style={styles.statIcon}>💝</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Wishlist</p>
            <h2 style={styles.statValue}>{wishlist.length}</h2>
            <p style={styles.statChange}>Saved for later</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCard4 }}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Featured</p>
            <h2 style={styles.statValue}>{products.slice(0, 4).length}</h2>
            <p style={styles.statChange}>Special items</p>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <p style={styles.sectionSubtitle}>Handpicked items just for you</p>
        </div>
        <Link href="/buyer/allproducts">
          <button style={styles.viewAllBtn}>
            View All Products
            <span style={styles.arrow}>→</span>
          </button>
        </Link>
      </div>

      {/* Products Grid */}
      <div style={styles.productsGrid}>
        {products.slice(0, 4).map((p) => (
          <div key={p.id} style={styles.productCard}>
            <div style={styles.imageWrapper}>
              <img
                src={p.image}
                alt={p.name}
                style={styles.productImage}
              />
              <div style={styles.imageBadge}>New</div>
            </div>
            <div style={styles.productContent}>
              <h3 style={styles.productName}>{p.name}</h3>
              <p style={styles.productPrice}>${p.price}</p>
              <div style={styles.productActions}>
                <button style={styles.addToCartBtn}>
                  <span style={styles.btnIcon}>🛒</span>
                  Add to Cart
                </button>
                <button style={styles.wishlistBtn}>
                  <span style={styles.btnIcon}>♥</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Professional Styles ---------- */
const styles = {
  container: {
    padding: "32px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "32px",
  },
  headerTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  headerSubtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
    fontWeight: "400",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "48px",
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  statCard1: {
    borderLeft: "4px solid #c9fba8",
  },
  statCard2: {
    borderLeft: "4px solid #e0cff6",
  },
  statCard3: {
    borderLeft: "4px solid #d0f5cd",
  },
  statCard4: {
    borderLeft: "4px solid #e7d4f7",
  },
  statIcon: {
    fontSize: "36px",
    lineHeight: 1,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0 0 4px 0",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 4px 0",
    lineHeight: 1,
  },
  statChange: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: 0,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 4px 0",
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  viewAllBtn: {
    padding: "12px 24px",
    backgroundColor: "#033c8c",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(3, 60, 140, 0.2)",
  },
  arrow: {
    fontSize: "16px",
    transition: "transform 0.3s ease",
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  productCard: {
    background: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "220px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  imageBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#aaff71",
    color: "#033c8c",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  productContent: {
    padding: "20px",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
    lineHeight: "1.4",
  },
  productPrice: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 16px 0",
  },
  productActions: {
    display: "flex",
    gap: "8px",
  },
  addToCartBtn: {
    flex: 1,
    padding: "12px 16px",
    backgroundColor: "#033c8c",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  wishlistBtn: {
    padding: "12px 16px",
    backgroundColor: "#fff0f6",
    color: "#ff69b4",
    border: "2px solid #ff69b4",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnIcon: {
    fontSize: "16px",
  },
};