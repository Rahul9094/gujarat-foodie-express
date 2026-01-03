import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Utensils } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { cities } from '@/data/mockData';

const Cities = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
              Choose Your City
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              We deliver across 5 major cities in Gujarat. Select your city to explore restaurants and dishes available in your area.
            </p>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city, index) => (
              <Link
                key={city.id}
                to={`/cities/${city.id}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-display text-2xl font-bold text-background flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {city.name}
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Utensils className="w-4 h-4" />
                      <span>{city.restaurantCount} Restaurants</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                      Explore <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4 text-center">
              Gujarat Delivery Coverage
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                title="Gujarat Delivery Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=68.5%2C20.0%2C75.0%2C24.5&layer=mapnik&marker=22.3%2C72.0"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Currently delivering in: Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cities;
