"use client"; // MUST be at the very top
import { useState } from "react";
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
  const [isSignup, setIsSignup] = useState(true);
  const [isBuyer, setIsBuyer] = useState(true);

  return (
    <div className="relative w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center overflow-hidden border border-white/20 mx-auto mt-16">
      
      {/* Top gradient strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-700 to-green-400"></div>

      {/* Logo */}
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

      {/* Title */}
      <h2 className="text-blue-100 font-semibold text-xl mb-6">
        {isSignup
          ? isBuyer
            ? "Buyer Signup"
            : "Seller Signup"
          : isBuyer
          ? "Buyer Login"
          : "Seller Login"}
      </h2>

      {/* Signup Form */}
      {isSignup && (
        <form className="space-y-4">
          <InputField icon={<FaUser />} placeholder="Full Name" />
          <InputField icon={<FaUser />} placeholder="Username" />
          <InputField icon={<FaEnvelope />} placeholder="Email" type="email" />
          <InputField icon={<FaLock />} placeholder="Password" type="password" />
          <InputField icon={<FaPhone />} placeholder="Phone Number" />
          <InputField icon={<FaMapMarkerAlt />} placeholder="Address" />
          <InputField icon={<FaImage />} type="file" placeholder="Profile Image" />

          {/* Buyer extra field: Preferred Category */}
          {isBuyer && <InputField icon={<FaUser />} placeholder="Preferred Category" />}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-green-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Sign Up
          </button>
        </form>
      )}

      {/* Login Form */}
      {!isSignup && (
        <form className="space-y-4">
          <InputField icon={<FaEnvelope />} placeholder="Email" type="email" />
          <InputField icon={<FaLock />} placeholder="Password" type="password" />

          <div className="text-right">
            <a href="#" className="text-blue-200 text-sm hover:text-green-200">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-green-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}

// Reusable InputField component
function InputField({ icon, placeholder, type = "text" }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 text-lg">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 rounded-full border border-white/40 bg-white/20 text-gray-900 focus:outline-none focus:border-blue-700 backdrop-blur-sm"
      />
    </div>
  );
}
