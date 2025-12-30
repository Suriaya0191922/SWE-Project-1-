"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCamera, FaSave, FaUser, FaPhone, FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";

export default function EditBuyerProfile() {
  const router = useRouter();
  // Matching your backend port
  const BACKEND_URL = "http://localhost:5000"; 
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    preferredCategory: ""
  });

  useEffect(() => {
    let isMounted = true;
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

        if (res.ok && isMounted) {
          const { user } = await res.json();
          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            preferredCategory: user.preferredCategory || "Electronics"
          });
          if (user.profileImage) {
            setPreview(`${BACKEND_URL}/uploads/${user.profileImage}`);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [router]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("preferredCategory", formData.preferredCategory);
      
      if (file) data.append("profileImage", file);

      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Profile updated successfully!");
        router.push("/buyer/profile"); 
        router.refresh(); 
      } else {
        alert(`❌ Update failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Connection error. Ensure backend is running.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-700 mb-6 transition-all font-bold group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Profile
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
        {/* Navy Blue to Blue Gradient Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 p-10 text-white text-center">
          <h1 className="text-3xl font-black tracking-tight">Personal Settings</h1>
          <p className="opacity-80 text-sm mt-1">Update your personal info and shipping preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl">
                <img
                  src={preview || "/default-avatar.png"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="Profile Preview"
                  onError={(e) => e.target.src = "/default-avatar.png"}
                />
              </div>
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[2.5rem]">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-white border border-white/30">
                  <FaCamera size={24} />
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="mt-4 text-[10px] text-blue-900 font-black uppercase tracking-[0.2em]">Change Profile Photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup 
              icon={<FaUser />} label="Full Name" value={formData.name} 
              onChange={(v) => setFormData({...formData, name: v})} 
            />
            <InputGroup 
              icon={<FaPhone />} label="Phone Number" value={formData.phone} 
              onChange={(v) => setFormData({...formData, phone: v})} 
            />
            <div className="md:col-span-2">
              <InputGroup 
                icon={<FaMapMarkerAlt />} label="Primary Shipping Address" value={formData.address} 
                onChange={(v) => setFormData({...formData, address: v})} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Shopping Preference</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaShoppingBag />
                </div>
                <select 
                  value={formData.preferredCategory}
                  onChange={(e) => setFormData({...formData, preferredCategory: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-700 outline-none transition-all font-bold text-slate-700 appearance-none shadow-sm"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Living">Home & Living</option>
                  <option value="Books">Books</option>
                  <option value="Beauty">Beauty & Health</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={updating}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-blue-900 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {updating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving Profile...
              </span>
            ) : (
              <><FaSave /> Update My Account</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function InputGroup({ icon, label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors">
          {icon}
        </div>
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm"
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}