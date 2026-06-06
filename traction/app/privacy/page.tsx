import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white text-[#1D1D1F] selection:bg-green-600 selection:text-white">
      <Navbar />
      <section className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#1D1D1F]">Privacy Policy</h1>
        <div className="space-y-6 text-[#86868B] leading-relaxed text-lg">
          <p className="font-medium text-black/50">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">1. Information We Collect</h2>
          <p>At Traction, we collect information to provide better services to all our users. We may collect personal information such as your name, email address, professional networking data, performance metrics, and location data (specifically for our Nearby Network feature to function properly).</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">2. How We Use Information</h2>
          <p>We use the information we collect to operate, maintain, and improve our services, including the Green Tool analytics, 1-2-1 Conclave matchmaking, and Nearby Network discovery. Your data helps us personalize your experience and facilitate meaningful professional connections.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">3. Information Sharing</h2>
          <p>We do not share your personal information with companies, organizations, or individuals outside of Traction except in the following cases: with your explicit consent, for external processing by trusted partners under strict confidentiality agreements, or for legal reasons.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">4. Data Security</h2>
          <p>We work hard to protect Traction and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We use industry-standard encryption to protect your data in transit and at rest securely.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through our official support channels at support@hackboats.com.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
