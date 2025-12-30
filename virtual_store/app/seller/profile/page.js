"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaCamera, FaCalendarAlt, FaStore 
} from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Unified Backend URL based on your logs
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetching via authController: GET /api/auth/me
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Accessing user property from { user: { ... } }
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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* breadcrumbs style heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Account Profile</h1>
        <p className="text-slate-500 text-sm">Manage your personal information and business details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.profileImage ? `${BACKEND_URL}/uploads/${user.profileImage}` : "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 shadow-md"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user?.name; }}
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                <FaCamera size={14} />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-blue-600 font-medium text-sm mb-4">@{user?.username}</p>
            
            <div className="flex items-center justify-center gap-2 py-1 px-3 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider w-fit mx-auto">
              <FaStore size={10} /> {user?.role} Account
            </div>

            <hr className="my-6 border-slate-100" />

            <button 
              onClick={() => router.push("/seller/profile/edit")}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={<FaEnvelope />} label="Email Address" value={user?.email} />
              <InfoItem icon={<FaPhone />} label="Phone Number" value={user?.phone || "Not Provided"} />
              <div className="md:col-span-2">
                <InfoItem icon={<FaMapMarkerAlt />} label="Business Address" value={user?.address || "Not Provided"} />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              Business Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Preferred Category</p>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-black rounded-lg uppercase">
                  {user?.preferredCategory || "General"}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-slate-700 font-bold flex items-center gap-2">
                  <FaCalendarAlt className="text-slate-400" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Info Component
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-slate-700 font-bold break-all">{value}</p>
      </div>
    </div>
  );
}