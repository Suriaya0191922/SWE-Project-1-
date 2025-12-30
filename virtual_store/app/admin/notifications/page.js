"use client";
import { useEffect, useState } from "react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}>Loading messages...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Seller Notifications</h1>
      <p style={styles.subtitle}>Messages sent by sellers via the Inform Admin form.</p>

      <div style={styles.list}>
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((note) => (
            <div key={note.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.senderName}>{note.user?.name}</span>
                <span style={styles.date}>
                  {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div style={styles.email}>{note.user?.email}</div>
              <div style={styles.messageBox}>
                {note.message}
              </div>
              <div style={styles.badge}>Seller Message</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "Inter, sans-serif" },
  title: { fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
  subtitle: { color: "#64748b", marginBottom: "32px" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { 
    backgroundColor: "white", 
    padding: "24px", 
    borderRadius: "12px", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    position: "relative"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "4px" },
  senderName: { fontWeight: "700", color: "#033c8c", fontSize: "18px" },
  email: { fontSize: "13px", color: "#94a3b8", marginBottom: "16px" },
  date: { fontSize: "12px", color: "#94a3b8" },
  messageBox: { 
    backgroundColor: "#f1f5f9", 
    padding: "16px", 
    borderRadius: "8px", 
    color: "#334155", 
    lineHeight: "1.6",
    fontSize: "14px",
    whiteSpace: "pre-wrap" 
  },
  badge: {
    position: "absolute",
    top: "24px",
    right: "150px", // Adjusted to not overlap date
    fontSize: "10px",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "2px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
    textTransform: "uppercase"
  }
};