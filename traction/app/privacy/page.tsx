import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white text-[#1D1D1F] selection:bg-green-600 selection:text-white">
      <Navbar />
      <section className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#1D1D1F]">Privacy Policy</h1>
        <div className="space-y-8 text-[#86868B] leading-relaxed text-lg">
          <p className="font-medium text-black/50">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">1. Information We Collect</h2>
            <p className="mb-4">At Traction (a product of HackBoats), we collect various types of information to provide and improve our services, including the Green Tool, 1-2-1 Conclave, and Atlas. This includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1D1D1F]">Personal Information:</strong> Name, email address, profile picture, profession, and company details provided directly by you or via third-party OAuth providers (e.g., Google).</li>
              <li><strong className="text-[#1D1D1F]">Location Data:</strong> To enable features like Atlas, we may request access to your device's precise geolocation. We only collect location data with your explicit consent.</li>
              <li><strong className="text-[#1D1D1F]">Usage Data:</strong> Information about how you interact with our platform, performance metrics for the Green Tool, and your networking activity.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">2. How We Use Information</h2>
            <p className="mb-4">We process your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To operate, maintain, and provide the core functionality of the Traction platform.</li>
              <li>To personalize your experience, such as showing relevant professionals nearby on the Atlas map.</li>
              <li>To facilitate 1-2-1 Conclave matchmaking and professional networking opportunities.</li>
              <li>To send administrative notifications, updates, and security alerts.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">3. Information Sharing & Disclosure</h2>
            <p className="mb-4">We value your privacy and do not sell your personal data to third parties. We may share your information only in the following scenarios:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1D1D1F]">With other users:</strong> Profile information and business locations (if opted-in via Atlas) are visible to other approved members to facilitate networking.</li>
              <li><strong className="text-[#1D1D1F]">Service Providers:</strong> We may employ third-party companies (e.g., cloud hosting, analytics) to facilitate our Service. These parties have access to your data only to perform tasks on our behalf and are obligated not to disclose it.</li>
              <li><strong className="text-[#1D1D1F]">Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">4. Your Data Rights</h2>
            <p>You have the right to access, update, or delete the personal information we have on you. You can manage your profile and location data directly within your Traction account settings. If you wish to completely delete your account and associated data, please contact our support team.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">5. Data Security</h2>
            <p>The security of your data is important to us. We implement robust, industry-standard security measures, including encryption in transit and at rest, to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">6. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
            <p className="mt-2"><strong className="text-[#1D1D1F]">Email:</strong> support@hackboats.com</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
