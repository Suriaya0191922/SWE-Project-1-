'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('search') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Specific Color Palette using the Navy Blue from your image
  const styles = {
    exactNavy: "bg-[#23355b]",    // The exact navy blue color from image_877bc7.png
    navyText: "text-[#23355b]",
    brandPurple: "text-[#a855f7]", // Purple from your Home Page
    brandGreen: "bg-[#22c55e]",   // Green from your Home Page buttons
    bgLight: "bg-white",          // Clean white background for content
    cardBorder: "border-slate-100"
  };

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products?search=${initialQuery}`);
        const data = await response.json();
        
        if (initialQuery.trim()) {
          const filteredResults = data.filter(product => 
            product.productName.toLowerCase().includes(initialQuery.toLowerCase())
          );
          setProducts(filteredResults);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialQuery]);

  return (
    <div className={`min-h-screen ${styles.bgLight} font-sans`}>
      {/* Header with Exact Navy Blue */}
      <header className={`${styles.exactNavy} text-white py-20 px-6 shadow-xl relative`}>
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white transition-all text-sm font-bold mb-8 group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            {initialQuery ? (
              <>Results for <span className="text-[#a855f7]">"{initialQuery}"</span></>
            ) : (
              "The Collection"
            )}
          </h1>
          <p className="mt-4 text-blue-100/70 text-xl font-medium max-w-xl">
            Sourced specifically for your search. {products.length} items found.
          </p>
        </div>
      </header>

      {/* Product Display Area */}
      <main className="max-w-7xl mx-auto px-6 -mt-12 pb-24 relative z-10">
        {loading ? (
          <div className="bg-white rounded-3xl p-24 shadow-2xl flex flex-col items-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#23355b]`}></div>
            <p className="mt-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Cataloging...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => router.push(`/product/${product.id}`)}
                className="group cursor-pointer bg-white border border-slate-100 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(35,53,91,0.2)] hover:-translate-y-3"
              >
                {/* Image Section */}
                <div className="h-72 bg-slate-50 relative overflow-hidden">
                  {product.images?.[0] ? (
                    <div className="h-full w-full">
                      {/* Subtle Navy Tint Overlay */}
                      <div className="absolute inset-0 bg-[#23355b]/5 group-hover:bg-transparent transition-all duration-500 z-10"></div>
                      <img 
                        src={`${API_BASE_URL}/uploads/${product.images[0].imageUrl}`} 
                        alt={product.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 italic">No visuals available</div>
                  )}
                  
                  {/* Green Badge from Home Page UI */}
                  <div className={`absolute top-6 left-6 z-20 ${styles.brandGreen} text-white text-[10px] font-black tracking-tighter px-4 py-2 rounded-xl shadow-lg shadow-green-500/30`}>
                    {product.condition}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-black uppercase tracking-[0.2em] ${styles.brandPurple}`}>
                      {product.category}
                    </span>
                    <span className={`text-2xl font-black ${styles.navyText}`}>৳{product.price}</span>
                  </div>
                  
                  <h3 className={`text-xl font-bold ${styles.navyText} group-hover:text-[#a855f7] transition-colors duration-300`}>
                    {product.productName}
                  </h3>
                  
                  <p className="text-slate-400 mt-3 text-sm font-medium line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Decorative underline */}
                  <div className="mt-6 h-1 w-8 bg-[#23355b] group-hover:w-full group-hover:bg-[#a855f7] transition-all duration-500 rounded-full opacity-30"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] shadow-xl border-2 border-dashed border-slate-100">
            <h2 className="text-3xl font-black text-slate-300 mb-8 tracking-tighter">No specific items found.</h2>
            <Link 
              href="/searchProduct" 
              className={`${styles.exactNavy} text-white px-12 py-5 rounded-2xl font-black hover:bg-[#a855f7] transition-all shadow-xl shadow-blue-900/20 active:scale-95 inline-block`}
            >
              Reset Search
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-[#23355b] font-black">LOADING CATALOG...</div>}>
      <ProductsContent />
    </Suspense>
  );
}