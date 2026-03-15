import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FoodItem } from '@/data/mockData';

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  rating: number;
  review_count: number;
  restaurant_id: string;
  category_id: string | null;
  city_id: string;
  is_veg: boolean;
  is_popular: boolean;
  is_published: boolean;
  is_available: boolean;
  display_order: number;
}

// Convert a DB product to the FoodItem interface used throughout the app
export const dbProductToFoodItem = (product: DbProduct): FoodItem => ({
  id: product.id,
  name: product.name,
  description: product.description || '',
  price: product.price,
  image: product.image_url || '/placeholder.svg',
  rating: product.rating,
  reviewCount: product.review_count,
  restaurantId: product.restaurant_id,
  categoryId: product.category_id || '',
  isVeg: product.is_veg,
  isPopular: product.is_popular,
});

export const useProducts = (filters?: {
  categorySlug?: string;
  restaurantId?: string;
  cityId?: string;
  popularOnly?: boolean;
}) => {
  const [products, setProducts] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // First fetch category/city/restaurant slug mappings if needed
      let categoryId: string | undefined;
      let cityId = filters?.cityId;

      if (filters?.categorySlug && filters.categorySlug !== 'all') {
        const { data: cat } = await supabase
          .from('db_categories')
          .select('id')
          .eq('slug', filters.categorySlug)
          .maybeSingle();
        if (cat) categoryId = cat.id;
      }

      let query = supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      if (cityId) {
        query = query.eq('city_id', cityId);
      }
      if (filters?.restaurantId) {
        query = query.eq('restaurant_id', filters.restaurantId);
      }
      if (filters?.popularOnly) {
        query = query.eq('is_popular', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else {
        setProducts((data || []).map(dbProductToFoodItem));
      }
      setLoading(false);
    };

    fetchProducts();
  }, [filters?.categorySlug, filters?.restaurantId, filters?.cityId, filters?.popularOnly]);

  return { products, loading };
};

export const useDbCategories = () => {
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; image_url: string | null; item_count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('db_categories')
        .select('*')
        .order('display_order', { ascending: true });
      setCategories(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { categories, loading };
};

export const useDbCities = () => {
  const [cities, setCities] = useState<{ id: string; name: string; slug: string; image_url: string | null; restaurant_count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('db_cities')
        .select('*')
        .order('name', { ascending: true });
      setCities(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { cities, loading };
};

export const useDbRestaurants = (cityId?: string) => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from('db_restaurants').select('*');
      if (cityId) query = query.eq('city_id', cityId);
      const { data } = await query;
      setRestaurants(data || []);
      setLoading(false);
    };
    fetch();
  }, [cityId]);

  return { restaurants, loading };
};

// Fetch a single product by ID from the database
export const useProductById = (productId: string | undefined) => {
  const [product, setProduct] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .maybeSingle();
      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(dbProductToFoodItem(data as unknown as DbProduct));
      }
      setLoading(false);
    };
    fetch();
  }, [productId]);

  return { product, loading };
};

// Fetch a single restaurant by ID
export const useDbRestaurantById = (restaurantId: string | undefined) => {
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('db_restaurants')
        .select('*')
        .eq('id', restaurantId)
        .maybeSingle();
      setRestaurant(data);
      setLoading(false);
    };
    fetch();
  }, [restaurantId]);

  return { restaurant, loading };
};

// Fetch a single city by ID or slug
export const useDbCityById = (cityIdOrSlug: string | undefined) => {
  const [city, setCity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityIdOrSlug) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      // Try by slug first, then by id
      let { data } = await supabase
        .from('db_cities')
        .select('*')
        .eq('slug', cityIdOrSlug)
        .maybeSingle();
      if (!data) {
        const res = await supabase
          .from('db_cities')
          .select('*')
          .eq('id', cityIdOrSlug)
          .maybeSingle();
        data = res.data;
      }
      setCity(data);
      setLoading(false);
    };
    fetch();
  }, [cityIdOrSlug]);

  return { city, loading };
};
