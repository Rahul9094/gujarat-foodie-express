import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, Plus, Filter, Leaf, Search, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { foodItems, categories, restaurants } from '@/data/mockData';
import { useProducts, useDbCategories, useDbRestaurants } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  // Fetch DB products (published & available)
  const { products: dbProducts, loading } = useProducts();
  const { categories: dbCategories } = useDbCategories();
  const { restaurants: dbRestaurants } = useDbRestaurants();

  // Merge mock + DB products, DB products take priority
  const allItems = useMemo(() => {
    const dbIds = new Set(dbProducts.map(p => p.id));
    const mockFiltered = foodItems.filter(item => !dbIds.has(item.id));
    return [...dbProducts, ...mockFiltered];
  }, [dbProducts]);

  // Build category list from both sources
  const allCategories = useMemo(() => {
    const dbCatMap = new Map(dbCategories.map(c => [c.slug, c]));
    const merged = categories.map(c => {
      const dbCat = dbCatMap.get(c.id);
      return dbCat ? { ...c, id: dbCat.slug } : c;
    });
    // Add any DB categories not in mock
    dbCategories.forEach(dc => {
      if (!categories.find(c => c.id === dc.slug)) {
        merged.push({ id: dc.slug, name: dc.name, image: dc.image_url || '/placeholder.svg', itemCount: dc.item_count });
      }
    });
    return merged;
  }, [dbCategories]);

  // Filter logic - match category by slug or categoryId
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Category match: check mock categoryId or DB category slug
      let categoryMatch = selectedCategory === 'all';
      if (!categoryMatch) {
        if (item.categoryId === selectedCategory) {
          categoryMatch = true;
        } else {
          // Check if item's category_id maps to the selected slug
          const dbCat = dbCategories.find(c => c.id === item.categoryId);
          if (dbCat && dbCat.slug === selectedCategory) categoryMatch = true;
        }
      }
      const vegMatch = !vegOnly || item.isVeg;
      const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && vegMatch && searchMatch;
    });
  }, [allItems, selectedCategory, vegOnly, searchQuery, dbCategories]);

  const handleAddToCart = (item: typeof foodItems[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const getRestaurantName = (restaurantId: string) => {
    const dbR = dbRestaurants.find(r => r.id === restaurantId);
    if (dbR) return dbR.name;
    return restaurants.find(r => r.id === restaurantId)?.name || 'Unknown';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-warm py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Explore Our Menu
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover authentic Gujarati dishes from thalis to street food
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-card rounded-xl shadow-card p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
              >
                All
              </Button>
              {allCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                >
                  <span className="truncate max-w-[80px] sm:max-w-none">{category.name}</span>
                </Button>
              ))}
              <div className="border-l border-border pl-1.5 sm:pl-2">
                <Button
                  variant={vegOnly ? 'accent' : 'outline'}
                  size="sm"
                  onClick={() => setVegOnly(!vegOnly)}
                  className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                >
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> 
                  <span className="hidden xs:inline">Veg Only</span>
                  <span className="xs:hidden">Veg</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="mb-4 text-muted-foreground">
            {loading ? 'Loading...' : `Showing ${filteredItems.length} items`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/food/${item.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.isVeg && (
                      <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Veg
                      </div>
                    )}
                    {item.isPopular && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                        Popular
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-spice-turmeric fill-spice-turmeric" />
                      <span className="text-xs font-medium">{item.rating}</span>
                    </div>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                        <Eye className="w-4 h-4" /> View Details
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/food/${item.id}`}>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1 hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    by {getRestaurantName(item.restaurantId)}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xl text-primary">
                      ₹{item.price}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/food/${item.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full px-3">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="hero"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(item);
                        }}
                        className="rounded-full"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                No items found with the selected filters.
              </p>
              <Button variant="outline" onClick={() => { setSelectedCategory('all'); setVegOnly(false); setSearchQuery(''); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Menu;
