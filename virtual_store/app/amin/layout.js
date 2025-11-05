import React from "react";
import Link from "next/link";
import "../globals.css"; // ✅ Use relative path (important!)

export const metadata = {
  title: "CUET Thrift Store Admin Panel",
  description: "Admin dashboard for managing CUET Virtual Thrift Store",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-blue-50 antialiased">
      {/* Navigation */}
      <nav className="fixed top-6 right-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg shadow-md hover:bg-purple-600 hover:text-white transition-colors"
        >
          <span>🏠</span>
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm mb-3">
              Need help?{" "}
              <Link href="/support" className="text-yellow-300 hover:underline font-semibold">
                Contact Support
              </Link>
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/terms" className="hover:text-yellow-300">Terms of Service</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-yellow-300">Privacy Policy</Link>
              <span>·</span>
              <Link href="/about" className="hover:text-yellow-300">About Us</Link>
            </div>
            <p className="mt-4 text-xs text-purple-100">
              © 2025 CUET Virtual Thrift Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
