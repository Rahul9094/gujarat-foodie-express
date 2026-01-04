import { Link, useNavigate } from 'react-router-dom';
import { Star, Plus, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { foodItems, restaurants, cities } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import mohanthalImage from '@/assets/mohanthal.webp';

const PopularItems = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const popularItems = foodItems.filter(item => item.isPopular).slice(0, 8);

  const handleAddToCart = (item: typeof foodItems[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const getRestaurantName = (restaurantId: string) => {
    return restaurants.find(r => r.id === restaurantId)?.name || 'Unknown';
  };

  const getRestaurantCity = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      return cities.find(c => c.id === restaurant.cityId);
    }
    return null;
  };

  const handleCityClick = (e: React.MouseEvent, restaurantId: string) => {
    e.stopPropagation();
    const city = getRestaurantCity(restaurantId);
    if (city) {
      navigate(`/cities/${city.id}`);
    }
  };

  const getItemImage = (item: typeof foodItems[0]) => {
    if (item.name === 'Mohanthal') {
      return mohanthalImage;
    }
    return item.image;
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Popular Dishes
            </h2>
            <p className="text-muted-foreground">
              Most loved items by our customers
            </p>
          </div>
          <Link to="/menu">
            <Button variant="outline">View All Menu</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item, index) => {
            const city = getRestaurantCity(item.restaurantId);
            
            return (
              <div
                key={item.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/food/${item.id}`)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.isVeg && (
                    <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Veg
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-spice-turmeric fill-spice-turmeric" />
                    <span className="text-xs font-medium">{item.rating}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    <p className="text-xs text-muted-foreground">
                      by {getRestaurantName(item.restaurantId)}
                    </p>
                    {city && (
                      <button
                        onClick={(e) => handleCityClick(e, item.restaurantId)}
                        className="text-xs text-primary hover:underline"
                      >
                        • {city.name}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-primary">
                      ₹{item.price}
                    </p>
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="rounded-full w-10 h-10 p-0"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularItems;