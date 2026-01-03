// Gujarat Food Express Mock Data

export interface City {
  id: string;
  name: string;
  image: string;
  restaurantCount: number;
  coordinates: { lat: number; lng: number };
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  priceRange: string;
  cityId: string;
  isVeg: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  restaurantId: string;
  categoryId: string;
  isVeg: boolean;
  isPopular: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  itemId?: string;
  restaurantId?: string;
}

export const cities: City[] = [
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400",
    restaurantCount: 45,
    coordinates: { lat: 23.0225, lng: 72.5714 }
  },
  {
    id: "surat",
    name: "Surat",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400",
    restaurantCount: 38,
    coordinates: { lat: 21.1702, lng: 72.8311 }
  },
  {
    id: "vadodara",
    name: "Vadodara",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400",
    restaurantCount: 32,
    coordinates: { lat: 22.3072, lng: 73.1812 }
  },
  {
    id: "rajkot",
    name: "Rajkot",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400",
    restaurantCount: 28,
    coordinates: { lat: 22.3039, lng: 70.8022 }
  },
  {
    id: "bhavnagar",
    name: "Bhavnagar",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400",
    restaurantCount: 20,
    coordinates: { lat: 21.7645, lng: 72.1519 }
  }
];

export const categories: Category[] = [
  {
    id: "thali",
    name: "Gujarati Thali",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    itemCount: 24
  },
  {
    id: "street-food",
    name: "Street Food",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    itemCount: 36
  },
  {
    id: "sweets",
    name: "Sweets & Mithai",
    image: "https://images.unsplash.com/photo-1605197788044-5a5e5e5f5f5f?w=400",
    itemCount: 28
  },
  {
    id: "fast-food",
    name: "Fast Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    itemCount: 42
  }
];

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Vishalla Heritage Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    cuisine: "Authentic Gujarati",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: "30-40 min",
    priceRange: "₹₹₹",
    cityId: "ahmedabad",
    isVeg: true
  },
  {
    id: "r2",
    name: "Agashiye Rooftop",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    cuisine: "Traditional Thali",
    rating: 4.9,
    reviewCount: 256,
    deliveryTime: "35-45 min",
    priceRange: "₹₹₹₹",
    cityId: "ahmedabad",
    isVeg: true
  },
  {
    id: "r3",
    name: "Surat Locho House",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    cuisine: "Surti Street Food",
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "surat",
    isVeg: true
  },
  {
    id: "r4",
    name: "Mandvi ni Pol Dhaba",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
    cuisine: "Home Style Gujarati",
    rating: 4.6,
    reviewCount: 421,
    deliveryTime: "25-35 min",
    priceRange: "₹₹",
    cityId: "vadodara",
    isVeg: true
  },
  {
    id: "r5",
    name: "Rajkot Kathiyawadi Rasoi",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
    cuisine: "Kathiyawadi",
    rating: 4.7,
    reviewCount: 178,
    deliveryTime: "30-40 min",
    priceRange: "₹₹",
    cityId: "rajkot",
    isVeg: false
  },
  {
    id: "r6",
    name: "Nilkanth Dining Hall",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
    cuisine: "Pure Veg Thali",
    rating: 4.4,
    reviewCount: 156,
    deliveryTime: "35-45 min",
    priceRange: "₹₹",
    cityId: "bhavnagar",
    isVeg: true
  }
];

export const foodItems: FoodItem[] = [
  {
    id: "f1",
    name: "Unlimited Gujarati Thali",
    description: "A complete traditional Gujarati meal with dal, kadhi, rotli, rice, sabzi, farsan, and sweets",
    price: 350,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    rating: 4.9,
    reviewCount: 245,
    restaurantId: "r1",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f2",
    name: "Khaman Dhokla",
    description: "Soft and spongy steamed gram flour cakes topped with mustard seeds and curry leaves",
    price: 80,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    rating: 4.7,
    reviewCount: 189,
    restaurantId: "r3",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f3",
    name: "Fafda Jalebi",
    description: "Crispy gram flour strips served with sweet jalebis - the perfect Sunday breakfast combo",
    price: 60,
    image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400",
    rating: 4.8,
    reviewCount: 312,
    restaurantId: "r3",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f4",
    name: "Surti Locho",
    description: "Surat's famous soft and spicy snack made from chana dal, served with sev and chutney",
    price: 50,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400",
    rating: 4.6,
    reviewCount: 167,
    restaurantId: "r3",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f5",
    name: "Mohanthal",
    description: "Rich besan-based sweet with ghee and dry fruits - a Gujarati festive favorite",
    price: 120,
    image: "https://images.unsplash.com/photo-1605197788044-5a5e5e5f5f5f?w=400",
    rating: 4.5,
    reviewCount: 98,
    restaurantId: "r2",
    categoryId: "sweets",
    isVeg: true,
    isPopular: false
  },
  {
    id: "f6",
    name: "Basundi",
    description: "Thick sweetened milk dessert with cardamom and saffron",
    price: 90,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    rating: 4.7,
    reviewCount: 134,
    restaurantId: "r1",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f7",
    name: "Kathiyawadi Thali",
    description: "Spicy and flavorful thali from the Kathiyawad region with unique preparations",
    price: 299,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    rating: 4.8,
    reviewCount: 201,
    restaurantId: "r5",
    categoryId: "thali",
    isVeg: false,
    isPopular: true
  },
  {
    id: "f8",
    name: "Dabeli",
    description: "Spicy potato filling in a pav with special dabeli masala, pomegranate, and sev",
    price: 40,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
    rating: 4.6,
    reviewCount: 278,
    restaurantId: "r4",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f9",
    name: "Pani Puri",
    description: "Crispy puris filled with spiced potato and tangy tamarind water",
    price: 50,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400",
    rating: 4.5,
    reviewCount: 345,
    restaurantId: "r4",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f10",
    name: "Veg Cheese Burger",
    description: "Crispy veg patty with melted cheese, fresh veggies, and special sauce",
    price: 120,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    rating: 4.3,
    reviewCount: 156,
    restaurantId: "r4",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: false
  },
  {
    id: "f11",
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato masala, served with sambar and chutney",
    price: 90,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
    rating: 4.6,
    reviewCount: 198,
    restaurantId: "r6",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f12",
    name: "Ghughra",
    description: "Sweet or savory filled pastries - a Gujarati version of samosa with unique spices",
    price: 70,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    rating: 4.4,
    reviewCount: 123,
    restaurantId: "r2",
    categoryId: "street-food",
    isVeg: true,
    isPopular: false
  }
];

export const reviews: Review[] = [
  {
    id: "rev1",
    userId: "u1",
    userName: "Priya Shah",
    rating: 5,
    comment: "Best thali in Ahmedabad! The dal and kadhi were absolutely delicious.",
    date: "2024-01-15",
    restaurantId: "r1"
  },
  {
    id: "rev2",
    userId: "u2",
    userName: "Rahul Patel",
    rating: 4,
    comment: "Authentic taste of Gujarat. Highly recommended for visitors.",
    date: "2024-01-10",
    itemId: "f1"
  },
  {
    id: "rev3",
    userId: "u3",
    userName: "Meera Joshi",
    rating: 5,
    comment: "The dhokla here is so soft and fluffy! Just like homemade.",
    date: "2024-01-08",
    itemId: "f2"
  }
];
