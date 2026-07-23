"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const CKEditor4 = dynamic(() => import("../../../components/CKEditor4"), { ssr: false });

export default function BlogsAdmin() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoExists, setLogoExists] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    blog_category_id: "",
    content: "",
    image: null,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [blogsRes, catsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/blogs`),
        fetch(`${apiBaseUrl}/blog-categories`)
      ]);
      
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("admin_token");
    const url = formData.id 
      ? `${apiBaseUrl}/blogs/${formData.id}`
      : `${apiBaseUrl}/blogs`;

    const data = new FormData();
    data.append("title", formData.title);
    if (formData.blog_category_id) data.append("blog_category_id", formData.blog_category_id);
    data.append("content", formData.content);
    if (formData.seo_title) data.append("seo_title", formData.seo_title);
    if (formData.seo_description) data.append("seo_description", formData.seo_description);
    if (formData.seo_keywords) data.append("seo_keywords", formData.seo_keywords);
    if (formData.image) data.append("image", formData.image);

    try {
      const res = await fetch(url, {
        method: "POST", // POST for both create and update (Laravel handles multipart forms)
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: data
      });

      if (!res.ok) throw new Error("Failed to save blog");

      setSuccess(`Blog ${formData.id ? "updated" : "added"} successfully`);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      id: blog.id,
      title: blog.title,
      blog_category_id: blog.blog_category_id || "",
      content: blog.content || "",
      image: null,
      seo_title: blog.seo_title || "",
      seo_description: blog.seo_description || "",
      seo_keywords: blog.seo_keywords || "",
    });
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${apiBaseUrl}/blogs/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccess("Blog deleted");
        fetchData();
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
    <div className="min-h-screen bg-white text-[#1c1917] flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 bg-[#1c1917] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3 text-white">
          <div className="h-9 w-9 rounded-xl border border-[#eaddc7] p-0.5 flex items-center justify-center bg-white">
            {logoExists ? (
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" onError={() => setLogoExists(false)} />
            ) : (
              <div className="h-full w-full bg-[#b8965a]/10 rounded-xl flex items-center justify-center font-black text-[10px] text-[#b8965a]">N</div>
            )}
          </div>
          <div>
            <h2 className="font-bold tracking-tight text-sm uppercase">Nagpal Natraj</h2>
            <p className="text-[9px] text-[#b8965a] font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Dashboard</a>
          <a href="/admin/home" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Home Page</a>
          <a href="/admin/about" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">About Us Page</a>
          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Categories</a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Products</a>
          <a href="/admin/blog-categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Blog Categories</a>
          <a href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all">Blogs</a>
          <a href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Site Settings</a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col bg-[#f8f9fa] overflow-auto">
        <header className="h-16 border-b border-[#eaddc7]/40 px-8 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">Manage Blogs</h1>
          {!isEditing && (
            <button onClick={() => {
              setFormData({ id: "", title: "", blog_category_id: "", content: "", image: null, seo_title: "", seo_description: "", seo_keywords: "" });
              setIsEditing(true);
            }} className="bg-[#b8965a] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">Add New Blog</button>
          )}
        </header>

        <div className="flex-1 p-8">
          {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">{error}</div>}
          {success && <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl text-sm font-bold">{success}</div>}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full border border-zinc-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Category</label>
                  <select value={formData.blog_category_id} onChange={(e) => setFormData({...formData, blog_category_id: e.target.value})} className="w-full border border-zinc-200 rounded-lg px-3 py-2">
                    <option value="">No Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Blog Content</label>
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                  <CKEditor4 value={formData.content} onChange={(val) => setFormData({...formData, content: val})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Cover Image</label>
                <input type="file" onChange={handleImageChange} accept="image/*" className="w-full text-sm" />
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <h3 className="font-bold text-sm uppercase mb-4 text-[#b8965a]">SEO Meta Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">SEO Title</label>
                    <input type="text" value={formData.seo_title} onChange={(e) => setFormData({...formData, seo_title: e.target.value})} className="w-full border border-zinc-200 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">SEO Description</label>
                    <textarea value={formData.seo_description} onChange={(e) => setFormData({...formData, seo_description: e.target.value})} className="w-full border border-zinc-200 rounded-lg px-3 py-2 h-20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">SEO Keywords</label>
                    <input type="text" value={formData.seo_keywords} onChange={(e) => setFormData({...formData, seo_keywords: e.target.value})} placeholder="keyword1, keyword2" className="w-full border border-zinc-200 rounded-lg px-3 py-2" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-100">
                <button type="submit" disabled={saving} className="bg-[#b8965a] text-white font-bold py-2 px-6 rounded-lg">
                  {saving ? "Saving..." : "Save Blog"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-zinc-100 text-zinc-600 font-bold py-2 px-6 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {blog.image && <img src={`http://localhost:8000${blog.image}`} alt={blog.title} className="w-full h-48 object-cover" />}
                  <div className="p-5">
                    <div className="text-xs font-bold text-[#b8965a] uppercase mb-1">{blog.category?.name || "Uncategorized"}</div>
                    <h3 className="font-bold text-lg leading-tight mb-4">{blog.title}</h3>
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(blog)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-1.5 rounded-lg text-sm">Edit</button>
                      <button onClick={() => handleDelete(blog.id)} className="flex-1 bg-red-50 text-red-600 font-bold py-1.5 rounded-lg text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && <div className="col-span-3 text-center py-12 text-zinc-400">No blogs found. Click "Add New Blog" to create one.</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
