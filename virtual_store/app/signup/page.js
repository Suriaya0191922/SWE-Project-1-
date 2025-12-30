'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaShoppingCart,
  FaStore,
  FaMapMarkerAlt,
  FaImage,
} from "react-icons/fa";

export default function Page() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(true);
  const [isBuyer, setIsBuyer] = useState(true);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    preferredCategory: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // SIGNUP HANDLER
  const handleSignup = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("username", formData.username);
    fd.append("email", formData.email);
    fd.append("password", formData.password);
    fd.append("phone", formData.phone);
    fd.append("address", formData.address);
    fd.append("role", isBuyer ? "buyer" : "seller");
    fd.append("preferredCategory", isBuyer ? formData.preferredCategory : "");

    if (profileImage) {
      fd.append("profileImage", profileImage);
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful: " + data.message);
        // Redirect or something
      } else {
        alert("Signup failed: " + data.message);
      }
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error: Unable to connect to server. Please try again.");
    }
  };

  // LOGIN HANDLER
  const handleLogin = async (e) => {
  e.preventDefault();

  const payload = {
    email: formData.email,
    password: formData.password,
    role: isBuyer ? "buyer" : "seller",
  };

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);

    if (payload.role === "seller") {
      router.push("/seller");
    } else {
      router.push("/buyer"); 
    }

  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};


  return (
    <div className="relative w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center overflow-hidden border border-white/20 mx-auto mt-16">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 to-green-400"></div>

      <div className="text-2xl font-bold text-blue-100 mb-6 flex items-center justify-center gap-2">
        <FaStore /> Campus Thrift
      </div>

      {/* Login / Signup Toggle */}
      <div className="flex justify-center mb-4 gap-2">
        <button
          className={`px-4 py-1 rounded-full font-semibold transition-colors ${
            !isSignup ? "bg-blue-800/80 text-white shadow-md" : "text-white/80 hover:bg-white/20"
          }`}
          onClick={() => setIsSignup(false)}
        >
          Login
        </button>
        <button
          className={`px-4 py-1 rounded-full font-semibold transition-colors ${
            isSignup ? "bg-blue-800/80 text-white shadow-md" : "text-white/80 hover:bg-white/20"
          }`}
          onClick={() => setIsSignup(true)}
        >
          Signup
        </button>
      </div>

      {/* Buyer / Seller Toggle */}
      {isSignup && (
        <div className="flex justify-center mb-6 gap-2 bg-white/10 rounded-full p-1">
          <button
            className={`px-4 py-1 rounded-full font-semibold transition-colors ${
              isBuyer ? "bg-blue-700/80 text-white shadow-md" : "text-white/70 hover:bg-white/20"
            }`}
            onClick={() => setIsBuyer(true)}
          >
            <FaShoppingCart className="inline mr-1" /> Buyer
          </button>
          <button
            className={`px-4 py-1 rounded-full font-semibold transition-colors ${
              !isBuyer ? "bg-green-500/80 text-white shadow-md" : "text-white/70 hover:bg-white/20"
            }`}
            onClick={() => setIsBuyer(false)}
          >
            <FaStore className="inline mr-1" /> Seller
          </button>
        </div>
      )}

      <h2 className="text-blue-100 font-semibold text-xl mb-6">
        {isSignup
          ? isBuyer
            ? "Buyer Signup"
            : "Seller Signup"
          : isBuyer
          ? "Buyer Login"
          : "Seller Login"}
      </h2>

      {/* SIGNUP FORM */}
      {isSignup && (
        <form className="space-y-4" onSubmit={handleSignup}>
          <InputField icon={<FaUser />} placeholder="Full Name"
            value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />

          <InputField icon={<FaUser />} placeholder="Username"
            value={formData.username} onChange={(e) => handleChange("username", e.target.value)} />

          <InputField icon={<FaEnvelope />} placeholder="Email" type="email"
            value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />

          <InputField icon={<FaLock />} placeholder="Password" type="password"
            value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />

          <InputField icon={<FaPhone />} placeholder="Phone Number"
            value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />

          <InputField icon={<FaMapMarkerAlt />} placeholder="Address"
            value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />

          {/* Image Upload */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 text-lg">
              <FaImage />
            </span>
            <input
              type="file"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full pl-10 pr-3 py-2 rounded-full border border-white/40 bg-white/20"
            />
          </div>

          {/* Buyer category */}
          {isBuyer && (
            <InputField icon={<FaUser />} placeholder="Preferred Category"
              value={formData.preferredCategory}
              onChange={(e) => handleChange("preferredCategory", e.target.value)} />
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-green-400 text-white font-semibold rounded-full shadow-md"
          >
            Sign Up
          </button>
        </form>
      )}

      {/* LOGIN FORM */}
      {!isSignup && (
        <form className="space-y-4" onSubmit={handleLogin}>
          <InputField icon={<FaEnvelope />} placeholder="Email" type="email"
            value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />

          <InputField icon={<FaLock />} placeholder="Password" type="password"
            value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-green-400 text-white font-semibold rounded-full shadow-md"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}

// InputField
function InputField({ icon, placeholder, type = "text", value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 text-lg">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2 rounded-full border border-white/40 bg-white/20 text-gray-900 focus:outline-none"
      />
    </div>
  );
}
