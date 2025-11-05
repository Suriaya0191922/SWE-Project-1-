'use client';

import { useState } from 'react';
import Link from "next/link";


export default function WelcomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Header */}
      <header className="bg-blue-950/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-400 to-green-400 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-green-300 bg-clip-text text-transparent whitespace-nowrap">
                ThriftStore
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-grow max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for treasures..."
                  className="w-full px-4 py-2 pl-10 rounded-full bg-blue-900/50 border border-purple-400/30 text-purple-100 placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-4 flex-shrink-0">
  <Link href="/admin" className="text-purple-200 hover:text-green-300 transition-colors text-sm">
  Admin
</Link>
  <a href="#" className="text-purple-200 hover:text-green-300 transition-colors text-sm">About Us</a>
  <a href="#" className="text-purple-200 hover:text-green-300 transition-colors text-sm">Contact Us</a>

  <Link href="/signup">
    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
      Login
    </button>
  </Link>

  <Link href="/signup">
    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
      Sign Up
    </button>
  </Link>
</nav>


            {/* Mobile Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-purple-200 hover:text-green-300">
              {isMenuOpen ? (
                <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-950/95 backdrop-blur-lg border-t border-purple-500/30">
            <div className="px-4 py-4 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for treasures..."
                  className="w-full px-6 py-3 pl-12 rounded-full bg-blue-900/50 border border-purple-400/30 text-purple-100 placeholder-purple-300/60 focus:ring-2 focus:ring-green-400"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <a href="#" className="block text-purple-200 hover:text-green-300 py-2">Products</a>
              <a href="#" className="block text-purple-200 hover:text-green-300 py-2">About Us</a>
              <a href="#" className="block text-purple-200 hover:text-green-300 py-2">Contact Us</a>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg">Login</button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">Sign Up</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO CONTENT */}
      <main className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="space-y-6 animate-fade-in">
          <h2 className="font-bold whitespace-nowrap text-[8vw] sm:text-6xl md:text-8xl">
  <span className="bg-gradient-to-r from-purple-300 via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]">
    Welcome to Thriftstore
  </span>
</h2>






    

            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              Discover pre-loved treasures and give them a new home.
              <span className="block mt-2 text-green-300 font-semibold">
                Sustainable shopping made beautiful.
              </span>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-bold text-lg transition-all">
                Start Shopping
              </button>
              <button className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-lg transition-all">
                Explore Collection
              </button>
            </div>

            {/* Feature Pills */}
            
          </div>
        </div>
      </main>
    </>
  );
}
