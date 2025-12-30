"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaCamera, FaCalendarAlt, FaShoppingBag 
} from "react-icons/fa";

export default function BuyerProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Updated to 5001 to match your backend port
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Account</h1>
          <p className="text-slate-500 text-sm">Manage your personal details and shopping preferences</p>
        </div>
        <div className="hidden md:block">
           {/* FIXED: Added .toString() to prevent slice error */}
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             Customer ID: #{user?.id ? user.id.toString().slice(-6) : "000000"}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.profileImage ? `${BACKEND_URL}/uploads/${user.profileImage}` : "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`; }}
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                <FaCamera size={12} />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-indigo-600 font-medium text-sm mb-4 italic">@{user?.username}</p>
            
            <div className="flex items-center justify-center gap-2 py-1 px-4 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider w-fit mx-auto">
              <FaShoppingBag size={10} /> Verified {user?.role}
            </div>

            <hr className="my-6 border-slate-100" />

            <button 
              onClick={() => router.push("/buyer/profile/edit")}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              <FaEdit /> Edit My Profile
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BuyerInfo icon={<FaEnvelope />} label="Email Address" value={user?.email} color="indigo" />
              <BuyerInfo icon={<FaPhone />} label="Phone Number" value={user?.phone || "Not linked"} color="indigo" />
              <div className="md:col-span-2">
                <BuyerInfo icon={<FaMapMarkerAlt />} label="Primary Shipping Address" value={user?.address || "No address saved"} color="indigo" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
              Shopping Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Favorite Category</p>
                <span className="inline-block px-3 py-1 bg-white text-purple-700 text-xs font-black rounded-lg shadow-sm border border-purple-100 uppercase">
                  {user?.preferredCategory || "Exploring Categories"}
                </span>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Since</p>
                <p className="text-slate-700 font-bold flex items-center gap-2">
                  <FaCalendarAlt className="text-slate-400" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "Recently Joined"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function BuyerInfo({ icon, label, value, color }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
      <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-slate-700 font-bold break-all">{value}</p>
      </div>
    </div>
  );
}