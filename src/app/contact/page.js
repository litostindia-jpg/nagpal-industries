import ContactUs from "../../components/ContactUs";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Contact Us - Nagpal Natraj Industries",
  description: "Get in touch with Nagpal Natraj Industries for premium corrugated board machinery.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#b8965a] selection:text-white">
      <Header />
      <div className="pt-24 md:pt-32 pb-16 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-[#1c1917] tracking-wider mb-4">Contact Us</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-medium">We're here to help and answer any question you might have. We look forward to hearing from you.</p>
        </div>
      </div>
      <ContactUs />
      <Footer />
    </main>
  );
}
