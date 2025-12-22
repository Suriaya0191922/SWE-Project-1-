"use client";
import React, { useState, useEffect } from "react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Sample data; replace with API call later
    setOrders([
      {
        id: 1,
        productName: "Physics Textbook",
        quantity: 1,
        price: 350,
        status: "Shipped",
        date: "2025-12-01",
      },
      {
        id: 2,
        productName: "Laptop Bag",
        quantity: 2,
        price: 1600,
        status: "Delivered",
        date: "2025-12-05",
      },
      {
        id: 3,
        productName: "Calculator",
        quantity: 1,
        price: 450,
        status: "Pending",
        date: "2025-12-08",
      },
    ]);
  }, []);

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
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{order.productName}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">{order.price}</td>
                  <td className={`px-4 py-3 font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Shipped"
                      ? "text-blue-600"
                      : "text-orange-500"
                  }`}>
                    {order.status}
                  </td>
                  <td className="px-4 py-3">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
