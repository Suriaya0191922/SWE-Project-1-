"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPaperPlane, FaInfoCircle, FaEnvelopeOpenText } from "react-icons/fa";

export default function InformAdminPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); 
  const [loading, setLoading] = useState(false);

  // Updated to port 5001 to match your backend setup
  const BACKEND_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("❌ Error: You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/inform`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message }),
      });

      if (res.ok) {
        setStatus("✅ Success: Message sent to admin!");
        setSubject("");
        setMessage("");
      } else {
        const errorData = await res.json();
        setStatus(`❌ Failed: ${errorData.message || res.status}`);
      }
    } catch (err) {
      setStatus("❌ Error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Button */}
      

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 p-10 text-white text-center">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20">
            <FaInfoCircle size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Inform Admin</h1>
          <p className="opacity-80 text-sm mt-1">Submit reports, issues, or important updates directly</p>
        </div>

        <div className="p-8 md:p-12">
          {/* Status Message */}
          {status && (
            <div className={`mb-8 p-4 rounded-2xl font-bold flex items-center gap-3 animate-bounce ${
              status.startsWith("✅") 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
              : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                Subject
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors">
                  <FaEnvelopeOpenText />
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is this regarding?"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-700 outline-none transition-all font-bold text-slate-700 shadow-sm"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                Detailed Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your request or update in detail..."
                required
                rows={6}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-700 outline-none transition-all font-bold text-slate-700 shadow-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-blue-900 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                <>
                  <FaPaperPlane className="text-sm" /> 
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer Note */}
      <p className="text-center mt-8 text-slate-400 text-xs font-medium">
        Your message will be reviewed by the administration team shortly.
      </p>
    </div>
  );
}