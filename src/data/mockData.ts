// Gujarat Food Express Mock Data
import cityAhmedabad from '@/assets/city-ahmedabad.webp';
import citySurat from '@/assets/city-surat.jpg';
import cityVadodara from '@/assets/city-vadodara.webp';
import cityRajkot from '@/assets/city-rajkot.jpeg';
import cityBhavnagar from '@/assets/city-bhavnagar.webp';
import cityPatan from '@/assets/city-patan.jpg';
import cityGandhinagar from '@/assets/city-gandhinagar.jpeg';
import mohanthalImage from '@/assets/mohanthal.webp';
import basundiImage from '@/assets/basundi.jpg';
import fafdaJalebiImage from '@/assets/fafda-jalebi.jpeg';
import ghughraImage from '@/assets/ghughra.webp';
import handvoImage from '@/assets/handvo.jpeg';
import jalebiImage from '@/assets/jalebi.jpeg';
import khamanDhoklaImage from '@/assets/khaman-dhokla.jpg';
import khandviImage from '@/assets/khandvi.jpg';
import mangoLassiImage from '@/assets/mango-lassi.jpg';
import paniPuriImage from '@/assets/pani-puri.jpg';
import surtiGhariImage from '@/assets/surti-ghari.jpeg';
import sweetsMithaiImage from '@/assets/sweets-mithai.jpg';
import shrikhandImage from '@/assets/shrikhand.jpg';
import surtiLochoImage from '@/assets/surti-locho.jpg';
import sandwichImage from '@/assets/sandwich.jpeg';
import noodlesImage from '@/assets/noodles.jpeg';
import manchurianImage from '@/assets/manchurian.jpeg';
import frenchFriesImage from '@/assets/french-fries.jpeg';
import pizzaImage from '@/assets/pizza.jpeg';
import patraImage from '@/assets/patra.jpeg';
import punjabiThaliImage from '@/assets/punjabi-thali.jpeg';
import southIndianThaliImage from '@/assets/south-indian-thali.jpeg';
import kajuKatliImage from '@/assets/kaju-katli.webp';

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
  oderId: string;
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
    image: cityAhmedabad,
    restaurantCount: 2,
    coordinates: { lat: 23.0225, lng: 72.5714 }
  },
  {
    id: "surat",
    name: "Surat",
    image: citySurat,
    restaurantCount: 2,
    coordinates: { lat: 21.1702, lng: 72.8311 }
  },
  {
    id: "vadodara",
    name: "Vadodara",
    image: cityVadodara,
    restaurantCount: 2,
    coordinates: { lat: 22.3072, lng: 73.1812 }
  },
  {
    id: "rajkot",
    name: "Rajkot",
    image: cityRajkot,
    restaurantCount: 1,
    coordinates: { lat: 22.3039, lng: 70.8022 }
  },
  {
    id: "bhavnagar",
    name: "Bhavnagar",
    image: cityBhavnagar,
    restaurantCount: 1,
    coordinates: { lat: 21.7645, lng: 72.1519 }
  },
  {
    id: "patan",
    name: "Patan",
    image: cityPatan,
    restaurantCount: 1,
    coordinates: { lat: 23.8500, lng: 72.1266 }
  },
  {
    id: "gandhinagar",
    name: "Gandhinagar",
    image: cityGandhinagar,
    restaurantCount: 1,
    coordinates: { lat: 23.2156, lng: 72.6369 }
  }
];

export const categories: Category[] = [
  {
    id: "thali",
    name: "Thalis & Dishes",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    itemCount: 28
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
    image: sweetsMithaiImage,
    itemCount: 32
  },
  {
    id: "fast-food",
    name: "Fast Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    itemCount: 48
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
    priceRange: "₹₹",
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
    priceRange: "₹₹",
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
    priceRange: "₹",
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
    priceRange: "₹",
    cityId: "bhavnagar",
    isVeg: true
  },
  {
    id: "r7",
    name: "Patan Sweets Corner",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400",
    cuisine: "Sweets & Snacks",
    rating: 4.6,
    reviewCount: 134,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "patan",
    isVeg: true
  },
  {
    id: "r8",
    name: "Gandhinagar Food Plaza",
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400",
    cuisine: "Multi Cuisine",
    rating: 4.3,
    reviewCount: 98,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "gandhinagar",
    isVeg: true
  },
  {
    id: "r9",
    name: "Surti Ghari House",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400",
    cuisine: "Traditional Sweets",
    rating: 4.8,
    reviewCount: 267,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "surat",
    isVeg: true
  },
  {
    id: "r10",
    name: "Baroda Bhojanalaya",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
    cuisine: "Gujarati Thali",
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: "30-40 min",
    priceRange: "₹",
    cityId: "vadodara",
    isVeg: true
  }
];

