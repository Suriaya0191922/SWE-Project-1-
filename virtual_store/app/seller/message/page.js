"use client";
import { useState, useEffect, useRef } from "react";

const API_BASE_URL = "http://localhost:5000/api";

const fetchConversation = async (buyerId, setMessages) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE_URL}/messages/conversation/${buyerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setMessages(data);
    }
  } catch (error) {
    console.error("Error fetching conversation:", error);
  }
};

const fetchConversations = async (setConversations, setSelectedBuyer, setLoading) => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      
      // Get current user ID from the first message
      const currentUserId = data.length > 0 ? 
        (data[0].senderId === data[0].sender.id ? data[0].senderId : data[0].receiverId) : null;

      const conversationMap = new Map();

      data.forEach((message) => {
        const otherUser = message.senderId === currentUserId ? message.receiver : message.sender;

        if (!conversationMap.has(otherUser.id)) {
          conversationMap.set(otherUser.id, {
            buyer: otherUser,
            product: message.product,
            lastMessage: message,
            unreadCount: (message.receiverId === currentUserId && !message.isRead) ? 1 : 0,
            currentUserId: currentUserId,
          });
        } else {
          const conv = conversationMap.get(otherUser.id);
          if (new Date(message.createdAt) > new Date(conv.lastMessage.createdAt)) {
            conv.lastMessage = message;
            conv.product = message.product;
          }
          if (message.receiverId === currentUserId && !message.isRead) {
            conv.unreadCount += 1;
          }
        }
      });

      const conversationsArray = Array.from(conversationMap.values());
      setConversations(conversationsArray);

      if (conversationsArray.length > 0 && !setSelectedBuyer) {
        setSelectedBuyer(conversationsArray[0].buyer);
      }
    } else {
      console.error("Failed to fetch conversations");
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  } finally {
    setLoading(false);
  }
};

