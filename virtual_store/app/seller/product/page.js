"use client";
import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function SellerProducts() {
  // Sample product data (replace with API later)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Physics Textbook",
      category: "Books",
      price: 350,
      description: "Classical mechanics textbook in good condition.",
      image: "https://via.placeholder.com/150",
      status: "Active",
      date: "2025-12-01",
    },
    {
      id: 2,
      name: "Laptop Bag",
      category: "Accessories",
      price: 800,
      description: "Strong laptop bag suitable for 14–15 inch laptops.",
      image: "https://via.placeholder.com/150",
      status: "Active",
      date: "2025-12-03",
    },
    {
      id: 3,
      name: "Calculator",
      category: "Electronics",
      price: 450,
      description: "CASIO scientific calculator, slightly used.",
      image: "https://via.placeholder.com/150",
      status: "Sold",
      date: "2025-12-05",
    },
  ]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-purple-100 mt-10 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        My Uploaded Products
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
          >
            {/* Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-3 border"
            />

            {/* Product Info */}
            <h2 className="text-xl font-semibold text-blue-900">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              Category: <span className="font-medium">{product.category}</span>
            </p>
            <p className="text-gray-700 font-semibold">BDT {product.price}</p>

            <p className="text-gray-600 text-sm mt-2">{product.description}</p>

            <p
              className={`mt-3 font-semibold ${
                product.status === "Sold" ? "text-red-600" : "text-green-600"
              }`}
            >
              {product.status}
            </p>

            <p className="text-gray-500 text-xs mt-1">
              Uploaded: {product.date}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                <FaEdit /> Edit
              </button>

              <button
                onClick={() => handleDelete(product.id)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Products Message */}
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products uploaded yet.
        </p>
      )}
    </div>
  );
}
