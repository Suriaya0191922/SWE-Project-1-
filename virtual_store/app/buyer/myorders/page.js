"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBoxOpen } from "react-icons/fa6";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signup");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/signup");
      } else {
        alert("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <h3 className="text-xl font-semibold mt-4 text-blue-900">Loading your orders...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <FaBoxOpen className="text-3xl text-blue-900" />
        <h1 className="text-3xl font-bold text-blue-900">My Purchase History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">You have not placed any orders yet.</p>
          <button 
            onClick={() => router.push("/buyer/allproducts")}
            className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-900 text-white text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Seller Info</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  order.items.map((item, index) => (
                    <tr key={`${order.id}-${item.productId}`} className="hover:bg-blue-50/30 transition">
                      {index === 0 && (
                        <td className="px-6 py-4 font-mono text-sm text-gray-500" rowSpan={order.items.length}>
                          #{String(order.id).slice(-6).toUpperCase()}
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{item.product.productName}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">{item.product.seller?.name || "Official Seller"}</p>
                          <p className="text-xs text-blue-600 underline">{item.product.seller?.email}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        ৳{item.price.toLocaleString()}
                      </td>

                      {index === 0 && (
                        <td className="px-6 py-4 text-sm text-gray-500" rowSpan={order.items.length}>
                          {new Date(order.createdAt).toLocaleDateString('en-GB')}
                        </td>
                      )}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}