import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ecosystem from "@/components/Ecosystem";
import ProductsAccordion from "@/components/ProductsAccordion";
import BniConnect from "@/components/BniConnect";
import FeaturesGrid from "@/components/FeaturesGrid";
import ProductDescriptions from "@/components/ProductDescriptions";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#1D1D1F] overflow-x-hidden selection:bg-green-600 selection:text-white">
      <Navbar />
      <Hero />

      <div id="next-section">
        <FeaturesGrid />
        <div className="flex flex-col xl:hidden">
          <Ecosystem isGridMode={false} />
          <ProductsAccordion />
        </div>
      </div>

      {/* Detailed Product Descriptions */}
      <ProductDescriptions />

      {/* Footer */}
      <Footer />
    </main>
  );
}
