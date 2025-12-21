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
          "http://localhost:5000/api/products/my-products",
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
        `http://localhost:5000/api/products/${productId}`,
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
      <p className="text-center mt-10 text-gray-500">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-purple-100 mt-10 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        My Uploaded Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No products uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl =
              product.images?.length > 0
                ? `http://localhost:5000/uploads/${product.images[0].imageUrl}`
                : "/placeholder.png";

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <img
                  src={imageUrl}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded-md mb-3 border"
                />

                <h2 className="text-xl font-semibold text-blue-900">
                  {product.productName}
                </h2>

                <p className="text-gray-600 text-sm mb-1">
                  Category:{" "}
                  <span className="font-medium">{product.category}</span>
                </p>

                <p className="text-gray-700 font-semibold">
                  BDT {product.price}
                </p>

                <p className="text-gray-600 text-sm mt-2">
                  {product.description}
                </p>

                <p className="mt-3 font-semibold text-green-600">
                  Active
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  Uploaded:{" "}
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>

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
            );
          })}
        </div>
      )}
    </div>
  );
}
