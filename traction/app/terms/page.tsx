import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white text-[#1D1D1F] selection:bg-green-600 selection:text-white">
      <Navbar />
      <section className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#1D1D1F]">Terms of Service</h1>
        <div className="space-y-8 text-[#86868B] leading-relaxed text-lg">
          <p className="font-medium text-black/50">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using Traction (the "Service"), provided by HackBoats, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">2. Description of Service</h2>
            <p className="mb-4">Traction is a professional networking and performance platform offering several integrated modules:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1D1D1F]">Green Tool:</strong> Performance analytics and business growth tracking.</li>
              <li><strong className="text-[#1D1D1F]">1-2-1 Conclave:</strong> Structured scheduling and matchmaking for professional networking events.</li>
              <li><strong className="text-[#1D1D1F]">Atlas:</strong> A geospatial map interface for discovering and connecting with local professionals and businesses.</li>
            </ul>
            <p className="mt-4">We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">3. User Accounts & Responsibilities</h2>
            <p className="mb-4">To use certain features like Atlas, you must authenticate using a third-party provider (e.g., Google OAuth). You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate, current, and complete information during registration.</li>
              <li>Maintaining the security of your account and credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Ensuring your interactions with other professionals on the platform remain respectful and strictly professional.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">4. Intellectual Property Rights</h2>
            <p>The Service and its original content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by HackBoats and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">5. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">6. Limitation of Liability</h2>
            <p>In no event shall HackBoats, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; and (iii) unauthorized access, use or alteration of your transmissions or content.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