export default function SellerMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Load and Sidebar Polling
  useEffect(() => {
    fetchConversations(setConversations, setSelectedBuyer, setLoading);

    const sidebarInterval = setInterval(() => {
      fetchConversations(setConversations, setSelectedBuyer, setLoading);
    }, 5000);

    return () => clearInterval(sidebarInterval);
  }, []);

  // Active Chat Polling
  useEffect(() => {
    let chatInterval;

    if (selectedBuyer) {
      fetchConversation(selectedBuyer.id, setMessages);

      chatInterval = setInterval(() => {
        fetchConversation(selectedBuyer.id, setMessages);
      }, 3000);
    }

    return () => {
      if (chatInterval) clearInterval(chatInterval);
    };
  }, [selectedBuyer]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedBuyer) return;

    setSending(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: selectedBuyer.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.data]);
        setNewMessage("");
        fetchConversations(setConversations, setSelectedBuyer, setLoading);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <h3 style={styles.loadingText}>Loading messages...</h3>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainLayout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarHeader}>Buyer Messages</h2>
          <div style={styles.conversationList}>
            {conversations.length === 0 ? (
              <div style={styles.noConversations}>
                <p>No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.buyer.id}
                  style={{
                    ...styles.conversationItem,
                    backgroundColor: selectedBuyer?.id === conv.buyer.id ? "#e0f2fe" : "#ffffff",
                    borderLeft: selectedBuyer?.id === conv.buyer.id ? "4px solid #033c8c" : "4px solid transparent",
                  }}
                  onClick={() => setSelectedBuyer(conv.buyer)}
                >
                  <div style={styles.conversationHeader}>
                    <div style={styles.conversationName}>
                      {conv.buyer.name || conv.buyer.username}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div style={styles.unreadBadge}>{conv.unreadCount}</div>
                    )}
                  </div>
                  {conv.product && (
                    <div style={styles.conversationProduct}>
                      📦 {conv.product.productName}
                    </div>
                  )}
                  <div style={styles.conversationPreview}>
                    {conv.lastMessage.content.substring(0, 50)}
                    {conv.lastMessage.content.length > 50 ? "..." : ""}
                  </div>
                  <div style={styles.conversationTime}>
                    {new Date(conv.lastMessage.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {selectedBuyer ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <h2 style={styles.chatHeaderTitle}>
                  {selectedBuyer.name || selectedBuyer.username}
                </h2>
              </div>

              {/* Messages */}
              <div style={styles.messageList}>
                {messages.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>💬</div>
                    <p style={styles.emptyText}>No messages yet</p>
                    <p style={styles.emptySubtext}>Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    // Determine if this message is from the current user (seller)
                    const isMe = msg.sender.id !== selectedBuyer.id;
                    
                    return (
                      <div
                        key={msg.id}
                        style={{
                          ...styles.messageWrapper,
                          justifyContent: isMe ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            ...styles.message,
                            backgroundColor: isMe ? "#033c8c" : "#e5e7eb",
                            color: isMe ? "white" : "#1f2937",
                          }}
                        >
                          {msg.product && (
                            <div style={styles.productLabel}>
                              📦 {msg.product.productName}
                            </div>
                          )}
                          {!isMe && (
                            <div style={styles.senderName}>
                              {msg.sender?.name || "Buyer"}
                            </div>
                          )}
                          <div style={styles.messageContent}>{msg.content}</div>
                          <div style={styles.time}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={styles.inputContainer}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  style={styles.input}
                  rows={2}
                  disabled={sending}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  style={{
                    ...styles.sendButton,
                    opacity: !newMessage.trim() || sending ? 0.5 : 1,
                    cursor: !newMessage.trim() || sending ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          ) : (
            <div style={styles.noSelection}>
              <div style={styles.emptyIcon}>💬</div>
              <p style={styles.emptyText}>Select a conversation</p>
              <p style={styles.emptySubtext}>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f8fafc",
  },

  mainLayout: {
    display: "flex",
    gap: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    height: "calc(100vh - 48px)",
  },

  // Sidebar Styles
  sidebar: {
    width: "350px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  sidebarHeader: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#033c8c",
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
    margin: 0,
  },

  conversationList: {
    flex: 1,
    overflowY: "auto",
  },

  conversationItem: {
    padding: "16px 20px",
    cursor: "pointer",
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s",
  },

  conversationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },

  conversationName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#1f2937",
  },

  unreadBadge: {
    backgroundColor: "#dc2626",
    color: "white",
    borderRadius: "10px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: "600",
  },

  conversationProduct: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
  },

  conversationPreview: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "4px",
  },

  conversationTime: {
    fontSize: "11px",
    color: "#94a3b8",
  },

  noConversations: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  // Chat Area Styles
  chatArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  chatHeader: {
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
  },

  chatHeaderTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#033c8c",
    margin: 0,
  },

  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  messageWrapper: {
    display: "flex",
    width: "100%",
  },

  message: {
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "70%",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },

  productLabel: {
    fontSize: "12px",
    fontWeight: "600",
    opacity: 0.8,
    marginBottom: "2px",
  },

  senderName: {
    fontSize: "11px",
    fontWeight: "bold",
    opacity: 0.9,
  },

  messageContent: {
    fontSize: "14px",
    lineHeight: "1.5",
    wordWrap: "break-word",
  },

  time: {
    fontSize: "10px",
    opacity: 0.6,
    alignSelf: "flex-end",
    marginTop: "4px",
  },

  // Input Styles
  inputContainer: {
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "none",
    outline: "none",
  },

  sendButton: {
    padding: "12px 24px",
    backgroundColor: "#033c8c",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  // Empty States
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "40px",
  },

  noSelection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "40px",
  },

  emptyIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },

  emptyText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 8px 0",
  },

  emptySubtext: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
    textAlign: "center",
  },

  // Loading Styles
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    color: "#64748b",
  },

  loadingText: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "500",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #033c8c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
};