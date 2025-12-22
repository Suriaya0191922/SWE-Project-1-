"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function MessagePage() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("sellerId");
  const productId = searchParams.get("productId");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load previous messages (dummy for now)
  useEffect(() => {
    // Fetch messages from API based on sellerId & productId
    const dummyMessages = [
      { id: 1, sender: "buyer", text: "Hi, is this product available?" },
      { id: 2, sender: "seller", text: "Yes, it is still available." },
      { id: 3, sender: "buyer", text: "Great! Can you reserve it for me?" },
    ];
    setMessages(dummyMessages);
  }, [sellerId, productId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "buyer", text: newMessage }]);
    setNewMessage("");
    // Optionally: Send message to server/API here
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chat with Seller {sellerId}</h2>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "buyer" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "buyer" ? "#033c8c" : "#e5e7eb",
              color: msg.sender === "buyer" ? "white" : "#1f2937",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "24px", maxWidth: "600px", margin: "0 auto", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  header: { fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#033c8c" },
  chatBox: { display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "12px", minHeight: "400px", overflowY: "auto", border: "1px solid #e2e8f0" },
  message: { padding: "10px 16px", borderRadius: "20px", maxWidth: "70%", wordBreak: "break-word" },
  inputWrapper: { display: "flex", marginTop: "16px", gap: "8px" },
  input: { flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  sendBtn: { padding: "12px 20px", backgroundColor: "#033c8c", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600" },
};

