"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
      return;
    }

    try {
      // Fetch products
      const productsRes = await fetch("http://localhost:5001/api/products");
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.slice(0, 6)); // Show only first 6 products
      }

      // Fetch cart
      const cartRes = await fetch("http://localhost:5001/api/cart", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      // Fetch orders
      const ordersRes = await fetch("http://localhost:5001/api/orders", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.slice(0, 5)); // Show only recent 5 orders
      }

      // Fetch wishlist (still localStorage for now)
      const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(wishlistData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <span style={{ fontSize: "48px" }}>⏳</span>
          <h3 style={{ fontSize: "24px", fontWeight: "600", color: "#1e293b", margin: "16px 0" }}>
            Loading your dashboard...
          </h3>
        </div>
      </div>
    );
  }

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
            <h2 style={styles.statValue}>{cartItems.length}</h2>
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
          <div style={styles.statIcon}>📋</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>My Orders</p>
            <h2 style={styles.statValue}>{orders.length}</h2>
            <p style={styles.statChange}>Order history</p>
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
                src={p.images && p.images.length > 0 ? `http://localhost:5001/uploads/${p.images[0].imageUrl}` : "/placeholder.jpg"}
                alt={p.productName}
                style={styles.productImage}
              />
              <div style={styles.imageBadge}>New</div>
            </div>
            <div style={styles.productContent}>
              <h3 style={styles.productName}>{p.productName}</h3>
              <p style={styles.productPrice}>${p.price}</p>
              <div style={styles.productActions}>
                <button 
                  style={styles.addToCartBtn}
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Please login first");
                      router.push("/signup");
                      return;
                    }
                    // Add to cart logic here
                    alert("Add to cart functionality coming soon!");
                  }}
                >
                  Add to Cart
                </button>
                <button style={styles.wishlistBtn}>❤️</button>
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
