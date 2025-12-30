"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // New state for recommended products
  const [aiAdvice, setAiAdvice] = useState(""); // New state for LLM text
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
      // 1. Fetch featured products (general)
      const productsRes = await fetch("http://localhost:5000/api/products");
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.slice(0, 4));
      }

      // 2. Fetch cart
      const cartRes = await fetch("http://localhost:5000/api/cart", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      // 3. Fetch orders & Use latest order for Recommendations
      const ordersRes = await fetch("http://localhost:5000/api/orders", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.slice(0, 5));

        // RECOMMENDATION LOGIC: If user has an order, get personalized suggestions
        if (ordersData.length > 0) {
          const lastOrder = ordersData[0];
          const purchasedProductId = lastOrder.items[0]?.productId;

          if (purchasedProductId) {
            const recRes = await fetch(`http://localhost:5000/api/products/recommendations/${purchasedProductId}`);
            if (recRes.ok) {
              const recData = await recRes.json();
              setRecommendations(recData.categoryRecommendations || []);
              setAiAdvice(recData.llmAdvice || "");
            }
          }
        }
      }

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
          <h3 style={styles.sectionTitle}>Loading your CUET dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Welcome Back!</h1>
          <p style={styles.headerSubtitle}>Personalized gear for your CUET journey</p>
        </div>
      </header>

      {/* Stats Cards (Kept as per your original) */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.statCard1 }}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Products</p>
            <h2 style={styles.statValue}>{products.length}</h2>
          </div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCard2 }}>
          <div style={styles.statIcon}>🛒</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Cart Items</p>
            <h2 style={styles.statValue}>{cartItems.length}</h2>
          </div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCard3 }}>
          <div style={styles.statIcon}>💝</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Wishlist</p>
            <h2 style={styles.statValue}>{wishlist.length}</h2>
          </div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCard4 }}>
          <div style={styles.statIcon}>📋</div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>My Orders</p>
            <h2 style={styles.statValue}>{orders.length}</h2>
          </div>
        </div>
      </div>

      {/* --- AI RECOMMENDATION SECTION --- */}
      {aiAdvice && (
        <div style={styles.aiBanner}>
          <div style={{ flex: 1 }}>
            <h4 style={styles.aiLabel}>✨ CUET SMART ASSISTANT</h4>
            <p style={styles.aiText}>"{aiAdvice}"</p>
          </div>
          <span style={{ fontSize: "40px" }}>🎓</span>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginBottom: "48px" }}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Recommended for Your Dept.</h2>
              <p style={styles.sectionSubtitle}>Based on your last purchase</p>
            </div>
          </div>
          <div style={styles.productsGrid}>
            {recommendations.map((p) => (
              <ProductCard key={p.id} p={p} router={router} />
            ))}
          </div>
        </div>
      )}

      {/* --- FEATURED PRODUCTS SECTION --- */}
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <p style={styles.sectionSubtitle}>Handpicked items just for you</p>
        </div>
        <Link href="/buyer/allproducts">
          <button style={styles.viewAllBtn}>
            View All Products <span style={styles.arrow}>→</span>
          </button>
        </Link>
      </div>

      <div style={styles.productsGrid}>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} router={router} />
        ))}
      </div>
    </div>
  );
}

// Sub-component for clean code
function ProductCard({ p, router }) {
  return (
    <div style={styles.productCard}>
      <div style={styles.imageWrapper}>
        <img
          src={p.images && p.images.length > 0 ? `http://localhost:5000/uploads/${p.images[0].imageUrl}` : "/placeholder.jpg"}
          alt={p.productName}
          style={styles.productImage}
        />
        <div style={styles.imageBadge}>{p.condition || "New"}</div>
      </div>
      <div style={styles.productContent}>
        <h3 style={styles.productName}>{p.productName}</h3>
        <p style={styles.productPrice}>৳{p.price}</p>
        <div style={styles.productActions}>
          <button style={styles.addToCartBtn} onClick={() => alert("Coming soon!")}>
            Add to Cart
          </button>
          <button style={styles.wishlistBtn}>❤️</button>
        </div>
      </div>
    </div>
  );
}

// Add these new styles to your existing styles object
const extraStyles = {
  aiBanner: {
    background: "linear-gradient(135deg, #033c8c 0%, #6366f1 100%)",
    padding: "24px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "32px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 10px 20px rgba(3, 60, 140, 0.15)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  aiLabel: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    margin: "0 0 8px 0",
    opacity: 0.8,
  },
  aiText: {
    fontSize: "18px",
    fontWeight: "500",
    margin: 0,
    lineHeight: "1.5",
    fontStyle: "italic",
  }
};

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
  statCard1: { borderLeft: "4px solid #c9fba8" },
  statCard2: { borderLeft: "4px solid #e0cff6" },
  statCard3: { borderLeft: "4px solid #d0f5cd" },
  statCard4: { borderLeft: "4px solid #e7d4f7" },
  statIcon: { fontSize: "36px", lineHeight: 1 },
  statContent: { flex: 1 },
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
    boxShadow: "0 2px 8px rgba(3, 60, 140, 0.2)",
  },
  arrow: { fontSize: "16px" },
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
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "220px",
    backgroundColor: "#f1f5f9",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#aaff71",
    color: "#033c8c",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },
  productContent: { padding: "20px" },
  productName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  productPrice: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 16px 0",
  },
  productActions: { display: "flex", gap: "8px" },
  addToCartBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#033c8c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  wishlistBtn: {
    padding: "10px",
    backgroundColor: "#fff0f6",
    border: "1px solid #ff69b4",
    borderRadius: "8px",
    cursor: "pointer",
  },
  
  /* --- Added AI Specific Styles directly inside the object --- */
  aiBanner: {
    background: "linear-gradient(135deg, #033c8c 0%, #6366f1 100%)",
    padding: "24px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "32px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 10px 20px rgba(3, 60, 140, 0.15)",
  },
  aiLabel: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    margin: "0 0 8px 0",
    opacity: 0.8,
  },
  aiText: {
    fontSize: "18px",
    fontWeight: "500",
    margin: 0,
    lineHeight: "1.5",
    fontStyle: "italic",
  }
};