"use client";
import React, { useState } from "react";

export default function UploadProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as seller");
      return;
    }

    const fd = new FormData();
    fd.append("productName", productName);
    fd.append("category", category);
    fd.append("condition", condition);
    fd.append("price", price);
    fd.append("description", description);

    images.forEach(img => {
      fd.append("images", img);
    });

    try {
      const res = await fetch("http://localhost:5000/api/products/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("✅ Product uploaded successfully");

      setProductName("");
      setCategory("");
      setCondition("");
      setPrice("");
      setDescription("");
      setImages([]);
      setPreviews([]);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const categories = [
    "Books & Study Materials",
    "Electronics & Gadgets",
    "Clothing & Accessories",
    "Hostel / Dorm Essentials",
    "Stationery",
    "Sports & Fitness",
    "Musical Instruments",
    "Miscellaneous",
  ];

  const conditions = ["New", "Like New", "Good", "Fair"];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Navy Blue Header */}
          <div className="bg-blue-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Upload New Product
            </h1>
            <p className="text-blue-100 mt-2">
              Fill in the details below to list your product
            </p>
          </div>

          {/* White Form Section */}
          <div className="p-8 space-y-6">
            
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-900 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Category and Condition Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-900 focus:outline-none transition-colors bg-white"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-900 focus:outline-none transition-colors bg-white"
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (BDT) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter price in BDT"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-900 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-900 focus:outline-none transition-colors h-32 resize-none"
              />
            </div>

            {/* Purple Image Upload Section */}
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-white hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload one or more images (JPG, PNG)
                </p>
              </div>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Image Preview
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previews.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                        alt={`Preview ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Green Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Upload Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
