import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import PopularItems from '@/components/home/PopularItems';
import CitiesSection from '@/components/home/CitiesSection';
import FeaturesSection from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategorySection />
      <PopularItems />
      <CitiesSection />
      <FeaturesSection />
    </Layout>
  );
};

export default Index;
