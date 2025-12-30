import React from "react";
import Link from "next/link";
import "../globals.css";

export const metadata = {
  title: "CUET Thrift Store Admin Panel",
  description: "Admin dashboard for managing CUET Virtual Thrift Store",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 antialiased">
      {/* Navigation */}
     

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm mb-3">
              Need help?{" "}
              <Link href="/support" className="text-lime-300 hover:underline font-semibold">
                Contact Support
              </Link>
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link href="/terms" className="hover:text-lime-300">Terms of Service</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-lime-300">Privacy Policy</Link>
              <span>·</span>
              <Link href="/about" className="hover:text-lime-300">About Us</Link>
            </div>
            <p className="mt-4 text-xs text-blue-200">
              © 2025 CUET Virtual Thrift Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