export const foodItems: FoodItem[] = [
  // Thalis & Dishes
  {
    id: "f1",
    name: "Unlimited Gujarati Thali",
    description: "A complete traditional Gujarati meal with dal, kadhi, rotli, rice, sabzi, farsan, and sweets",
    price: 149,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    rating: 4.9,
    reviewCount: 245,
    restaurantId: "r1",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f7",
    name: "Kathiyawadi Thali",
    description: "Spicy and flavorful thali from the Kathiyawad region with unique preparations",
    price: 129,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    rating: 4.8,
    reviewCount: 201,
    restaurantId: "r5",
    categoryId: "thali",
    isVeg: false,
    isPopular: true
  },
  {
    id: "f16",
    name: "Undhiyu",
    description: "Traditional winter dish with mixed vegetables, fenugreek dumplings cooked in earthen pot",
    price: 89,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    rating: 4.8,
    reviewCount: 234,
    restaurantId: "r2",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f21",
    name: "Punjabi Thali",
    description: "Authentic North Indian thali with dal makhani, paneer, naan, rice, raita and pickle",
    price: 139,
    image: punjabiThaliImage,
    rating: 4.7,
    reviewCount: 187,
    restaurantId: "r1",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f22",
    name: "South Indian Thali",
    description: "Traditional South Indian meal with sambar, rasam, rice, poriyal, curd and papad",
    price: 119,
    image: southIndianThaliImage,
    rating: 4.8,
    reviewCount: 156,
    restaurantId: "r6",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  // Street Food
  {
    id: "f2",
    name: "Khaman Dhokla",
    description: "Soft and spongy steamed gram flour cakes topped with mustard seeds and curry leaves",
    price: 35,
    image: khamanDhoklaImage,
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
    price: 30,
    image: fafdaJalebiImage,
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
    price: 25,
    image: surtiLochoImage,
    rating: 4.6,
    reviewCount: 167,
    restaurantId: "r3",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f8",
    name: "Dabeli",
    description: "Spicy potato filling in a pav with special dabeli masala, pomegranate, and sev",
    price: 20,
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
    price: 25,
    image: paniPuriImage,
    rating: 4.5,
    reviewCount: 345,
    restaurantId: "r4",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f12",
    name: "Ghughra",
    description: "Sweet or savory filled pastries - a Gujarati version of samosa with unique spices",
    price: 30,
    image: ghughraImage,
    rating: 4.4,
    reviewCount: 123,
    restaurantId: "r2",
    categoryId: "street-food",
    isVeg: true,
    isPopular: false
  },
  {
    id: "f14",
    name: "Khandvi",
    description: "Thin rolled gram flour snack with coconut and mustard tempering",
    price: 35,
    image: khandviImage,
    rating: 4.6,
    reviewCount: 145,
    restaurantId: "r7",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f17",
    name: "Thepla",
    description: "Spiced flatbread made with fenugreek leaves, perfect for travel snack",
    price: 20,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    rating: 4.5,
    reviewCount: 167,
    restaurantId: "r8",
    categoryId: "street-food",
    isVeg: true,
    isPopular: false
  },
  {
    id: "f20",
    name: "Handvo",
    description: "Savory rice and lentil cake with bottle gourd and spices, baked to perfection",
    price: 40,
    image: handvoImage,
    rating: 4.5,
    reviewCount: 123,
    restaurantId: "r8",
    categoryId: "street-food",
    isVeg: true,
    isPopular: false
  },
  // Sweets & Mithai
  {
    id: "f5",
    name: "Mohanthal",
    description: "Rich besan-based sweet with ghee and dry fruits - a Gujarati festive favorite",
    price: 45,
    image: mohanthalImage,
    rating: 4.5,
    reviewCount: 98,
    restaurantId: "r2",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f6",
    name: "Basundi",
    description: "Thick sweetened milk dessert with cardamom and saffron, garnished with nuts",
    price: 40,
    image: basundiImage,
    rating: 4.7,
    reviewCount: 134,
    restaurantId: "r1",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f13",
    name: "Surti Ghari",
    description: "Famous Surat sweet made with puff pastry, mawa and dry fruits - a festive delicacy",
    price: 55,
    image: surtiGhariImage,
    rating: 4.9,
    reviewCount: 287,
    restaurantId: "r9",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f15",
    name: "Shrikhand",
    description: "Creamy sweetened strained yogurt flavored with saffron and cardamom",
    price: 35,
    image: shrikhandImage,
    rating: 4.7,
    reviewCount: 178,
    restaurantId: "r1",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f19",
    name: "Jalebi",
    description: "Crispy deep-fried sweet spirals soaked in sugar syrup, served hot",
    price: 25,
    image: jalebiImage,
    rating: 4.7,
    reviewCount: 234,
    restaurantId: "r7",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f23",
    name: "Kaju Katli",
    description: "Premium cashew-based diamond-shaped sweet with silver foil - perfect for celebrations",
    price: 60,
    image: kajuKatliImage,
    rating: 4.9,
    reviewCount: 312,
    restaurantId: "r9",
    categoryId: "sweets",
    isVeg: true,
    isPopular: true
  },
  // Fast Food
  {
    id: "f10",
    name: "Veg Cheese Burger",
    description: "Crispy veg patty with melted cheese, fresh veggies, and special sauce",
    price: 59,
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
    price: 49,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
    rating: 4.6,
    reviewCount: 198,
    restaurantId: "r6",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f18",
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with fresh mango pulp and cardamom",
    price: 29,
    image: mangoLassiImage,
    rating: 4.6,
    reviewCount: 189,
    restaurantId: "r10",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f24",
    name: "Sandwich",
    description: "Grilled vegetable sandwich with fresh tomato, cucumber, cheese and green chutney",
    price: 39,
    image: sandwichImage,
    rating: 4.4,
    reviewCount: 178,
    restaurantId: "r8",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f25",
    name: "Noodles",
    description: "Spicy Indo-Chinese hakka noodles with vegetables and soy sauce",
    price: 55,
    image: noodlesImage,
    rating: 4.5,
    reviewCount: 203,
    restaurantId: "r4",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f26",
    name: "Manchurian",
    description: "Crispy veg balls in tangy Indo-Chinese gravy with bell peppers and spring onions",
    price: 65,
    image: manchurianImage,
    rating: 4.6,
    reviewCount: 167,
    restaurantId: "r4",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f27",
    name: "French Fries",
    description: "Golden crispy potato fries served with tomato ketchup and mayo dip",
    price: 45,
    image: frenchFriesImage,
    rating: 4.3,
    reviewCount: 234,
    restaurantId: "r8",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f28",
    name: "Pizza",
    description: "Delicious vegetable pizza with cheese, olives, capsicum and onions",
    price: 99,
    image: pizzaImage,
    rating: 4.5,
    reviewCount: 289,
    restaurantId: "r4",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f29",
    name: "Patra",
    description: "Traditional Gujarati dish made with colocasia leaves stuffed with spiced gram flour",
    price: 35,
    image: patraImage,
    rating: 4.7,
    reviewCount: 145,
    restaurantId: "r3",
    categoryId: "fast-food",
    isVeg: true,
    isPopular: true
  }
];

export const reviews: Review[] = [
  {
    id: "rev1",
    oderId: "u1@gmail.com",
    userName: "Priya Shah",
    rating: 5,
    comment: "Best thali in Ahmedabad! The dal and kadhi were absolutely delicious.",
    date: "2024-01-15",
    restaurantId: "r1"
  },
  {
    id: "rev2",
    oderId: "u2@gmail.com",
    userName: "Rahul Patel",
    rating: 4,
    comment: "Authentic taste of Gujarat. Highly recommended for visitors.",
    date: "2024-01-10",
    itemId: "f1"
  },
  {
    id: "rev3",
    oderId: "u3@gmail.com",
    userName: "Meera Joshi",
    rating: 5,
    comment: "The dhokla here is so soft and fluffy! Just like homemade.",
    date: "2024-01-08",
    itemId: "f2"
  }
];
