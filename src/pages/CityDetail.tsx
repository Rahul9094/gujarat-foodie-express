import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useDbCityById, useDbRestaurants } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

const CityDetail = () => {
  const { cityId } = useParams();
  const { city, loading: cityLoading } = useDbCityById(cityId);
  const { restaurants: allRestaurants, loading: restLoading } = useDbRestaurants();

  const cityRestaurants = useMemo(() => {
    if (!city) return [];
    return allRestaurants.filter((r: any) => r.city_id === city.id);
  }, [allRestaurants, city]);

  if (cityLoading || restLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!city) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">City not found</h1>
            <Link to="/cities">
              <Button>Back to Cities</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative h-64 sm:h-80">
          <img src={city.image_url || '/placeholder.svg'} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Gujarat, India</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-background">{city.name}</h1>
            <p className="text-background/80 mt-2">{cityRestaurants.length} restaurants available for delivery</p>
          </div>
        </div>

        {/* Restaurants */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Popular Restaurants in {city.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cityRestaurants.map((restaurant: any, index: number) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="group bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={restaurant.image_url || '/placeholder.svg'} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {restaurant.is_veg && (
                    <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">Pure Veg</div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1 line-clamp-1">{restaurant.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{restaurant.cuisine}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-spice-turmeric fill-spice-turmeric flex-shrink-0" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-muted-foreground hidden sm:inline">({restaurant.review_count})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{restaurant.delivery_time}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs sm:text-sm">{restaurant.price_range}</span>
                    <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-xs sm:text-sm">
                      <span className="hidden sm:inline">View Menu</span>
                      <span className="sm:hidden">Menu</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {cityRestaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No restaurants available in this city yet.</p>
              <Link to="/cities">
                <Button variant="outline">Explore Other Cities</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CityDetail;
