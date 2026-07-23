"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCategories() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [logoExists, setLogoExists] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      router.push("/admin");
      return;
    }
    setToken(storedToken);
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/categories`);
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

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditCategory(null);
  };

  const startEdit = (cat) => {
    setEditCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    const endpoint = editCategory
      ? `${apiBaseUrl}/categories/${editCategory.id}`
      : `${apiBaseUrl}/categories`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(editCategory ? "Category updated!" : "Category created!");
        resetForm();
        fetchCategories();
      } else {
        setErrorMessage(data.message || "Failed to save category.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSuccessMessage("Category deleted.");
        fetchCategories();
      } else {
        setErrorMessage("Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 text-[#b8965a] rounded-full border-4 border-t-transparent border-[#b8965a]/20"></div>
      </div>
    );
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
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Dashboard
          </a>
          <a href="/admin/home" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Home Page
          </a>
          <a href="/admin/about" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            About Us Page
          </a>
          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all">
            Categories
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Products
          </a>
          
          <a href="/admin/blog-categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Blog Categories</a>
          <a href="/admin/blogs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">Blogs</a>
          <a href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Site Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-auto">
        <header className="h-16 border-b border-[#eaddc7]/40 px-8 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">Manage Categories</h1>
        </header>

        <div className="flex-1 p-8 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-6 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">
                {editCategory ? "Edit Category" : "Add New Category"}
              </h3>

              {errorMessage && <div className="p-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl">{errorMessage}</div>}
              {successMessage && <div className="p-3 text-xs text-teal-600 bg-teal-50 border border-teal-100 rounded-xl">{successMessage}</div>}

              <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                <div>
                  <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Category Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Corrugating Machinery"
                    className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Description (Optional)</label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Category description..."
                    className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#b8965a] hover:bg-[#a08048] text-white text-xs font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editCategory ? "Update Category" : "Create Category"}
                  </button>
                  {editCategory && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 bg-[#faf8f5] border border-[#eaddc7] text-[#57534e] text-xs font-semibold rounded-xl hover:bg-zinc-100 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider mb-4">Categories List</h3>

              <div className="divide-y divide-[#eaddc7]/30">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div key={cat.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs text-[#1c1917]">{cat.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-400 block truncate">
                          /{cat.slug}
                        </span>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="px-3 py-1.5 border border-[#eaddc7] text-[#b8965a] text-[10px] font-bold rounded-lg hover:bg-[#faf8f5]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 py-8 text-center">No categories created yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
