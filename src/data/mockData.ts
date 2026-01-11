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
import choleBhatureImage from '@/assets/chole-bhature.jpeg';
import dalBatiImage from '@/assets/dal-bati.jpeg';
import gulabJamunImage from '@/assets/gulab-jamun.jpeg';
import idliImage from '@/assets/idli.jpeg';
import pavBhajiImage from '@/assets/pav-bhaji.jpeg';
import rajasthaniThaliImage from '@/assets/rajasthani-thali.jpeg';
import rasmalaiImage from '@/assets/rasmalai.jpeg';
import springRollsImage from '@/assets/spring-rolls.jpeg';
import pancakeImage from '@/assets/pancake.jpeg';
import chocolateBrownieImage from '@/assets/chocolate-brownie.jpeg';
import kulfiFaloodaImage from '@/assets/kulfi-falooda.jpeg';
import rabdiImage from '@/assets/rabdi.jpeg';
import undhiyuImage from '@/assets/undhiyu.jpeg';
import capitalFoodCourtImage from '@/assets/capital-food-court.jpeg';
import kalyanBhelCenterImage from '@/assets/kalyan-bhel-center.jpeg';
import kathiyavadiRasoiImage from '@/assets/kathiyavadi-rasoi.jpeg';
import nilambagPalaceKitchenImage from '@/assets/nilambag-palace-kitchen.jpeg';
import raniKiVavSweetsImage from '@/assets/rani-ki-vav-sweets.jpeg';
import sayajiBitesImage from '@/assets/sayaji-bites.jpeg';

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
  menuCategories?: string[];
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
    restaurantCount: 5,
    coordinates: { lat: 23.0225, lng: 72.5714 }
  },
  {
    id: "surat",
    name: "Surat",
    image: citySurat,
    restaurantCount: 5,
    coordinates: { lat: 21.1702, lng: 72.8311 }
  },
  {
    id: "vadodara",
    name: "Vadodara",
    image: cityVadodara,
    restaurantCount: 5,
    coordinates: { lat: 22.3072, lng: 73.1812 }
  },
  {
    id: "rajkot",
    name: "Rajkot",
    image: cityRajkot,
    restaurantCount: 5,
    coordinates: { lat: 22.3039, lng: 70.8022 }
  },
  {
    id: "bhavnagar",
    name: "Bhavnagar",
    image: cityBhavnagar,
    restaurantCount: 5,
    coordinates: { lat: 21.7645, lng: 72.1519 }
  },
  {
    id: "patan",
    name: "Patan",
    image: cityPatan,
    restaurantCount: 5,
    coordinates: { lat: 23.8500, lng: 72.1266 }
  },
  {
    id: "gandhinagar",
    name: "Gandhinagar",
    image: cityGandhinagar,
    restaurantCount: 5,
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
  },
  {
    id: "chinese",
    name: "Chinese",
    image: noodlesImage,
    itemCount: 24
  },
  {
    id: "south-indian",
    name: "South Indian",
    image: idliImage,
    itemCount: 20
  },
  {
    id: "desserts",
    name: "Desserts",
    image: pancakeImage,
    itemCount: 18
  }
];

