-- Create RLS policy for category table to allow public read access
CREATE POLICY "Allow public read access to categories" 
ON public.category 
FOR SELECT 
USING (true);