export async function generateMetadata({ params }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  try {
    const res = await fetch(`${apiBaseUrl}/products?slug=${params.slug}`);
    if (res.ok) {
      const product = await res.json();
      return {
        title: product.seo_title || `${product.title} - Nagpal Natraj`,
        description: product.seo_description || `Check out the ${product.title} at Nagpal Natraj.`,
        keywords: product.seo_keywords || '',
      };
    }
  } catch (e) {
    console.error("Metadata fetch error:", e);
  }
  
  return {
    title: 'Product | Nagpal Natraj',
  };
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