// 35 unique restaurants with unique names and photos
export const restaurants: Restaurant[] = [
  // Ahmedabad - 5 restaurants
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
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets", "fast-food"]
  },
  {
    id: "r2",
    name: "Agashiye Rooftop Dining",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
    cuisine: "Traditional Thali",
    rating: 4.9,
    reviewCount: 256,
    deliveryTime: "35-45 min",
    priceRange: "₹₹",
    cityId: "ahmedabad",
    isVeg: true,
    menuCategories: ["thali", "sweets", "street-food"]
  },
  {
    id: "r11",
    name: "Gordhan Thal Palace",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    cuisine: "Gujarati Thali",
    rating: 4.6,
    reviewCount: 189,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "ahmedabad",
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  {
    id: "r12",
    name: "Honest Restaurant Ahmedabad",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    cuisine: "Multi Cuisine",
    rating: 4.5,
    reviewCount: 421,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "ahmedabad",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "south-indian", "thali"]
  },
  {
    id: "r13",
    name: "Sankalp South Indian",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400",
    cuisine: "South Indian",
    rating: 4.4,
    reviewCount: 312,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "ahmedabad",
    isVeg: true,
    menuCategories: ["south-indian", "fast-food", "sweets"]
  },
  // Surat - 5 restaurants
  {
    id: "r3",
    name: "Surat Locho Corner",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
    cuisine: "Surti Street Food",
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "surat",
    isVeg: true,
    menuCategories: ["street-food", "sweets", "fast-food"]
  },
  {
    id: "r9",
    name: "Ghari Mithai House",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400",
    cuisine: "Traditional Sweets",
    rating: 4.8,
    reviewCount: 267,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "surat",
    isVeg: true,
    menuCategories: ["sweets", "desserts", "street-food"]
  },
  {
    id: "r14",
    name: "Surat Spice Garden",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400",
    cuisine: "Fast Food",
    rating: 4.3,
    reviewCount: 156,
    deliveryTime: "25-35 min",
    priceRange: "₹₹",
    cityId: "surat",
    isVeg: false,
    menuCategories: ["fast-food", "chinese", "thali"]
  },
  {
    id: "r15",
    name: "Diamond City Cafe",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
    cuisine: "Beverages & Snacks",
    rating: 4.6,
    reviewCount: 234,
    deliveryTime: "15-20 min",
    priceRange: "₹",
    cityId: "surat",
    isVeg: true,
    menuCategories: ["fast-food", "desserts", "sweets"]
  },
  {
    id: "r16",
    name: "Tapi River Kitchen",
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400",
    cuisine: "Home Style Gujarati",
    rating: 4.7,
    reviewCount: 189,
    deliveryTime: "30-40 min",
    priceRange: "₹",
    cityId: "surat",
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  // Vadodara - 5 restaurants
  {
    id: "r4",
    name: "Mandvi Pol Dhaba",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400",
    cuisine: "Home Style Gujarati",
    rating: 4.6,
    reviewCount: 421,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "vadodara",
    isVeg: true,
    menuCategories: ["thali", "street-food", "fast-food", "chinese"]
  },
  {
    id: "r10",
    name: "Baroda Palace Kitchen",
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400",
    cuisine: "Gujarati Thali",
    rating: 4.5,
    reviewCount: 189,
    deliveryTime: "30-40 min",
    priceRange: "₹",
    cityId: "vadodara",
    isVeg: true,
    menuCategories: ["thali", "sweets", "street-food"]
  },
  {
    id: "r17",
    name: "Kalyan Bhel Center",
    image: kalyanBhelCenterImage,
    cuisine: "Street Food",
    rating: 4.4,
    reviewCount: 312,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "vadodara",
    isVeg: true,
    menuCategories: ["street-food", "fast-food", "sweets"]
  },
  {
    id: "r18",
    name: "Sayaji Bites",
    image: sayajiBitesImage,
    cuisine: "Fast Food",
    rating: 4.3,
    reviewCount: 178,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "vadodara",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "desserts"]
  },
  {
    id: "r19",
    name: "Lakshmi Vilas Dining",
    image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=400",
    cuisine: "Multi Cuisine",
    rating: 4.6,
    reviewCount: 256,
    deliveryTime: "30-40 min",
    priceRange: "₹₹",
    cityId: "vadodara",
    isVeg: true,
    menuCategories: ["thali", "south-indian", "chinese", "sweets"]
  },
  // Rajkot - 5 restaurants
  {
    id: "r5",
    name: "Kathiyawadi Rasoi",
    image: kathiyavadiRasoiImage,
    cuisine: "Kathiyawadi",
    rating: 4.7,
    reviewCount: 178,
    deliveryTime: "30-40 min",
    priceRange: "₹₹",
    cityId: "rajkot",
    isVeg: false,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  {
    id: "r20",
    name: "Saurashtra Bhojanalaya",
    image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400",
    cuisine: "Rajasthani",
    rating: 4.5,
    reviewCount: 145,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "rajkot",
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  {
    id: "r21",
    name: "Rang De Rajkot",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400",
    cuisine: "Multi Cuisine",
    rating: 4.4,
    reviewCount: 234,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "rajkot",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "south-indian"]
  },
  {
    id: "r22",
    name: "Jubilee Circle Diner",
    image: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=400",
    cuisine: "Fine Dining",
    rating: 4.6,
    reviewCount: 167,
    deliveryTime: "35-45 min",
    priceRange: "₹₹",
    cityId: "rajkot",
    isVeg: true,
    menuCategories: ["thali", "chinese", "desserts"]
  },
  {
    id: "r23",
    name: "Aji Dam Snack Hub",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    cuisine: "Street Food",
    rating: 4.5,
    reviewCount: 289,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "rajkot",
    isVeg: true,
    menuCategories: ["street-food", "fast-food", "sweets"]
  },
  // Bhavnagar - 5 restaurants
  {
    id: "r6",
    name: "Nilambag Palace Kitchen",
    image: nilambagPalaceKitchenImage,
    cuisine: "Pure Veg Thali",
    rating: 4.4,
    reviewCount: 156,
    deliveryTime: "35-45 min",
    priceRange: "₹",
    cityId: "bhavnagar",
    isVeg: true,
    menuCategories: ["thali", "sweets", "street-food"]
  },
  {
    id: "r24",
    name: "Ghogha Circle Dining",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400",
    cuisine: "Gujarati Thali",
    rating: 4.5,
    reviewCount: 178,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "bhavnagar",
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  {
    id: "r25",
    name: "Takhteshwar View Restaurant",
    image: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=400",
    cuisine: "Traditional Gujarati",
    rating: 4.3,
    reviewCount: 134,
    deliveryTime: "30-40 min",
    priceRange: "₹",
    cityId: "bhavnagar",
    isVeg: true,
    menuCategories: ["thali", "south-indian", "sweets"]
  },
  {
    id: "r26",
    name: "Bhavnagar Seafood Express",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    cuisine: "Seafood",
    rating: 4.6,
    reviewCount: 145,
    deliveryTime: "35-45 min",
    priceRange: "₹₹",
    cityId: "bhavnagar",
    isVeg: false,
    menuCategories: ["thali", "fast-food", "chinese"]
  },
  {
    id: "r27",
    name: "Victoria Park Cafe",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    cuisine: "Fast Food",
    rating: 4.2,
    reviewCount: 189,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "bhavnagar",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "desserts"]
  },
  // Patan - 5 restaurants
  {
    id: "r7",
    name: "Rani Ki Vav Sweets",
    image: raniKiVavSweetsImage,
    cuisine: "Sweets & Snacks",
    rating: 4.6,
    reviewCount: 134,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "patan",
    isVeg: true,
    menuCategories: ["sweets", "desserts", "street-food"]
  },
  {
    id: "r28",
    name: "Patan Heritage Dining",
    image: "https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?w=400",
    cuisine: "Traditional Gujarati",
    rating: 4.5,
    reviewCount: 112,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "patan",
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  {
    id: "r29",
    name: "Sahastralinga Cafe",
    image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400",
    cuisine: "Gujarati Thali",
    rating: 4.4,
    reviewCount: 98,
    deliveryTime: "30-40 min",
    priceRange: "₹",
    cityId: "patan",
    isVeg: true,
    menuCategories: ["thali", "south-indian", "sweets"]
  },
  {
    id: "r30",
    name: "Patola Art Diner",
    image: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=400",
    cuisine: "Multi Cuisine",
    rating: 4.3,
    reviewCount: 87,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "patan",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "thali"]
  },
  {
    id: "r31",
    name: "Old Patan Bites",
    image: "https://images.unsplash.com/photo-1541544741670-2fb4d54e8c27?w=400",
    cuisine: "Fast Food",
    rating: 4.2,
    reviewCount: 123,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "patan",
    isVeg: true,
    menuCategories: ["fast-food", "street-food", "desserts"]
  },
  // Gandhinagar - 5 restaurants
  {
    id: "r8",
    name: "Capital Food Court",
    image: capitalFoodCourtImage,
    cuisine: "Multi Cuisine",
    rating: 4.3,
    reviewCount: 98,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "gandhinagar",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "south-indian", "thali"]
  },
  {
    id: "r32",
    name: "Sachivalaya Canteen",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400",
    cuisine: "North Indian",
    rating: 4.5,
    reviewCount: 156,
    deliveryTime: "30-40 min",
    priceRange: "₹₹",
    cityId: "gandhinagar",
    isVeg: true,
    menuCategories: ["thali", "street-food", "sweets"]
  },
  {
    id: "r33",
    name: "Akshardham Dining",
    image: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=400",
    cuisine: "Gujarati Thali",
    rating: 4.6,
    reviewCount: 178,
    deliveryTime: "25-35 min",
    priceRange: "₹",
    cityId: "gandhinagar",
    isVeg: true,
    menuCategories: ["thali", "sweets", "desserts"]
  },
  {
    id: "r34",
    name: "GIFT City Bites",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400",
    cuisine: "Fast Food",
    rating: 4.4,
    reviewCount: 234,
    deliveryTime: "15-25 min",
    priceRange: "₹",
    cityId: "gandhinagar",
    isVeg: true,
    menuCategories: ["fast-food", "chinese", "south-indian"]
  },
  {
    id: "r35",
    name: "Infocity Cafe",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400",
    cuisine: "Home Style",
    rating: 4.5,
    reviewCount: 145,
    deliveryTime: "20-30 min",
    priceRange: "₹",
    cityId: "gandhinagar",
    isVeg: true,
    menuCategories: ["thali", "street-food", "fast-food"]
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
    image: undhiyuImage,
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
  {
    id: "f30",
    name: "Chole Bhature",
    description: "Spicy chickpea curry served with fluffy deep-fried bread - a North Indian classic",
    price: 69,
    image: choleBhatureImage,
    rating: 4.7,
    reviewCount: 234,
    restaurantId: "r12",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f31",
    name: "Dal Bati Churma",
    description: "Rajasthani specialty - baked wheat balls with dal and sweet churma",
    price: 89,
    image: dalBatiImage,
    rating: 4.8,
    reviewCount: 167,
    restaurantId: "r20",
    categoryId: "thali",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f32",
    name: "Rajasthani Thali",
    description: "Complete Rajasthani meal with dal, bati, churma, gatte and traditional sweets",
    price: 129,
    image: rajasthaniThaliImage,
    rating: 4.7,
    reviewCount: 189,
    restaurantId: "r20",
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
  {
    id: "f29",
    name: "Patra",
    description: "Traditional Gujarati dish made with colocasia leaves stuffed with spiced gram flour",
    price: 35,
    image: patraImage,
    rating: 4.7,
    reviewCount: 145,
    restaurantId: "r3",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f34",
    name: "Idli Sambhar",
    description: "Steamed rice cakes served with lentil soup and coconut chutney",
    price: 39,
    image: idliImage,
    rating: 4.6,
    reviewCount: 198,
    restaurantId: "r13",
    categoryId: "south-indian",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f35",
    name: "Pav Bhaji",
    description: "Spiced mixed vegetable curry served with buttery toasted bread",
    price: 55,
    image: pavBhajiImage,
    rating: 4.7,
    reviewCount: 289,
    restaurantId: "r4",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
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
  {
    id: "f33",
    name: "Gulab Jamun",
    description: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup",
    price: 35,
    image: gulabJamunImage,
    rating: 4.8,
    reviewCount: 312,
    restaurantId: "r7",
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
    categoryId: "south-indian",
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
    categoryId: "chinese",
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
    categoryId: "chinese",
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
  // Additional food items for better coverage
  {
    id: "f36",
    name: "Vada Pav",
    description: "Mumbai's famous spicy potato fritter in a bun with garlic chutney",
    price: 25,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
    rating: 4.5,
    reviewCount: 234,
    restaurantId: "r17",
    categoryId: "street-food",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f37",
    name: "Fried Rice",
    description: "Aromatic vegetable fried rice with soy sauce and mixed vegetables",
    price: 60,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    rating: 4.4,
    reviewCount: 178,
    restaurantId: "r21",
    categoryId: "chinese",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f38",
    name: "Spring Rolls",
    description: "Crispy rolls filled with vegetables, served with sweet chili sauce",
    price: 55,
    image: springRollsImage,
    rating: 4.5,
    reviewCount: 145,
    restaurantId: "r18",
    categoryId: "chinese",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f39",
    name: "Medu Vada",
    description: "Crispy lentil donuts served with sambar and coconut chutney",
    price: 35,
    image: "https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=400",
    rating: 4.6,
    reviewCount: 167,
    restaurantId: "r13",
    categoryId: "south-indian",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f40",
    name: "Rasmalai",
    description: "Soft cottage cheese balls soaked in sweetened, thickened milk with cardamom",
    price: 45,
    image: rasmalaiImage,
    rating: 4.8,
    reviewCount: 234,
    restaurantId: "r9",
    categoryId: "desserts",
    isVeg: true,
    isPopular: true
  },
  // More desserts
  {
    id: "f41",
    name: "Kulfi Falooda",
    description: "Traditional Indian ice cream with vermicelli, basil seeds and rose syrup",
    price: 55,
    image: kulfiFaloodaImage,
    rating: 4.7,
    reviewCount: 189,
    restaurantId: "r9",
    categoryId: "desserts",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f42",
    name: "Rabdi",
    description: "Rich, sweetened condensed milk dessert with cardamom and nuts",
    price: 40,
    image: rabdiImage,
    rating: 4.6,
    reviewCount: 156,
    restaurantId: "r7",
    categoryId: "desserts",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f43",
    name: "Ice Cream Sundae",
    description: "Mixed ice cream with chocolate sauce, nuts, and whipped cream",
    price: 65,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    rating: 4.5,
    reviewCount: 234,
    restaurantId: "r15",
    categoryId: "desserts",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f44",
    name: "Pancake",
    description: "Fluffy golden pancakes with butter and maple syrup",
    price: 55,
    image: pancakeImage,
    rating: 4.7,
    reviewCount: 198,
    restaurantId: "r15",
    categoryId: "desserts",
    isVeg: true,
    isPopular: true
  },
  {
    id: "f45",
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with vanilla ice cream and chocolate sauce",
    price: 75,
    image: chocolateBrownieImage,
    rating: 4.6,
    reviewCount: 267,
    restaurantId: "r18",
    categoryId: "desserts",
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
  },
  {
    id: "rev4",
    oderId: "u4@gmail.com",
    userName: "Amit Kumar",
    rating: 5,
    comment: "Amazing food quality and quick delivery. Will order again!",
    date: "2024-01-12",
    restaurantId: "r2"
  },
  {
    id: "rev5",
    oderId: "u5@gmail.com",
    userName: "Sneha Desai",
    rating: 4,
    comment: "Love the variety in their menu. The pav bhaji was fantastic!",
    date: "2024-01-14",
    restaurantId: "r4"
  }
];

// Helper function to get restaurant menu items by category
export const getRestaurantMenuByCategory = (restaurantId: string) => {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return {};
  
  const restaurantItems = foodItems.filter(item => item.restaurantId === restaurantId);
  const menuByCategory: Record<string, FoodItem[]> = {};
  
  // Group items by category
  restaurantItems.forEach(item => {
    if (!menuByCategory[item.categoryId]) {
      menuByCategory[item.categoryId] = [];
    }
    menuByCategory[item.categoryId].push(item);
  });
  
  // Also add items from shared categories
  if (restaurant.menuCategories) {
    restaurant.menuCategories.forEach(categoryId => {
      if (!menuByCategory[categoryId]) {
        // Add some items from this category from other restaurants
        const categoryItems = foodItems.filter(item => item.categoryId === categoryId).slice(0, 4);
        if (categoryItems.length > 0) {
          menuByCategory[categoryId] = categoryItems;
        }
      }
    });
  }
  
  return menuByCategory;
};

// Helper to get popular items for a restaurant
export const getRestaurantPopularItems = (restaurantId: string) => {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return [];
  
  // First get items directly from this restaurant
  const directItems = foodItems.filter(item => item.restaurantId === restaurantId && item.isPopular);
  
  // If not enough, get popular items from same city restaurants
  if (directItems.length < 4 && restaurant.menuCategories) {
    const categoryItems = foodItems
      .filter(item => 
        item.isPopular && 
        restaurant.menuCategories?.includes(item.categoryId) &&
        item.restaurantId !== restaurantId
      )
      .slice(0, 4 - directItems.length);
    
    return [...directItems, ...categoryItems];
  }
  
  return directItems;
};
