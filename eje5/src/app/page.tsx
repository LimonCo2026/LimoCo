import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductCatalog from "@/components/ProductCatalog";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <CategorySection />
        <ProductCatalog />
        <BrandStory />
      </main>
      <Footer />
    </>
  );
}
