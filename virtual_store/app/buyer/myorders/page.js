"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      const response = await fetch("http://localhost:5001/api/orders", {
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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center mt-10">
          <span className="text-4xl">⏳</span>
          <h3 className="text-xl font-semibold mt-4">Loading orders...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Price (BDT)</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Order Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                order.items.map((item, index) => (
                  <tr key={`${order.id}-${item.productId}`} className="hover:bg-gray-50 transition">
                    {index === 0 && (
                      <>
                        <td className="px-4 py-3" rowSpan={order.items.length}>#{order.id}</td>
                      </>
                    )}
                    <td className="px-4 py-3 font-medium text-gray-800">{item.product.productName}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">${item.price}</td>
                    {index === 0 && (
                      <>
                        <td className={`px-4 py-3 font-semibold ${
                          order.status === 'pending' ? 'text-yellow-600' :
                          order.status === 'confirmed' ? 'text-blue-600' :
                          order.status === 'shipped' ? 'text-purple-600' :
                          order.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                        }`} rowSpan={order.items.length}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </td>
                        <td className="px-4 py-3" rowSpan={order.items.length}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
