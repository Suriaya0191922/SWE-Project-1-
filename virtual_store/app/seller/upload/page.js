"use client";
import React, { useState } from "react";

export default function UploadProduct() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);        // ✅ multiple images
  const [previews, setPreviews] = useState([]);    // ✅ multiple previews

  // ✅ IMAGE HANDLER
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  // ✅ SUBMIT HANDLER (REAL BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // ✅ from login

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
      fd.append("images", img); // ✅ MUST match multer key
    });

    try {
      const res = await fetch("http://localhost:5000/api/products/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("✅ Product uploaded successfully");

      // ✅ reset form
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
    <div className="max-w-3xl mx-auto p-6 rounded shadow-md mt-10 bg-purple-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">
        Upload Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={e => setProductName(e.target.value)}
          className="w-full border px-3 py-2"
          required
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border px-3 py-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={condition}
          onChange={e => setCondition(e.target.value)}
          className="w-full border px-3 py-2"
          required
        >
          <option value="">Select Condition</option>
          {conditions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price (BDT)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full border px-3 py-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border px-3 py-2"
        />

        {/* ✅ MULTIPLE IMAGES */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />

        <div className="flex gap-2 flex-wrap">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-900 text-white px-6 py-2 rounded"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
}
