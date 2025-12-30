"use client";
import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaHourglassHalf, FaCalendarAlt, FaTag } from "react-icons/fa";

export default function MyInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/products/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInventory();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <FaHourglassHalf className="animate-spin text-blue-600 text-3xl mb-4" />
      <p className="text-slate-500 font-medium">Loading inventory...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Area */}
      <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Uploads</h1>
          <p className="text-slate-500 text-sm">Review your listed products</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Items</span>
          <p className="text-2xl font-black text-blue-600 leading-none">{products.length}</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <FaBoxOpen className="mx-auto text-slate-300 text-5xl mb-3" />
          <p className="text-slate-500 italic">No products uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:border-blue-300 transition-all group"
            >
              {/* Scaled Down Image Container */}
              <div className="relative h-[250px] bg-slate-100">
                <img 
                  src={`http://localhost:5000/uploads/${product.images?.[0]?.imageUrl}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={product.productName}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                    product.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {product.status || 'Live'}
                  </span>
                </div>
              </div>

              {/* Information Section */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800 truncate flex-1">{product.productName}</h3>
                  <span className="text-blue-600 font-bold ml-2">৳{Number(product.price).toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <FaTag className="text-slate-300" size={12} />
                  <span className="text-xs text-slate-500 font-medium">{product.category}</span>
                </div>

                <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10 leading-snug">
                  {product.description || "No description provided."}
                </p>

                {/* Footer details */}
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                  </div>
                  <span>REF: #{product.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}