"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [activeTab, setActiveTab] = useState("cart");
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
      return;
    }

    try {
      const cartRes = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      const wishlistRes = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlistItems(wishlistData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic: Status 'sold' ba 'pending' thakle-i sudhu block hobe. 
  // 'Active' ba 'available' thakle block hobe na.
  const hasUnavailableItems = useMemo(() => {
    return cartItems.some(item => {
      const status = item.product?.status?.toLowerCase();
      return status === "pending" || status === "sold";
    });
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    
    if (hasUnavailableItems) {
      return alert("Please remove items that are already pending or sold before proceeding.");
    }

    if (cartItems.length === 0) return alert("Your cart is empty!");

    if (!confirm("Are you sure you want to place this order?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Order Placed Successfully! 🎉 The product is now marked as Sold.");
        router.push("/buyer/myorders");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to place order.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  const getProductImage = (item) => {
    const imagePath = item.product?.images?.[0]?.imageUrl;
    if (!imagePath) return "/placeholder.jpg";
    return imagePath.startsWith("http") ? imagePath : `${API_BASE_URL}/uploads/${imagePath}`;
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) fetchData();
    } catch (error) { console.error("Error:", error); }
  };

  const removeFromWishlist = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (response.ok) fetchData();
    } catch (error) { console.error("Error removing wishlist item:", error); }
  };

  const formatPrice = (amount) => `৳${Number(amount).toLocaleString('en-BD')}`;

  if (loading) return <div style={styles.container}><p style={{textAlign: 'center', padding: '50px'}}>Loading...</p></div>;

  return (
    <div style={styles.container}>
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
        <div style={styles.mainLayout}>
          <div style={styles.itemsColumn}>
            <h1 style={styles.title}>{activeTab === "cart" ? "Shopping Cart" : "My Wishlist"}</h1>
            
            {(activeTab === "cart" ? cartItems : wishlistItems).length === 0 ? (
              <div style={styles.emptyMsg}>
                {activeTab === "cart" ? "Your cart is empty" : "Your wishlist is empty"}
              </div>
            ) : (
              <div style={styles.itemsSection}>
                {(activeTab === "cart" ? cartItems : wishlistItems).map((item) => {
                  const status = item.product?.status?.toLowerCase();
                  const isBlocked = activeTab === "cart" && (status === "pending" || status === "sold");
                  
                  return (
                    <div key={item.id} style={{
                      ...styles.cartCard,
                      border: isBlocked ? "1.5px solid #ef4444" : "1px solid #e2e8f0",
                      backgroundColor: isBlocked ? "#fffafb" : "white"
                    }}>
                      <img
                        src={getProductImage(item)}
                        alt="product"
                        style={styles.cartImage}
                        onError={(e) => e.target.src = "/placeholder.jpg"}
                      />
                      <div style={styles.cartInfo}>
                        <h3 style={styles.cartTitle}>{item.product?.productName}</h3>
                        <p style={styles.cartPrice}>{formatPrice(item.product?.price)}</p>
                        {activeTab === "cart" && (
                          <p style={styles.qtyText}>Quantity: {item.quantity}</p>
                        )}
                        {isBlocked && (
                          <p style={styles.errorText}>
                            ⚠️ Product is {item.product?.status}. Remove it to proceed.
                          </p>
                        )}
                      </div>
                      <button 
                        style={styles.removeBtn} 
                        onClick={() => activeTab === "cart" ? removeFromCart(item.id) : removeFromWishlist(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {activeTab === "cart" && cartItems.length > 0 && (
            <div style={styles.summarySidebar}>
              <div style={styles.summaryCard}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>
                <div style={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Delivery:</span>
                  <span style={{color: '#10b981'}}>FREE</span>
                </div>
                <hr style={styles.divider} />
                <div style={{...styles.summaryRow, fontWeight: '700', fontSize: '18px'}}>
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <button 
                  style={{
                    ...styles.placeOrderBtn,
                    backgroundColor: hasUnavailableItems ? "#cbd5e1" : "#033c8c",
                    cursor: hasUnavailableItems ? "not-allowed" : "pointer"
                  }} 
                  onClick={handlePlaceOrder}
                  disabled={hasUnavailableItems}
                >
                  {hasUnavailableItems ? "Remove Blocked Items" : "Place Order Now"}
                </button>
                <p style={styles.safeNote}>🛡️ Secure Transaction</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ... styles remain the same as your previous code ...
const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
  tabNav: { backgroundColor: "white", borderBottom: "1px solid #e2e8f0", display: "flex" },
  tabBtn: { flex: 1, padding: "16px", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: "3px solid transparent", background: "none", cursor: "pointer", fontWeight: "600", fontSize: "16px", transition: "0.3s", outline: "none" },
  activeTab: { color: "#033c8c", borderBottom: "3px solid #033c8c" },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "32px" },
  mainLayout: { display: "flex", gap: "32px", flexWrap: "wrap" },
  itemsColumn: { flex: "2", minWidth: "350px" },
  summarySidebar: { flex: "1", minWidth: "300px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#033c8c", marginBottom: "24px" },
  itemsSection: { display: "flex", flexDirection: "column", gap: "16px" },
  cartCard: { borderRadius: "12px", padding: "16px", display: "flex", gap: "16px", alignItems: "center", transition: "0.2s" },
  cartImage: { width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" },
  cartInfo: { flex: 1 },
  cartTitle: { fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: 0 },
  cartPrice: { color: "#033c8c", fontWeight: "700", fontSize: "15px" },
  qtyText: { fontSize: "12px", color: "#64748b" },
  errorText: { fontSize: "12px", color: "#ef4444", fontWeight: "bold", marginTop: "4px" },
  removeBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", opacity: 0.6 },
  summaryCard: { background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", position: "sticky", top: "20px" },
  summaryTitle: { fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#1e293b" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#64748b" },
  divider: { border: "0", borderTop: "1px solid #e2e8f0", margin: "16px 0" },
  placeOrderBtn: { width: "100%", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: "600", transition: "0.3s" },
  safeNote: { textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "12px" },
  emptyMsg: { textAlign: "center", padding: "100px 0", color: "#64748b", fontSize: "18px" }
};