import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Filter, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useDbRestaurants, useDbCities } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

const Restaurants = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState(false);

  const { restaurants, loading: restLoading } = useDbRestaurants();
  const { cities, loading: citiesLoading } = useDbCities();

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant: any) => {
      const cityMatch = selectedCity === 'all' || restaurant.city_id === selectedCity;
      const vegMatch = !vegOnly || restaurant.is_veg;
      return cityMatch && vegMatch;
    });
  }, [restaurants, selectedCity, vegOnly]);

  const getCityName = (cityId: string) => {
    return cities.find((c: any) => c.id === cityId)?.name || '';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-warm py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Our Partner Restaurants</h1>
            <p className="text-muted-foreground max-w-2xl">Discover the best restaurants serving authentic Gujarati cuisine and more.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl shadow-card">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedCity === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCity('all')}>All Cities</Button>
              {cities.map((city: any) => (
                <Button key={city.id} variant={selectedCity === city.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCity(city.id)}>
                  {city.name}
                </Button>
              ))}
            </div>
            <div className="border-l border-border pl-4">
              <Button variant={vegOnly ? 'accent' : 'outline'} size="sm" onClick={() => setVegOnly(!vegOnly)}>🥬 Veg Only</Button>
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="container mx-auto px-4 pb-16">
          {(restLoading || citiesLoading) ? (
            <div className="text-center py-12 text-muted-foreground">Loading restaurants...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant: any, index: number) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={restaurant.image_url || '/placeholder.svg'} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {restaurant.is_veg && (
                      <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">Pure Veg</div>
                    )}
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-spice-turmeric fill-spice-turmeric" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {restaurant.delivery_time}
                      </div>
                      <span>{restaurant.price_range}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {getCityName(restaurant.city_id)}
                      </div>
                      <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
                        View <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredRestaurants.length === 0 && !restLoading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No restaurants found with the selected filters.</p>
              <Button variant="outline" onClick={() => { setSelectedCity('all'); setVegOnly(false); }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Restaurants;
