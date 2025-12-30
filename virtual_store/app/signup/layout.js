import React from 'react';
import Link from 'next/link';
import './globals.css'; 

export default function SignupLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Navigation - Back to Home */}
      <nav className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-purple-200 hover:text-green-300 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Content (the form from page.js) */}
      {children}

      {/* Footer Links */}
      <div className="mt-8 text-center text-purple-200 text-sm">
        <p>
          Need help? <Link href="/support" className="text-green-300 hover:underline">Contact Support</Link>
        </p>
        <p className="mt-2">
          <Link href="/terms" className="hover:text-green-300">Terms</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-green-300">Privacy</Link>
        </p>
      </div>
    </div>
  );
}
