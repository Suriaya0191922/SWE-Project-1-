"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AllProductsPage() {
  return (
    // Suspense boundary is required when using useSearchParams in Next.js Client Components
    <Suspense fallback={<div style={styles.loadingScreen}>Loading Search results...</div>}>
      <ProductsListContent />
    </Suspense>
  );
}

function ProductsListContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_BASE_URL = "http://localhost:5000";

  // 1. Initial Load & URL Parameter Detection (Welcome page theke query catching)
  useEffect(() => {
    const urlQuery = searchParams.get("search");
    if (urlQuery) {
      setSearchTerm(urlQuery);
    }
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Initial filtering based on URL query
        const urlQuery = searchParams.get("search");
        if (urlQuery) {
          const initialFiltered = data.filter((p) =>
            p.productName.toLowerCase().includes(urlQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(urlQuery.toLowerCase())
          );
          setFilteredProducts(initialFiltered);
        } else {
          setFilteredProducts(data);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Real-time Filtering Logic (As you type in the search bar)
  useEffect(() => {
    const filtered = products.filter((p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // --- SECURE AUTH CHECKER ---
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const addToCart = async (product) => {
    const token = getAuthToken();
    
    if (!token) {
      alert("Please login first to add items to your cart!");
      router.push("/signup");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Added to cart ✅");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const addToWishlist = async (product) => {
    const token = getAuthToken();
    
    if (!token) {
      alert("Please login first to use Wishlist!");
      router.push("/signup");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Added to wishlist ❤️");
      } else {
        alert(data.message || "Already in wishlist!");
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <span style={{ fontSize: "48px" }}>⏳</span>
          <h3 style={styles.emptyTitle}>Loading products...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>All Products</h1>
          <p style={styles.subtitle}>
            Discover {filteredProducts.length} amazing products
          </p>
        </div>
      </div>

      <div style={styles.searchSection}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} style={styles.clearBtn}>✕</button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📦</span>
          <h3 style={styles.emptyTitle}>No products found</h3>
          <p style={styles.emptyText}>Try adjusting your search</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((p) => {
            const status = p.status?.toLowerCase() || "active";
            const isSold = status === "sold";

            return (
              <div key={p.id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <img 
                    src={p.images && p.images.length > 0 ? `${API_BASE_URL}/uploads/${p.images[0].imageUrl}` : "/placeholder.jpg"} 
                    alt={p.productName} 
                    style={{ ...styles.image, opacity: isSold ? 0.6 : 1 }} 
                    onError={(e) => e.target.src = "/placeholder.jpg"}
                  />
                  {isSold && <div style={styles.soldOverlay}>SOLD OUT</div>}
                </div>

                <div style={styles.cardContent}>
                  <h3 style={styles.productName}>{p.productName}</h3>
                  
                  <div style={styles.priceRow}>
                    <span style={styles.price}>
                      ৳{Number(p.price).toLocaleString('en-BD')}
                    </span>
                    <span style={{ ...styles.statusBadge, ...styles[status] }}>
                      {p.status || "Active"}
                    </span>
                  </div>

                  <p style={styles.description}>{p.description}</p>

                  <div style={styles.actions}>
                    <button
                      style={{ 
                        ...styles.cartBtn, 
                        ...(isSold ? styles.disabledBtn : {}) 
                      }}
                      onClick={() => !isSold && addToCart(p)}
                      disabled={isSold}
                    >
                      {isSold ? "❌ Out of Stock" : "🛒 Add to Cart"}
                    </button>

                    <div style={styles.iconBtns}>
                      <button
                        style={styles.iconBtn}
                        onClick={() => addToWishlist(p)}
                        title="Add to Wishlist"
                      >
                        ♥
                      </button>
                      <button
                        style={{ ...styles.iconBtn, ...styles.contactBtn }}
                        onClick={() => router.push(`/buyer/message?sellerId=${p.sellerId}&productId=${p.id}`)}
                        title="Contact Seller"
                      >
                        💬 Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" },
  loadingScreen: { textAlign: "center", padding: "100px", fontSize: "18px", color: "#033c8c" },
  header: { marginBottom: "32px" },
  title: { fontSize: "32px", fontWeight: "700", color: "#033c8c", margin: "0 0 8px 0" },
  subtitle: { fontSize: "16px", color: "#64748b", margin: 0, fontWeight: "400" },
  searchSection: { marginBottom: "32px" },
  searchWrapper: { position: "relative", maxWidth: "500px" },
  searchIcon: { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" },
  searchInput: { width: "100%", padding: "14px 48px 14px 48px", fontSize: "15px", border: "2px solid #e2e8f0", borderRadius: "12px", backgroundColor: "white", outline: "none", fontFamily: "inherit" },
  clearBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "#e2e8f0", border: "none", borderRadius: "6px", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyState: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "64px", display: "block", marginBottom: "16px" },
  emptyTitle: { fontSize: "24px", fontWeight: "600", color: "#1e293b", margin: "0 0 8px 0" },
  emptyText: { fontSize: "16px", color: "#64748b", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" },
  card: { backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", transition: "all 0.3s ease" },
  imageWrapper: { position: "relative", width: "100%", height: "220px", overflow: "hidden", backgroundColor: "#f1f5f9" },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  soldOverlay: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(0,0,0,0.7)", color: "white", padding: "8px 16px", borderRadius: "8px", fontWeight: "bold", pointerEvents: "none" },
  cardContent: { padding: "20px" },
  productName: { fontSize: "18px", fontWeight: "600", color: "#1e293b", margin: "0 0 12px 0", lineHeight: "1.4", minHeight: "50px" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  price: { fontSize: "24px", fontWeight: "700", color: "#033c8c" },
  statusBadge: { fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  active: { color: "#10b981", backgroundColor: "#d1fae5" },
  pending: { color: "#f59e0b", backgroundColor: "#fef3c7" },
  sold: { color: "#ef4444", backgroundColor: "#fee2e2" },
  description: { fontSize: "14px", color: "#64748b", margin: "0 0 16px 0", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "42px" },
  actions: { display: "flex", flexDirection: "column", gap: "10px" },
  cartBtn: { padding: "12px 16px", backgroundColor: "#033c8c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", width: "100%" },
  disabledBtn: { backgroundColor: "#cbd5e1", cursor: "not-allowed", color: "#64748b" },
  iconBtns: { display: "flex", gap: "8px" },
  iconBtn: { flex: 1, padding: "12px", backgroundColor: "#fff0f6", color: "#ff69b4", border: "2px solid #ff69b4", borderRadius: "10px", cursor: "pointer", fontSize: "18px", fontWeight: "600" },
  contactBtn: { backgroundColor: "#e8f5e9", color: "#4caf50", border: "2px solid #4caf50" },
};