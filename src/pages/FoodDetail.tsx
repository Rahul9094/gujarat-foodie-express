import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Plus, Minus, MapPin, Clock, Phone, ArrowLeft, Leaf, ShoppingCart, Navigation, Trash2, Pencil } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { foodItems, restaurants, cities, reviews } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import mohanthalImage from '@/assets/mohanthal.webp';

const FoodDetail = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState<typeof reviews>([]);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const food = foodItems.find(f => f.id === foodId);
  const restaurant = food ? restaurants.find(r => r.id === food.restaurantId) : null;
  const city = restaurant ? cities.find(c => c.id === restaurant.cityId) : null;
  
  useEffect(() => {
    const storedReviews = localStorage.getItem(`reviews_${foodId}`);
    const dbReviews = reviews.filter(r => r.itemId === foodId);
    if (storedReviews) {
      setLocalReviews([...dbReviews, ...JSON.parse(storedReviews)]);
    } else {
      setLocalReviews(dbReviews);
    }
  }, [foodId]);

  const { user } = useAuth();

  const handleSubmitReview = () => {
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    const newReview = {
      id: `rev_${Date.now()}`,
      oderId: user.email,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      itemId: foodId,
    };
    
    const existingReviews = JSON.parse(localStorage.getItem(`reviews_${foodId}`) || '[]');
    const updatedReviews = [...existingReviews, newReview];
    localStorage.setItem(`reviews_${foodId}`, JSON.stringify(updatedReviews));
    
    setLocalReviews([...localReviews, newReview]);
    setShowReviewForm(false);
    setReviewComment('');
    setReviewRating(5);
    toast.success('Review submitted successfully!');
  };

  const handleDeleteReview = (reviewId: string) => {
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${foodId}`) || '[]');
    const updatedStoredReviews = storedReviews.filter((r: any) => r.id !== reviewId);
    localStorage.setItem(`reviews_${foodId}`, JSON.stringify(updatedStoredReviews));
    
    setLocalReviews(localReviews.filter(r => r.id !== reviewId));
    toast.success('Review deleted successfully!');
  };

  const handleEditReview = (review: typeof reviews[0]) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = (reviewId: string) => {
    if (!editComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${foodId}`) || '[]');
    const updatedStoredReviews = storedReviews.map((r: any) => 
      r.id === reviewId ? { ...r, rating: editRating, comment: editComment } : r
    );
    localStorage.setItem(`reviews_${foodId}`, JSON.stringify(updatedStoredReviews));
    
    setLocalReviews(localReviews.map(r => 
      r.id === reviewId ? { ...r, rating: editRating, comment: editComment } : r
    ));
    
    setEditingReview(null);
    setEditComment('');
    setEditRating(5);
    toast.success('Review updated successfully!');
  };

  const getItemImage = () => {
    if (food?.name === 'Mohanthal') {
      return mohanthalImage;
    }
    return food?.image || '';
  };

  if (!food || !restaurant || !city) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Food item not found
            </h1>
            <Link to="/menu">
              <Button>Back to Menu</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(food);
    }
    toast.success(`${quantity}x ${food.name} added to cart!`);
  };

  // Related foods from same restaurant
  const relatedFoods = foodItems.filter(f => f.restaurantId === food.restaurantId && f.id !== food.id).slice(0, 4);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        {/* Food Details Section */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Food Image */}
            <div className="relative animate-fade-in">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-card">
                <img
                  src={getItemImage()}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {food.isVeg && (
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Leaf className="w-4 h-4" /> Pure Veg
                </div>
              )}
              {food.isPopular && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
                  Popular
                </div>
              )}
            </div>

            {/* Food Info */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {food.name}
                </h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-spice-turmeric fill-spice-turmeric" />
                    <span className="font-semibold">{food.rating}</span>
                    <span className="text-muted-foreground">({food.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-lg">
                {food.description}
              </p>

              <div className="text-4xl font-bold text-primary">
                ₹{food.price}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-secondary rounded-xl p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart • ₹{food.price * quantity}
                </Button>
              </div>

              {/* Restaurant Info Card */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Available at
                </h3>
                <Link to={`/restaurants/${restaurant.id}`} className="group">
                  <div className="flex gap-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {restaurant.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-spice-turmeric fill-spice-turmeric" />
                          <span>{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {restaurant.deliveryTime}
                        </div>
                        <span className="text-muted-foreground">{restaurant.priceRange}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Map Section */}
        <div className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Pickup Location
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* City & Restaurant Info */}
              <div className="space-y-4 animate-fade-in">
                <div className="bg-card rounded-xl p-6 shadow-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {city.name}, Gujarat
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {restaurant.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        123, Main Market Road, Near City Center<br />
                        {city.name} - 380001, Gujarat, India
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Open Hours</p>
                        <p className="text-xs text-muted-foreground">9 AM - 11 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Contact</p>
                        <p className="text-xs text-muted-foreground">+91 98765 43210</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* City Card */}
                <Link to={`/cities/${city.id}`} className="block">
                  <div className="bg-card rounded-xl overflow-hidden shadow-card group">
                    <div className="relative h-32">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <p className="text-xs text-background/80">Explore more in</p>
                        <h4 className="font-display text-xl font-bold text-background">
                          {city.name}
                        </h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {city.restaurantCount} restaurants delivering in this city
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Map */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-card rounded-xl overflow-hidden shadow-card h-full min-h-[400px]">
                  <div className="relative w-full h-full">
                    <iframe
                      title={`Map of ${city.name}`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${city.coordinates.lng - 0.05}%2C${city.coordinates.lat - 0.03}%2C${city.coordinates.lng + 0.05}%2C${city.coordinates.lat + 0.03}&layer=mapnik&marker=${city.coordinates.lat}%2C${city.coordinates.lng}`}
                      className="w-full h-full min-h-[400px] border-0"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + ', ' + city.name + ', Gujarat')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="hero" className="w-full">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Customer Reviews
            </h2>
            <Button variant="outline" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-card rounded-xl p-6 shadow-card mb-6 animate-fade-in">
              <h3 className="font-semibold text-foreground mb-4">Write Your Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= reviewRating
                              ? 'text-spice-turmeric fill-spice-turmeric'
                              : 'text-muted hover:text-spice-turmeric'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this dish..."
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground resize-none h-24"
                  />
                </div>
                <Button variant="hero" onClick={handleSubmitReview}>
                  Submit Review
                </Button>
              </div>
            </div>
          )}

        {localReviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {localReviews.map((review, index) => (
                <div
                  key={review.id}
                  className="bg-card rounded-xl p-6 shadow-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
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
                    {review.id.startsWith('rev_') && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditReview(review)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingReview === review.id ? (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Rating
                        </label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditRating(star)}
                              className="p-1"
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  star <= editRating
                                    ? 'text-spice-turmeric fill-spice-turmeric'
                                    : 'text-muted hover:text-spice-turmeric'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground resize-none h-20"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="hero" onClick={() => handleSaveEdit(review.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingReview(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-8 text-center shadow-card">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this dish!
              </p>
            </div>
          )}
        </div>

        {/* Related Items */}
        {relatedFoods.length > 0 && (
          <div className="bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                More from {restaurant.name}
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedFoods.map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/food/${item.id}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground text-sm line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">₹{item.price}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 text-spice-turmeric fill-spice-turmeric" />
                          {item.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FoodDetail;
