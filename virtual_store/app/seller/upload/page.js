"use client";
import React, { useState } from "react";

export default function UploadProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      productName,
      category,
      price,
      description,
      image,
    };
    console.log("Product Data:", formData);

    alert("Product submitted! (check console for details)");

    setProductName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded shadow-md mt-10 bg-purple-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Upload Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Price (BDT)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-48 h-48 object-cover rounded border" />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
}
