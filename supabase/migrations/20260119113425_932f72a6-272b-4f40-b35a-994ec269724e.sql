-- Allow admins to delete any order
CREATE POLICY "Admins can delete any order" 
ON public.orders 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to delete their own cancelled orders
CREATE POLICY "Users can delete own cancelled orders" 
ON public.orders 
FOR DELETE 
USING ((auth.uid() = user_id) AND (status = 'cancelled'::text));

-- Allow admins to delete contact messages
CREATE POLICY "Admins can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));