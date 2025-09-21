-- Create RLS policies for products table to allow public read access
CREATE POLICY "Allow public read access to products" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert products (for admin)
CREATE POLICY "Allow authenticated users to insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to update products (for admin)
CREATE POLICY "Allow authenticated users to update products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policy for authenticated users to delete products (for admin)
CREATE POLICY "Allow authenticated users to delete products" 
ON public.products 
FOR DELETE 
USING (auth.uid() IS NOT NULL);