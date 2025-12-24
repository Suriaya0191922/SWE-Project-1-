"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [activeTab, setActiveTab] = useState("cart");
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]); // Initialized empty
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
      return;
    }

    try {
      // Fetch real cart from Backend
      const cartRes = await fetch("http://localhost:5001/api/cart", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      // Fetch ONLY real wishlist from localStorage
      const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistItems(wishlistData);

    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) fetchCartData();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const formatPrice = (amount) => `৳${Number(amount).toLocaleString('en-BD')}`;

  if (loading) return <div style={styles.container}><p style={{textAlign: 'center', padding: '50px'}}>Loading...</p></div>;

  return (
    <div style={styles.container}>
      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        <button 
          style={{ ...styles.tabBtn, ...(activeTab === "cart" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("cart")}
        >
          🛒 My Cart ({cartItems.length})
        </button>
        <button 
          style={{ ...styles.tabBtn, ...(activeTab === "wishlist" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("wishlist")}
        >
          ❤️ My Wishlist ({wishlistItems.length})
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === "cart" ? (
          <div style={styles.fullWidthContent}>
            <h1 style={styles.title}>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <div style={styles.emptyMsg}>Your cart is empty</div>
            ) : (
              <div style={styles.itemsSection}>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.cartCard}>
                    <img
                      src={item.product.images?.[0]?.imageUrl ? `http://localhost:5001/uploads/${item.product.images[0].imageUrl}` : "/placeholder.jpg"}
                      alt={item.product.productName}
                      style={styles.cartImage}
                    />
                    <div style={styles.cartInfo}>
                      <h3 style={styles.cartTitle}>{item.product.productName}</h3>
                      <p style={styles.cartPrice}>{formatPrice(item.product.price)}</p>
                      <p style={styles.qtyText}>Quantity: {item.quantity}</p>
                    </div>
                    <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                      🗑️ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.fullWidthContent}>
            <h1 style={styles.title}>My Wishlist</h1>
            {wishlistItems.length === 0 ? (
              <div style={styles.emptyMsg}>No items saved in wishlist</div>
            ) : (
              <div style={styles.wishlistGrid}>
                {wishlistItems.map((item) => (
                  <div key={item.id} style={styles.wishlistCard}>
                    <div style={styles.wishlistImageWrapper}>
                      <img src={item.image} alt={item.name} style={styles.wishlistImage} />
                      <button style={styles.removeWishBtn} onClick={() => removeFromWishlist(item.id)}>✕</button>
                    </div>
                    <div style={styles.wishlistContent}>
                      <h3 style={styles.wishlistName}>{item.name}</h3>
                      <p style={styles.wishlistPrice}>{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  tabNav: { backgroundColor: "white", borderBottom: "1px solid #e2e8f0", display: "flex" },
  tabBtn: { flex: 1, padding: "16px", border: "none", background: "none", cursor: "pointer", fontWeight: "600", fontSize: "16px", transition: "0.3s" },
  activeTab: { color: "#033c8c", borderBottom: "3px solid #033c8c" },
  content: { maxWidth: "900px", margin: "0 auto", padding: "32px" },
  title: { fontSize: "28px", fontWeight: "700", color: "#033c8c", marginBottom: "24px" },
  fullWidthContent: { width: "100%" },
  itemsSection: { display: "flex", flexDirection: "column", gap: "16px" },
  cartCard: { background: "white", borderRadius: "12px", padding: "20px", display: "flex", gap: "20px", alignItems: "center", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  cartImage: { width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px" },
  cartInfo: { flex: 1 },
  cartTitle: { fontSize: "18px", fontWeight: "600", color: "#1e293b", margin: "0 0 4px 0" },
  cartPrice: { color: "#033c8c", fontWeight: "700", fontSize: "17px", margin: "0 0 4px 0" },
  qtyText: { fontSize: "14px", color: "#64748b" },
  removeBtn: { padding: "8px 12px", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "8px", cursor: "pointer", background: "white", fontWeight: "500", transition: "0.2s" },
  emptyMsg: { textAlign: "center", padding: "100px 0", color: "#64748b", fontSize: "18px" },
  wishlistGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  wishlistCard: { background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" },
  wishlistImageWrapper: { position: "relative" },
  wishlistImage: { width: "100%", height: "180px", objectFit: "cover" },
  removeWishBtn: { position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  wishlistContent: { padding: "15px" },
  wishlistName: { fontSize: "15px", fontWeight: "600", color: "#1e293b" },
  wishlistPrice: { color: "#033c8c", fontWeight: "700", marginTop: "5px" }
};