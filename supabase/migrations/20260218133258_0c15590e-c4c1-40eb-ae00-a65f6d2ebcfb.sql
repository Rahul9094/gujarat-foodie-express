
-- Create cities table
CREATE TABLE public.db_cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image_url TEXT,
  restaurant_count INT NOT NULL DEFAULT 0,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.db_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image_url TEXT,
  item_count INT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restaurants table
CREATE TABLE public.db_restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image_url TEXT,
  cuisine TEXT,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  delivery_time TEXT,
  price_range TEXT,
  city_id UUID REFERENCES public.db_cities(id) ON DELETE CASCADE NOT NULL,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  menu_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  restaurant_id UUID REFERENCES public.db_restaurants(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.db_categories(id) ON DELETE SET NULL,
  city_id UUID REFERENCES public.db_cities(id) ON DELETE CASCADE NOT NULL,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger for updated_at on products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.db_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.db_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.db_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read for cities, categories, restaurants (everyone can browse)
CREATE POLICY "Anyone can view cities" ON public.db_cities FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories" ON public.db_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view restaurants" ON public.db_restaurants FOR SELECT USING (true);

-- Products: public can only see published + available
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true AND is_available = true);

-- Admin full access to all tables
CREATE POLICY "Admins can manage cities" ON public.db_cities FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage categories" ON public.db_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage restaurants" ON public.db_restaurants FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));
