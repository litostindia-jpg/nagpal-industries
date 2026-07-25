import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ContactUs from "../../components/ContactUs";

export const metadata = {
  title: "Blogs - Nagpal Natraj Industries",
  description: "Read the latest news and insights from Nagpal Natraj Industries.",
};

export default async function BlogsPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  let blogs = [];
  try {
    const res = await fetch(`${apiBaseUrl}/blogs`, { next: { revalidate: 60 } });
    if (res.ok) {
      blogs = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch blogs", e);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#b8965a] selection:text-white">
      <Header />
      <div className="pt-32 pb-20 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-[#1c1917] tracking-wider mb-4">Our Blog</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-medium">Insights, updates, and news from the industry.</p>
        </div>
      </div>
      
      <div className="flex-1 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <article key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-[#b8965a]/10 transition-all border border-[#eaddc7]/30 group">
                  <div className="aspect-video bg-zinc-100 overflow-hidden relative">
                    {blog.image ? (
                      <img src={`http://localhost:8000${blog.image}`} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold">No Image</div>
                    )}
                    {blog.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#b8965a] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                        {blog.category.name}
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 space-y-4">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-[#b8965a] transition-colors">{blog.title}</h3>
                    <div 
                      className="text-sm text-zinc-500 line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    <div className="pt-4 border-t border-[#eaddc7]/30">
                      <a href={`/blogs/${blog.slug}`} className="text-xs font-black uppercase tracking-widest text-[#1c1917] hover:text-[#b8965a] transition-colors flex items-center gap-2">
                        Read More
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-[#faf8f5] rounded-3xl border border-[#eaddc7]/30">
              <h2 className="text-2xl font-bold mb-2">No Blogs Found</h2>
              <p className="text-zinc-500">Check back later for new updates.</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#eaddc7]/30 bg-[#faf8f5]">
        <ContactUs />
      </div>
      <Footer />
    </main>
  );
}
