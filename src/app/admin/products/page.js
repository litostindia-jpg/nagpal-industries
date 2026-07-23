"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">Loading editor...</div>
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
};

export default function AdminProducts() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoExists, setLogoExists] = useState(true);

  // Lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // Array of File objects
  const [existingImages, setExistingImages] = useState([]); // Paths to keep
  const [videoFile, setVideoFile] = useState(null);
  const [currentVideoPath, setCurrentVideoPath] = useState("");
  const [removeVideo, setRemoveVideo] = useState(false);

  // Specs points grouped: [{"heading": "", "items": [{"key": "", "value": ""}]}]
  const [details, setDetails] = useState([{ heading: "", items: [{ key: "", value: "" }] }]);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (!storedToken) {
      router.push("/admin");
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchInitialData();
  }, [router]);

  const fetchInitialData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/categories`),
        fetch(`${apiBaseUrl}/products`)
      ]);

      if (catsRes.ok) setCategories(await catsRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());

      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load initial configuration data.");
      setLoading(false);
    }
  };

  // Specs point helpers (Nested)
  const addSpecGroup = () => {
    setDetails([...details, { heading: "", items: [{ key: "", value: "" }] }]);
  };

  const removeSpecGroup = (groupIdx) => {
    setDetails(details.filter((_, i) => i !== groupIdx));
  };

  const updateSpecGroupHeading = (groupIdx, val) => {
    const updated = [...details];
    updated[groupIdx].heading = val;
    setDetails(updated);
  };

  const addSpecItem = (groupIdx) => {
    const updated = [...details];
    updated[groupIdx].items.push({ key: "", value: "" });
    setDetails(updated);
  };

  const removeSpecItem = (groupIdx, itemIdx) => {
    const updated = [...details];
    updated[groupIdx].items = updated[groupIdx].items.filter((_, i) => i !== itemIdx);
    setDetails(updated);
  };

  const updateSpecItem = (groupIdx, itemIdx, field, val) => {
    const updated = [...details];
    updated[groupIdx].items[itemIdx][field] = val;
    setDetails(updated);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!categoryId) {
      setErrorMessage("Please select a category.");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("seo_title", seoTitle);
    formData.append("seo_description", seoDescription);
    formData.append("seo_keywords", seoKeywords);

    // Filter blank spec points
    const filteredDetails = details.map(group => {
      const filteredItems = group.items.filter(pt => pt.key.trim() !== "" && pt.value.trim() !== "");
      return { heading: group.heading, items: filteredItems };
    }).filter(group => group.heading.trim() !== "" || group.items.length > 0);
    
    formData.append("details", JSON.stringify(filteredDetails));

    // Append multiple files
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images[]", imageFiles[i]);
    }

    if (videoFile) {
      formData.append("video", videoFile);
    }

    if (editProduct) {
      formData.append("existing_images", JSON.stringify(existingImages));
      formData.append("remove_video", removeVideo ? "1" : "0");
    }

    const endpoint = editProduct
      ? `${apiBaseUrl}/products/${editProduct.id}`
      : `${apiBaseUrl}/products`;

    try {
      const res = await fetch(endpoint, {
        method: "POST", // POST for multipart data updates
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(editProduct ? "Product updated!" : "Product created!");
        resetForm();
        fetchInitialData();
      } else {
        setErrorMessage(data.message || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred during submission.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCategoryId("");
    setTitle("");
    setDescription("");
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setImageFiles([]);
    setExistingImages([]);
    setVideoFile(null);
    setCurrentVideoPath("");
    setRemoveVideo(false);
    setDetails([{ heading: "", items: [{ key: "", value: "" }] }]);
    setEditProduct(null);
    setIsModalOpen(false);
  };

  const startEdit = (prod) => {
    setEditProduct(prod);
    setCategoryId(prod.category_id);
    setTitle(prod.title);
    setDescription(prod.description || "");
    setSeoTitle(prod.seo_title || "");
    setSeoDescription(prod.seo_description || "");
    setSeoKeywords(prod.seo_keywords || "");
    setExistingImages(prod.images || []);
    setCurrentVideoPath(prod.video || "");
    setRemoveVideo(false);
    
    // Handle old details format
    let loadedDetails = [{ heading: "", items: [{ key: "", value: "" }] }];
    if (prod.details && prod.details.length > 0) {
      if (prod.details[0].heading !== undefined) {
        loadedDetails = prod.details; // New format
      } else if (prod.details[0].key !== undefined) {
        loadedDetails = [{ heading: "General Specifications", items: prod.details }]; // Old format fallback
      }
    }
    setDetails(loadedDetails);

    setImageFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${apiBaseUrl}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSuccessMessage("Product deleted successfully.");
        fetchInitialData();
      } else {
        setErrorMessage("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred during deletion.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#b8965a]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
          <a href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#292524] text-zinc-400 hover:text-white text-sm font-semibold transition-all">
            Categories
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8965a]/10 text-[#b8965a] text-sm font-semibold border border-[#b8965a]/20 transition-all">
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
          <h1 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">Manage Products</h1>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-[#b8965a] hover:bg-[#a08048] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-sm">
            + Add Product
          </button>
        </header>

        <div className="flex-1 p-8 max-w-5xl w-full mx-auto flex flex-col gap-8">
          {/* List Panel */}
          <div className="w-full space-y-6">
            <div className="rounded-3xl border border-[#eaddc7]/50 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider mb-4">Products List</h3>

              <div className="divide-y divide-[#eaddc7]/30">
                {products.length > 0 ? (
                  products.map((prod) => (
                    <div key={prod.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {prod.images && prod.images.length > 0 ? (
                          <img src={prod.images[0]} alt={prod.title} className="h-12 w-12 rounded-xl object-cover bg-gray-50 border border-[#eaddc7]/40" />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-400">N/A</div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-[#1c1917] truncate">{prod.title}</h4>
                          <span className="text-[10px] font-mono text-zinc-400 block truncate">
                            Category: <span className="text-[#b8965a] font-bold">{prod.category?.name || "Uncategorized"}</span> &bull; /{prod.slug}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(prod)}
                          className="px-3 py-1.5 border border-[#eaddc7] text-[#b8965a] text-[10px] font-bold rounded-lg hover:bg-[#faf8f5]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 py-8 text-center">No products created yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                <h3 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">
                  {editProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button 
                  onClick={resetForm}
                  className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-6">
                {errorMessage && <div className="p-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl">{errorMessage}</div>}
                {successMessage && <div className="p-3 text-xs text-teal-600 bg-teal-50 border border-teal-100 rounded-xl">{successMessage}</div>}

                <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Select Category</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Product Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Heavy Duty Sheet Pasting Machine"
                      className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Multiple Product Images (Upload)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImageFiles(Array.from(e.target.files))}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {editProduct && existingImages.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <span className="block text-[9px] text-[#57534e] font-bold uppercase tracking-wide">Active Images (Click to delete):</span>
                        <div className="flex flex-wrap gap-2">
                          {existingImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} className="h-12 w-12 object-cover border rounded-xl" />
                              <button
                                type="button"
                                onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-[8px] leading-none hover:bg-red-600 shadow"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Product Demo Video (Upload)</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="w-full text-xs text-[#57534e] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-[#eaddc7] file:text-[10px] file:font-semibold file:bg-[#faf8f5] cursor-pointer"
                    />
                    {currentVideoPath && (
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-[9px] text-zinc-400 truncate max-w-xs">Active: {currentVideoPath.split('/').pop()}</span>
                        <label className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 cursor-pointer">
                          <input type="checkbox" checked={removeVideo} onChange={(e) => setRemoveVideo(e.target.checked)} className="rounded" />
                          Delete Video
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Specs points "Add More" block with Headings */}
                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-3">Product Specs & Features</label>
                    <div className="space-y-6">
                      {details.map((group, groupIdx) => (
                        <div key={groupIdx} className="p-4 border border-[#eaddc7]/60 bg-white rounded-2xl relative shadow-sm">
                          {details.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSpecGroup(groupIdx)}
                              className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-red-100 hover:bg-red-500 text-red-600 hover:text-white flex items-center justify-center font-bold text-sm shadow transition-colors"
                            >
                              &times;
                            </button>
                          )}
                          
                          <div className="mb-4">
                            <input
                              type="text"
                              value={group.heading}
                              onChange={(e) => updateSpecGroupHeading(groupIdx, e.target.value)}
                              placeholder="Section Heading (e.g. Technical Specifications)"
                              className="w-full text-xs font-bold text-[#1c1917] bg-[#faf8f5] border-b-2 border-transparent focus:border-[#b8965a] pb-2 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-3">
                            {group.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex gap-2 items-center group/item">
                                <input
                                  type="text"
                                  value={item.key}
                                  onChange={(e) => updateSpecItem(groupIdx, itemIdx, "key", e.target.value)}
                                  placeholder="e.g. Voltage"
                                  className="w-1/3 text-[11px] text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#b8965a]"
                                />
                                <input
                                  type="text"
                                  value={item.value}
                                  onChange={(e) => updateSpecItem(groupIdx, itemIdx, "value", e.target.value)}
                                  placeholder="e.g. 220-380 Volt"
                                  className="flex-1 text-[11px] text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#b8965a]"
                                />
                                {group.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSpecItem(groupIdx, itemIdx)}
                                    className="text-red-400 hover:text-red-600 font-bold text-lg px-2 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                  >
                                    &times;
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addSpecItem(groupIdx)}
                              className="text-[9px] bg-[#faf8f5] border border-[#eaddc7] text-[#b8965a] px-3 py-1.5 rounded-lg font-bold hover:bg-white transition-all uppercase tracking-wider mt-2"
                            >
                              + Add Spec Point
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addSpecGroup}
                        className="w-full border-2 border-dashed border-[#eaddc7] text-[#57534e] hover:border-[#b8965a] hover:text-[#b8965a] text-[10px] font-bold uppercase tracking-widest py-4 rounded-2xl transition-all"
                      >
                        + Add New Specs Section
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">Detailed Description</label>
                    <div className="bg-white rounded-xl overflow-hidden [&_.ql-toolbar]:border-[#eaddc7] [&_.ql-container]:border-[#eaddc7] [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs [&_.ql-toolbar]:bg-[#faf8f5]">
                      <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} />
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="pt-6 border-t border-[#eaddc7]/50 space-y-6">
                    <h4 className="text-sm font-bold text-[#1c1917] uppercase tracking-wider">SEO Settings</h4>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">SEO Title (Meta Title)</label>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="e.g. Best Corrugated Box Making Machine | Nagpal Natraj"
                        className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">SEO Description (Meta Description)</label>
                      <textarea
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Write a brief description for search engines..."
                        rows={3}
                        className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#57534e] font-bold uppercase tracking-wide mb-1.5">SEO Keywords</label>
                      <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        placeholder="e.g. machinery, packaging, carton box machine (comma separated)"
                        className="w-full text-xs text-[#1c1917] bg-[#faf8f5] border border-[#eaddc7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#b8965a] transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-[#b8965a] hover:bg-[#a08048] text-white text-xs font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                      {saving ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 bg-[#faf8f5] border border-[#eaddc7] text-[#57534e] text-xs font-semibold rounded-xl hover:bg-zinc-100 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

