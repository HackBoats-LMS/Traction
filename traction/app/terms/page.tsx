import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white text-[#1D1D1F] selection:bg-green-600 selection:text-white">
      <Navbar />
      <section className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#1D1D1F]">Terms of Service</h1>
        <div className="space-y-6 text-[#86868B] leading-relaxed text-lg">
          <p className="font-medium text-black/50">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using Traction ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or applications.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">2. Description of Service</h2>
          <p>Traction provides a suite of professional tools including, but not limited to, the Green Tool (analytics dashboard), 1-2-1 Conclave (structured networking events), and Nearby Network (local professional discovery). We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">3. User Conduct</h2>
          <p>You agree to use Traction for lawful professional networking purposes only. You must not use the service to harass, abuse, or harm another person. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">4. Intellectual Property</h2>
          <p>All content, features, and functionality of the Service are owned by Traction (and HackBoats) and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          
          <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">5. Limitation of Liability</h2>
          <p>Traction shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service, including any loss of data or professional opportunities.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
