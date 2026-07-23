"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogCategoriesAdmin() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ id: "", name: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/blog-categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("admin_token");
    const url = formData.id 
      ? `${apiBaseUrl}/blog-categories/${formData.id}`
      : `${apiBaseUrl}/blog-categories`;
      
    try {
      const res = await fetch(url, {
        method: "POST", // using POST for both create and update
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: formData.name })
      });

      if (!res.ok) throw new Error("Failed to save category");

      setSuccess(`Category ${formData.id ? "updated" : "added"} successfully`);
      setFormData({ id: "", name: "" });
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ id: cat.id, name: cat.name });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${apiBaseUrl}/blog-categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSuccess("Category deleted");
        fetchCategories();
      }
    } catch (err) {
      setError("Failed to delete");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin h-8 w-8 text-[#b8965a] rounded-full border-4 border-t-transparent"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1c1917] p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Manage Blog Categories</h1>
          <a href="/admin/dashboard" className="text-sm font-bold text-[#b8965a] hover:underline">&larr; Back to Dashboard</a>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-bold">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
            <h3 className="font-bold mb-4">{formData.id ? "Edit Category" : "Add New Category"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#b8965a]"
                />
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-[#b8965a] text-white font-bold py-2 rounded-lg text-sm"
              >
                {saving ? "Saving..." : "Save Category"}
              </button>
              {formData.id && (
                <button 
                  type="button" 
                  onClick={() => setFormData({id:"", name:""})}
                  className="w-full bg-zinc-100 text-zinc-600 font-bold py-2 rounded-lg text-sm mt-2"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
            <h3 className="font-bold mb-4">Existing Categories</h3>
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 border border-zinc-100 rounded-xl hover:border-[#b8965a]/30 transition-all">
                  <div>
                    <div className="font-bold">{cat.name}</div>
                    <div className="text-xs text-zinc-400">Slug: {cat.slug}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-sm font-bold text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg">Delete</button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <div className="text-sm text-zinc-400 text-center py-4">No categories found.</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
