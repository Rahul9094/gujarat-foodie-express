import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, ArrowLeft, Leaf, Navigation, ShoppingCart, Flame } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { restaurants, cities, foodItems, reviews, getRestaurantPopularItems } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const RestaurantDetail = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const restaurant = restaurants.find(r => r.id === restaurantId);
  const city = restaurant ? cities.find(c => c.id === restaurant.cityId) : null;
  
  // Get restaurant menu items - exactly 5 items per restaurant
  const getRestaurantMenu = () => {
    if (!restaurant) return [];
    
    // Get items directly from this restaurant
    const directItems = foodItems.filter(f => f.restaurantId === restaurantId);
    
    // Get additional items from restaurant's menu categories if needed
    const additionalItems: typeof foodItems = [];
    if (restaurant.menuCategories && directItems.length < 5) {
      restaurant.menuCategories.forEach(categoryId => {
        const categoryItems = foodItems
          .filter(item => item.categoryId === categoryId && item.restaurantId !== restaurantId)
          .slice(0, 2);
        additionalItems.push(...categoryItems);
      });
    }
    
    // Combine and ensure uniqueness, limit to exactly 5 items
    const allItems = [...directItems, ...additionalItems];
    const uniqueItems = allItems.filter((item, index, self) => 
      index === self.findIndex(i => i.id === item.id)
    );
    
    return uniqueItems.slice(0, 5); // Limit to exactly 5 items
  };

  const menuItems = getRestaurantMenu();
  const popularItems = getRestaurantPopularItems(restaurantId || '');
  const restaurantReviews = reviews.filter(r => r.restaurantId === restaurantId);

  const handleAddToCart = (item: typeof foodItems[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  if (!restaurant || !city) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Restaurant not found
            </h1>
            <Link to="/restaurants">
              <Button>Back to Restaurants</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        {/* Restaurant Header */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Restaurant Image */}
            <div className="relative animate-fade-in">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-card">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {restaurant.isVeg && (
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Leaf className="w-4 h-4" /> Pure Veg
                </div>
              )}
            </div>

            {/* Restaurant Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-lg text-muted-foreground">{restaurant.cuisine}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 bg-secondary px-3 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-spice-turmeric fill-spice-turmeric" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-muted-foreground">({restaurant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 bg-secondary px-3 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="bg-secondary px-3 py-2 rounded-lg font-medium">
                  {restaurant.priceRange}
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Location
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{city.name}, Gujarat</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      123, Main Market Road, Near City Center<br />
                      {city.name} - 380001, Gujarat, India
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">+91 98765 43210</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + ', ' + city.name + ', Gujarat')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="hero" className="w-full">
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </a>
                <Link to={`/menu?restaurant=${restaurant.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Full Menu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Items / Top Selling Dishes */}
        {popularItems.length > 0 && (
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Top Selling Dishes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {popularItems.slice(0, 8).map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link to={`/food/${item.id}`}>
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                        Bestseller
                      </div>
                    </div>
                  </Link>
                  <div className="p-2 sm:p-3">
                    <h3 className="font-medium text-foreground text-xs sm:text-sm line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 sm:mt-1 hidden sm:block">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-1 sm:mt-2">
                      <span className="font-bold text-primary text-sm sm:text-base">₹{item.price}</span>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-spice-turmeric fill-spice-turmeric" />
                        {item.rating}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-1 sm:mt-2 text-xs sm:text-sm h-7 sm:h-8"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items - No Categories */}
        <div className="bg-secondary/30 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
              📋 Menu
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl p-3 sm:p-4 shadow-card flex gap-3 sm:gap-4 animate-fade-in hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={`/food/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-foreground text-sm sm:text-base line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 sm:mt-1">
                          <Star className="w-3 h-3 text-spice-turmeric fill-spice-turmeric" />
                          {item.rating} ({item.reviewCount})
                        </div>
                      </div>
                      {item.isVeg && (
                        <div className="w-4 h-4 border border-green-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 hidden sm:block">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary text-sm sm:text-base">₹{item.price}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Restaurant Location
            </h2>
            <div className="rounded-xl overflow-hidden shadow-card h-[400px]">
              <iframe
                title={`Map of ${restaurant.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${city.coordinates.lng - 0.05}%2C${city.coordinates.lat - 0.03}%2C${city.coordinates.lng + 0.05}%2C${city.coordinates.lat + 0.03}&layer=mapnik&marker=${city.coordinates.lat}%2C${city.coordinates.lng}`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        {restaurantReviews.length > 0 && (
          <div className="bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Customer Reviews
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {restaurantReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="bg-card rounded-xl p-6 shadow-card animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{review.userName}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'text-spice-turmeric fill-spice-turmeric' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantDetail;
