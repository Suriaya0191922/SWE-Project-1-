"use client";

import { useState, useEffect, useRef } from "react";

export default function SellerMessages() {
  // Sample buyers list
  const [buyers, setBuyers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Alice Brown", email: "alice@example.com" },
  ]);

  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Simulate loading messages
  useEffect(() => {
    // Example: messages per buyer
    setMessages({
      1: [
        { sender: "buyer", text: "Hi, is the physics book available?", time: "10:05 AM" },
        { sender: "seller", text: "Yes, it is!", time: "10:07 AM" },
      ],
      2: [
        { sender: "buyer", text: "Can you deliver the laptop bag?", time: "11:15 AM" },
        { sender: "seller", text: "Sure, we can arrange delivery.", time: "11:20 AM" },
      ],
      3: [
        { sender: "buyer", text: "Is the calculator still in stock?", time: "09:30 AM" },
        { sender: "seller", text: "Yes, just one left.", time: "09:35 AM" },
      ],
    });
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedBuyer, messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedBuyer) return;

    const msg = {
      sender: "seller",
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedBuyer.id]: [...(prev[selectedBuyer.id] || []), msg],
    }));

    setNewMessage("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Seller Messages</h1>

      <div style={styles.chatContainer}>
        {/* Buyers List */}
        <div style={styles.buyerList}>
          <h3 style={styles.subHeader}>Buyers</h3>
          {buyers.map((buyer) => (
            <div
              key={buyer.id}
              onClick={() => setSelectedBuyer(buyer)}
              style={{
                ...styles.buyerItem,
                backgroundColor: selectedBuyer?.id === buyer.id ? "#033c8c" : "#f8fafc",
                color: selectedBuyer?.id === buyer.id ? "#aaff71" : "#1f2937",
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>{buyer.name}</p>
              <p style={{ margin: 0, fontSize: "12px" }}>{buyer.email}</p>
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div style={styles.messagesArea}>
          {selectedBuyer ? (
            <>
              <div style={styles.messagesHeader}>
                <h3 style={{ margin: 0 }}>{selectedBuyer.name}</h3>
              </div>

              <div style={styles.chatBox}>
                {(messages[selectedBuyer.id] || []).map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.message,
                      alignSelf: msg.sender === "seller" ? "flex-end" : "flex-start",
                      backgroundColor: msg.sender === "seller" ? "#033c8c" : "#e5e7eb",
                      color: msg.sender === "seller" ? "#aaff71" : "#1f2937",
                    }}
                  >
                    <p style={styles.messageText}>{msg.text}</p>
                    <span style={styles.time}>{msg.time}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={styles.input}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend} style={styles.sendBtn}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", marginTop: "50px", color: "#64748b" }}>
              Select a buyer to start messaging
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#033c8c",
  },
  chatContainer: {
    display: "flex",
    gap: "20px",
    minHeight: "500px",
  },
  buyerList: {
    width: "250px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflowY: "auto",
    padding: "10px",
  },
  subHeader: {
    margin: "0 0 10px 0",
    fontWeight: 700,
    color: "#033c8c",
  },
  buyerItem: {
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  messagesArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "15px",
  },
  messagesHeader: {
    paddingBottom: "10px",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "10px",
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    padding: "10px 0",
  },
  message: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  messageText: {
    margin: 0,
    fontSize: "16px",
  },
  time: {
    fontSize: "12px",
    opacity: 0.7,
    alignSelf: "flex-end",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
  },
  sendBtn: {
    padding: "12px 20px",
    borderRadius: "10px",
    backgroundColor: "#033c8c",
    color: "#aaff71",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
