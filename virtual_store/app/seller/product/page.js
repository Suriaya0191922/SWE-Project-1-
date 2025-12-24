"use client";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "http://localhost:5001/api/products/my-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5001/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 animate-pulse">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600 font-medium">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-purple-50 mt-10 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">
          My Uploaded Products
        </h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {products.length} Items
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No products uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl =
              product.images?.length > 0
                ? `http://localhost:5001/uploads/${product.images[0].imageUrl}`
                : "/placeholder.png";

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <img
                  src={imageUrl}
                  alt={product.productName}
                  className="w-full h-48 object-cover border-b"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold text-blue-900 truncate">
                    {product.productName}
                  </h2>

                  <p className="text-gray-500 text-sm mb-2">
                    Category:{" "}
                    <span className="font-medium text-gray-700">{product.category}</span>
                  </p>

                  {/* PRICE FORMATTED IN TAKA */}
                  <p className="text-green-700 font-extrabold text-xl">
                    ৳ {Number(product.price).toLocaleString('en-BD')}
                  </p>

                  {/* Description with line-clamp to keep card height consistent */}
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2 h-10">
                    {product.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-medium text-gray-400">
                      Added: {new Date(product.createdAt).toLocaleDateString('en-GB')}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                      Active
                    </span>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors font-medium">
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-2 rounded-lg transition-all duration-200 font-medium border border-red-100"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}