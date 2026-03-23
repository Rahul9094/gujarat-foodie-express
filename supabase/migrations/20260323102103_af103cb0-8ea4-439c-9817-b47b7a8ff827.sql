ALTER TABLE public.orders ADD COLUMN payment_status text NOT NULL DEFAULT 'pending';

-- Enable realtime for orders table (if not already)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;