"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";

const API_BASE_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

let socket = null;

export default function BuyerMessages() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => console.log("WebSocket connected"));
    socket.on("disconnect", () => console.log("WebSocket disconnected"));

    socket.on("message:new", (data) => {
      const { message, conversationUpdated } = data;
      if (selectedConversation && 
          (message.senderId === selectedConversation.id || 
           message.receiverId === selectedConversation.id)) {
        setMessages((prev) => [...prev, message]);
      }
      if (conversationUpdated) fetchConversations();
    });

    socket.on("message:sent", () => fetchConversations());

    socket.on("typing:started", ({ userId }) => {
      if (selectedConversation && userId === selectedConversation.id) setIsTyping(true);
    });

    socket.on("typing:stopped", ({ userId }) => {
      if (selectedConversation && userId === selectedConversation.id) setIsTyping(false);
    });

    socket.on("user:online", ({ userId }) => setOnlineUsers((prev) => new Set([...prev, userId])));
    socket.on("user:offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    socket.on("messages:read", () => fetchConversations());

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;

      const data = await response.json();
      const messagesData = Array.isArray(data) ? data : data.data ?? [];

      let currentUserId = null;
      if (messagesData.length > 0) {
        // Simple logic to find current user ID from first message
        currentUserId = messagesData[0].senderId === messagesData[0].sender?.id 
          ? messagesData[0].receiverId : messagesData[0].senderId;
      }

      const map = new Map();
      messagesData.forEach((msg) => {
        const other = msg.senderId === currentUserId ? msg.receiver : msg.sender;
        if (!other || !other.id) return;

        const existing = map.get(other.id);
        if (!existing) {
          map.set(other.id, {
            seller: other,
            product: msg.product ?? null,
            lastMessage: msg,
            unreadCount: (msg.receiverId === currentUserId && !msg.isRead) ? 1 : 0,
          });
        } else {
          if (new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
            existing.lastMessage = msg;
            existing.product = msg.product ?? existing.product;
          }
          if (msg.receiverId === currentUserId && !msg.isRead) existing.unreadCount += 1;
        }
      });

      setConversations(Array.from(map.values()).sort((a, b) => 
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      ));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (sellerId, productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const url = productId
        ? `${API_BASE_URL}/messages/conversation/${sellerId}?productId=${productId}`
        : `${API_BASE_URL}/messages/conversation/${sellerId}`;

      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) {
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : data.data ?? []);
      }
    } catch (error) { console.error(error); }
  };

  // --- UPDATED INITIALIZATION LOGIC ---
  // Initialize from URL params - Version 2 (Removed problematic user fetch)
  useEffect(() => {
    const initializeConversation = async () => {
      const sellerId = searchParams.get("sellerId");
      const productId = searchParams.get("productId");
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        // 1. Fetch the product first. 
        // We get the seller info FROM the product, so we never call /api/users
        if (productId) {
          const productRes = await fetch(`${API_BASE_URL}/products/${productId}`);
          if (productRes.ok) {
            const product = await productRes.json();
            setSelectedProduct(product);
            
            // If the backend is correct, product.seller contains the name and ID
            if (product.seller) {
              setSelectedConversation(product.seller);
            }
          }
        } 

        // 2. Load the message history regardless of whether the product fetch succeeded
        if (sellerId) {
          fetchConversation(sellerId, productId || null);
        }
        
        // 3. Load the sidebar list
        fetchConversations();
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initializeConversation();
  }, [searchParams]);
  // ------------------------------------

  const handleTyping = () => {
    if (!socket || !selectedConversation) return;
    socket.emit("typing:start", { receiverId: selectedConversation.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", { receiverId: selectedConversation.id });
    }, 1000);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receiverId: selectedConversation.id,
          content: newMessage.trim(),
          productId: selectedProduct?.id || null,
        }),
      });
      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) => [...prev, sentMessage.data ?? sentMessage]);
        setNewMessage("");
        if (socket) socket.emit("typing:stop", { receiverId: selectedConversation.id });
      }
    } catch (error) { console.error(error); } finally { setSending(false); }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleConversationClick = (conv) => {
    setSelectedConversation(conv.seller);
    setSelectedProduct(conv.product ?? null);
    fetchConversation(conv.seller.id, conv.product?.id ?? null);
  };

  if (loading) return <div style={styles.container}><div style={styles.loadingContainer}><div style={styles.spinner}></div><h3>Loading...</h3></div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.mainLayout}>
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarHeader}>Conversations</h2>
          <div style={styles.conversationList}>
            {conversations.length === 0 ? (
              <div style={styles.noConversations}><p>No conversations yet</p></div>
            ) : (
              conversations.map((conv) => (
                <div key={conv.seller.id} onClick={() => handleConversationClick(conv)}
                  style={{ ...styles.conversationItem, backgroundColor: selectedConversation?.id === conv.seller.id ? "#e0f2fe" : "#ffffff", borderLeft: selectedConversation?.id === conv.seller.id ? "4px solid #033c8c" : "4px solid transparent" }}>
                  <div style={styles.conversationHeader}>
                    <div style={styles.conversationName}>{conv.seller.name || conv.seller.username} {onlineUsers.has(conv.seller.id) && <span style={styles.onlineIndicator}>●</span>}</div>
                    {conv.unreadCount > 0 && <div style={styles.unreadBadge}>{conv.unreadCount}</div>}
                  </div>
                  {conv.product && <div style={styles.conversationProduct}>📦 {conv.product.productName}</div>}
                  <div style={styles.conversationPreview}>{conv.lastMessage?.content?.substring(0, 50)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.chatArea}>
          {selectedConversation ? (
            <>
              <div style={styles.chatHeader}>
                <h2 style={styles.chatHeaderTitle}>{selectedConversation.name || selectedConversation.username} {onlineUsers.has(selectedConversation.id) && <span style={styles.onlineStatus}> • Online</span>}</h2>
                {selectedProduct && <div style={styles.productContext}>📦 About: <strong>{selectedProduct.productName}</strong></div>}
              </div>
              <div style={styles.messageList}>
                {messages.length === 0 ? (
                  <div style={styles.emptyState}><p>No messages yet. Start the conversation!</p></div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.senderId !== selectedConversation.id;
                    return (
                      <div key={i} style={{ ...styles.messageWrapper, justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        <div style={{ ...styles.message, backgroundColor: isMe ? "#033c8c" : "#e5e7eb", color: isMe ? "white" : "#1f2937" }}>
                          <div style={styles.messageContent}>{msg.content}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                {isTyping && <div style={styles.typingIndicator}><span>●</span><span>●</span><span>●</span></div>}
                <div ref={messagesEndRef} />
              </div>
              <div style={styles.inputContainer}>
                <textarea value={newMessage} onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }} onKeyPress={handleKeyPress} placeholder="Type a message..." style={styles.input} rows={2} />
                <button onClick={handleSend} disabled={!newMessage.trim() || sending} style={styles.sendButton}>{sending ? "..." : "Send"}</button>
              </div>
            </>
          ) : <div style={styles.noSelection}><p>Select a conversation</p></div>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", minHeight: "100vh", backgroundColor: "#f8fafc" },
  mainLayout: { display: "flex", gap: "24px", maxWidth: "1400px", margin: "0 auto", height: "calc(100vh - 48px)" },
  sidebar: { width: "350px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" },
  sidebarHeader: { fontSize: "20px", fontWeight: "600", color: "#033c8c", padding: "20px", borderBottom: "1px solid #e2e8f0" },
  conversationList: { flex: 1, overflowY: "auto" },
  conversationItem: { padding: "16px 20px", cursor: "pointer", borderBottom: "1px solid #f1f5f9" },
  conversationHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  conversationName: { fontWeight: "600", fontSize: "15px" },
  onlineIndicator: { color: "#10b981", fontSize: "12px" },
  unreadBadge: { backgroundColor: "#dc2626", color: "white", borderRadius: "10px", padding: "2px 8px", fontSize: "11px" },
  conversationProduct: { fontSize: "12px", color: "#64748b" },
  conversationPreview: { fontSize: "13px", color: "#64748b" },
  noConversations: { padding: "40px", textAlign: "center" },
  chatArea: { flex: 1, backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" },
  chatHeader: { padding: "20px", borderBottom: "1px solid #e2e8f0" },
  chatHeaderTitle: { fontSize: "20px", color: "#033c8c", margin: 0 },
  onlineStatus: { fontSize: "14px", color: "#10b981" },
  productContext: { fontSize: "14px", color: "#64748b", background: "#f1f5f9", padding: "8px", borderRadius: "8px", marginTop: "8px" },
  messageList: { flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  messageWrapper: { display: "flex" },
  message: { padding: "12px", borderRadius: "16px", maxWidth: "70%" },
  messageContent: { fontSize: "14px" },
  typingIndicator: { display: "flex", gap: "4px", padding: "10px" },
  inputContainer: { padding: "20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px" },
  input: { flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", resize: "none" },
  sendButton: { padding: "12px 24px", backgroundColor: "#033c8c", color: "white", borderRadius: "12px", border: "none" },
  noSelection: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1 },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" },
  spinner: { width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #033c8c", borderRadius: "50%", animation: "spin 1s linear infinite" }
};