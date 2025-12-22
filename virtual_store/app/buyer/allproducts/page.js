
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import productsData from "@/app/buyer/data/products";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // 🛒 Add to Cart
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.find((item) => item.id === product.id)) {
      showNotification("Already in cart!", "warning");
      return;
    }
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    showNotification("Added to cart ✅", "success");
  };

  // ❤️ Add to Wishlist
  const addToWishlist = (product) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.find((item) => item.id === product.id)) {
      showNotification("Already in wishlist!", "warning");
      return;
    }
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    showNotification("Added to wishlist ❤️", "success");
  };

  // 💬 Contact Seller (navigate to messaging page)
  const contactSeller = (product) => {
    // Use product.sellerId or generate a dummy one for now
    const sellerId = product.sellerId || product.id; // replace with actual seller id if available
    router.push(`/buyer/message?seller=${sellerId}&product=${product.id}`);
  };

  const showNotification = (message, type) => {
    alert(message);
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>All Products</h1>
          <p style={styles.subtitle}>
            Discover {filteredProducts.length} amazing products
          </p>
        </div>
      </div>

      {/* Search Bar */}
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
            <button
              onClick={() => setSearchTerm("")}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📦</span>
          <h3 style={styles.emptyTitle}>No products found</h3>
          <p style={styles.emptyText}>Try adjusting your search</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((p) => (
            <div key={p.id} style={styles.card}>
              {/* Product Image */}
              <div style={styles.imageWrapper}>
                <img src={p.image} alt={p.name} style={styles.image} />
              </div>

              {/* Product Info */}
              <div style={styles.cardContent}>
                <h3 style={styles.productName}>{p.name}</h3>
                <div style={styles.priceRow}>
                  <span style={styles.price}>${p.price}</span>
                  <span style={styles.stock}>In Stock</span>
                </div>

                <p style={styles.actions}>{p.description}</p>

                {/* Action Buttons */}
                <div style={styles.actions}>
                  <button
                    style={styles.cartBtn}
                    onClick={() => addToCart(p)}
                  >
                    🛒 Add to Cart
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
  onClick={() => router.push(`/buyer/message?sellerId=${p.sellerId || p.id}&productId=${p.id}`)}
  title="Contact Seller"
>
  Contact
</button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  container: { padding: "32px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" },
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
  card: { backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", transition: "all 0.3s ease", cursor: "pointer" },
  imageWrapper: { position: "relative", width: "100%", height: "220px", overflow: "hidden", backgroundColor: "#f1f5f9" },
  image: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" },
  cardContent: { padding: "20px" },
  productName: { fontSize: "18px", fontWeight: "600", color: "#1e293b", margin: "0 0 12px 0", lineHeight: "1.4", minHeight: "50px" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  price: { fontSize: "24px", fontWeight: "700", color: "#033c8c" },
  stock: { fontSize: "12px", fontWeight: "600", color: "#10b981", backgroundColor: "#d1fae5", padding: "4px 10px", borderRadius: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
  actions: { display: "flex", flexDirection: "column", gap: "10px" },
  cartBtn: { padding: "12px 16px", backgroundColor: "#033c8c", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%" },
  iconBtns: { display: "flex", gap: "8px" },
  iconBtn: { flex: 1, padding: "12px", backgroundColor: "#fff0f6", color: "#ff69b4", border: "2px solid #ff69b4", borderRadius: "10px", cursor: "pointer", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" },
  contactBtn: { backgroundColor: "#e8f5e9", color: "#4caf50", border: "2px solid #4caf50" },
};
