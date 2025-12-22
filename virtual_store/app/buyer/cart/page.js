"use client";
import { useState } from "react";

// Sample product data for demonstration
const sampleCartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    quantity: 1,
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    quantity: 2,
  },
];

const sampleWishlistItems = [
  {
    id: 3,
    name: "Leather Backpack",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Portable Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
  },
];

export default function CartWishlistPages() {
  const [activeTab, setActiveTab] = useState("cart");
  const [cartItems, setCartItems] = useState(sampleCartItems);
  const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems);

  // Cart Functions
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    showNotification("Removed from cart", "success");
  };

  const moveToWishlist = (item) => {
    if (!wishlistItems.find(w => w.id === item.id)) {
      setWishlistItems([...wishlistItems, { ...item, quantity: undefined }]);
      removeFromCart(item.id);
      showNotification("Moved to wishlist ❤️", "success");
    }
  };

  const clearCart = () => {
    if (window.confirm("Clear all items from cart?")) {
      setCartItems([]);
      showNotification("Cart cleared", "success");
    }
  };

  // Wishlist Functions
  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    showNotification("Removed from wishlist", "success");
  };

  const moveToCart = (item) => {
    if (!cartItems.find(c => c.id === item.id)) {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      removeFromWishlist(item.id);
      showNotification("Moved to cart 🛒", "success");
    }
  };

  const showNotification = (message, type) => {
    alert(message);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div style={styles.container}>
      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "cart" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("cart")}
        >
          <span style={styles.tabIcon}>🛒</span>
          Shopping Cart
          {cartItems.length > 0 && (
            <span style={styles.badge}>{cartItems.length}</span>
          )}
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "wishlist" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("wishlist")}
        >
          <span style={styles.tabIcon}>❤️</span>
          Wishlist
          {wishlistItems.length > 0 && (
            <span style={styles.badge}>{wishlistItems.length}</span>
          )}
        </button>
      </div>

      {/* Cart Page */}
      {activeTab === "cart" && (
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Shopping Cart</h1>
              <p style={styles.subtitle}>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            {cartItems.length > 0 && (
              <button style={styles.clearBtn} onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>🛒</span>
              <h3 style={styles.emptyTitle}>Your cart is empty</h3>
              <p style={styles.emptyText}>Add items to get started</p>
            </div>
          ) : (
            <div style={styles.layout}>
              {/* Cart Items */}
              <div style={styles.itemsSection}>
                {cartItems.map((item) => (
                  <div key={item.id} style={styles.cartCard}>
                    <img src={item.image} alt={item.name} style={styles.cartImage} />
                    
                    <div style={styles.cartInfo}>
                      <h3 style={styles.cartName}>{item.name}</h3>
                      <p style={styles.cartPrice}>${item.price.toFixed(2)}</p>
                      
                      <div style={styles.cartActions}>
                        <div style={styles.quantityControl}>
                          <button
                            style={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span style={styles.qtyDisplay}>{item.quantity}</span>
                          <button
                            style={styles.qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <div style={styles.actionBtns}>
                          <button
                            style={styles.actionBtn}
                            onClick={() => moveToWishlist(item)}
                          >
                            ♥ Wishlist
                          </button>
                          <button
                            style={styles.actionBtn}
                            onClick={() => removeFromCart(item.id)}
                          >
                            🗑 Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.itemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div style={styles.summarySection}>
                <div style={styles.summaryCard}>
                  <h2 style={styles.summaryTitle}>Order Summary</h2>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Subtotal</span>
                    <span style={styles.summaryValue}>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Shipping</span>
                    <span style={styles.summaryValue}>${shipping.toFixed(2)}</span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>Tax (8%)</span>
                    <span style={styles.summaryValue}>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div style={styles.divider}></div>
                  
                  <div style={styles.summaryRow}>
                    <span style={styles.totalLabel}>Total</span>
                    <span style={styles.totalValue}>${total.toFixed(2)}</span>
                  </div>
                  
                  <button style={styles.checkoutBtn}>
                    Proceed to Checkout
                  </button>
                  
                  <div style={styles.secureInfo}>
                    <span>🔒</span>
                    <span style={styles.secureText}>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Page */}
      {activeTab === "wishlist" && (
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>My Wishlist</h1>
              <p style={styles.subtitle}>
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>❤️</span>
              <h3 style={styles.emptyTitle}>Your wishlist is empty</h3>
              <p style={styles.emptyText}>Save items you love for later</p>
            </div>
          ) : (
            <div style={styles.wishlistGrid}>
              {wishlistItems.map((item) => (
                <div key={item.id} style={styles.wishlistCard}>
                  <div style={styles.wishlistImageWrapper}>
                    <img src={item.image} alt={item.name} style={styles.wishlistImage} />
                    <button
                      style={styles.removeWishBtn}
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div style={styles.wishlistContent}>
                    <h3 style={styles.wishlistName}>{item.name}</h3>
                    <p style={styles.wishlistPrice}>${item.price.toFixed(2)}</p>
                    
                    <div style={styles.wishlistActions}>
                      <button
                        style={styles.wishlistCartBtn}
                        onClick={() => moveToCart(item)}
                      >
                        <span>🛒</span>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  tabNav: {
    backgroundColor: "white",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    gap: "4px",
    padding: "0 32px",
  },
  tab: {
    padding: "16px 24px",
    border: "none",
    backgroundColor: "transparent",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
    transition: "all 0.3s ease",
    borderBottom: "3px solid transparent",
  },
  activeTab: {
    color: "#033c8c",
    borderBottomColor: "#aaff71",
  },
  tabIcon: {
    fontSize: "18px",
  },
  badge: {
    backgroundColor: "#aaff71",
    color: "#033c8c",
    fontSize: "12px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "12px",
    minWidth: "20px",
    textAlign: "center",
  },
  content: {
    padding: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
  },
  clearBtn: {
    padding: "10px 20px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "2px solid #dc2626",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  emptyIcon: {
    fontSize: "64px",
    display: "block",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "24px",
  },
  itemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cartCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    gap: "20px",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
  },
  cartImage: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    backgroundColor: "#f1f5f9",
  },
  cartInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cartName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },
  cartPrice: {
    fontSize: "16px",
    color: "#64748b",
    margin: 0,
  },
  cartActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "auto",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    padding: "4px",
  },
  qtyBtn: {
    width: "32px",
    height: "32px",
    border: "none",
    backgroundColor: "#f8fafc",
    color: "#033c8c",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  qtyDisplay: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    minWidth: "30px",
    textAlign: "center",
  },
  actionBtns: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    transition: "all 0.3s ease",
  },
  itemTotal: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#033c8c",
    minWidth: "100px",
    textAlign: "right",
  },
  summarySection: {
    position: "sticky",
    top: "32px",
    height: "fit-content",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e2e8f0",
  },
  summaryTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 20px 0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  summaryLabel: {
    fontSize: "15px",
    color: "#64748b",
  },
  summaryValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "16px 0",
  },
  totalLabel: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  totalValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#033c8c",
  },
  checkoutBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#033c8c",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "20px",
    transition: "all 0.3s ease",
  },
  secureInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
  },
  secureText: {
    fontSize: "13px",
    color: "#64748b",
  },
  wishlistGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  wishlistCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
  },
  wishlistImageWrapper: {
    position: "relative",
    width: "100%",
    height: "220px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  wishlistImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeWishBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "36px",
    height: "36px",
    backgroundColor: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "700",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  wishlistContent: {
    padding: "20px",
  },
  wishlistName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0 0 8px 0",
    minHeight: "48px",
  },
  wishlistPrice: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#033c8c",
    margin: "0 0 16px 0",
  },
  wishlistActions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  wishlistCartBtn: {
    width: "100%",
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
};
