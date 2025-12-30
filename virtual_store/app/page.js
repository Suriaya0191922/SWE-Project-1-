'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]); 
  const router = useRouter();

  // Fetch live suggestions as the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await fetch(`http://localhost:5000/api/products?search=${searchQuery}`);
          const data = await res.json();
          setSuggestions(data.slice(0, 5)); 
        } catch (err) {
          console.error("Suggestion fetch error:", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); 
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // Changed from /products to /searchProduct
      router.push(`/searchProduct?search=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]);
    } else {
      router.push('/searchProduct');
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-blue-950/80 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 cursor-pointer group flex-shrink-0">
              <div className="bg-gradient-to-br from-purple-400 to-green-400 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-300 to-green-300 bg-clip-text text-transparent whitespace-nowrap">
                ThriftStore
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:block flex-grow max-w-md relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 rounded-full bg-blue-900/50 border border-purple-400/30 text-purple-100 placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-green-300 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute w-full mt-2 bg-blue-950 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden z-[60]">
                  {suggestions.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setSearchQuery(item.productName);
                        // Changed from /products to /searchProduct
                        router.push(`/searchProduct?search=${encodeURIComponent(item.productName)}`);
                        setSuggestions([]);
                      }}
                      className="px-4 py-3 hover:bg-purple-500/20 cursor-pointer flex items-center justify-between border-b border-purple-500/10 last:border-0"
                    >
                      <span className="text-purple-100 text-sm">{item.productName}</span>
                      <span className="text-xs text-green-400 font-bold">৳{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              <Link href="/admin" className="text-purple-200 hover:text-green-300 transition-colors text-sm">
                Admin
              </Link>
              <Link href="/guidelines" className="text-purple-200 hover:text-green-300 transition-colors text-sm">
                Guidelines
              </Link>
              <a href="/aboutus" className="text-purple-200 hover:text-green-300 transition-colors text-sm">About Us</a>

              <Link
                href="/signup"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm inline-block transition-all"
              >
                Login
              </Link>

              <Link href="/signup">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-all">
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
          <div className="lg:hidden bg-blue-950/95 backdrop-blur-lg border-t border-purple-500/30">
            <div className="px-4 py-4 space-y-3">
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for treasures..."
                    className="w-full px-6 py-3 pl-12 rounded-full bg-blue-900/50 border border-purple-400/30 text-purple-100 placeholder-purple-300/60 focus:ring-2 focus:ring-green-400"
                  />
                  <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
                {suggestions.length > 0 && (
                  <div className="mt-2 bg-blue-900 border border-purple-500/30 rounded-lg overflow-hidden">
                    {suggestions.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.productName);
                          // Changed from /products to /searchProduct
                          router.push(`/searchProduct?search=${encodeURIComponent(item.productName)}`);
                          setSuggestions([]);
                        }}
                        className="px-4 py-2 hover:bg-purple-500/20 text-sm text-purple-100 flex justify-between"
                      >
                        {item.productName} <span>৳{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/searchProduct" className="block text-purple-200 hover:text-green-300 py-2">Products</Link>
              <a href="#" className="block text-purple-200 hover:text-green-300 py-2">About Us</a>
              <Link href="/signup" className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-all">Login</Link>
              <Link href="/signup" className="block w-full text-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all">Sign Up</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO CONTENT */}
      <main className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <h2 className="font-bold text-[8vw] sm:text-6xl md:text-8xl">
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

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/searchProduct')}
                className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                Start Shopping
              </button>
              <button 
                onClick={() => router.push('/signup')}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}