
INSERT INTO storage.buckets (id, name, public) VALUES ('city-images', 'city-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant-images', 'restaurant-images', true) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to city-images
CREATE POLICY "Public can view city images" ON storage.objects FOR SELECT USING (bucket_id = 'city-images');
-- Allow admins to manage city images
CREATE POLICY "Admins can manage city images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'city-images' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'city-images' AND public.has_role(auth.uid(), 'admin'));

-- Allow public read access to restaurant-images
CREATE POLICY "Public can view restaurant images" ON storage.objects FOR SELECT USING (bucket_id = 'restaurant-images');
-- Allow admins to manage restaurant-images
CREATE POLICY "Admins can manage restaurant images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'restaurant-images' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'restaurant-images' AND public.has_role(auth.uid(), 'admin'));
