import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { cities } from '@/data/mockData';
import { Button } from '@/components/ui/button';

const CitiesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            We Deliver Across Gujarat
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your city and explore the best restaurants and dishes available for delivery
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cities.map((city, index) => (
            <Link
              key={city.id}
              to={`/cities/${city.id}`}
              className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {city.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {city.restaurantCount} Restaurants
                </p>
              </div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-8 h-8 text-primary" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/cities">
            <Button variant="outline" size="lg">
              View All Cities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
