-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  green_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  co2_emission DECIMAL(5,2) NOT NULL DEFAULT 2.5,
  certifications TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 4.5,
  sales_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- Create vouchers table
CREATE TABLE public.vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  min_purchase_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for vouchers
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Create policies for vouchers
CREATE POLICY "Users can view their own vouchers" 
ON public.vouchers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vouchers" 
ON public.vouchers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create transactions table for GreenPoint history
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  points_earned INTEGER NOT NULL DEFAULT 0,
  co2_saved DECIMAL(5,2) NOT NULL DEFAULT 0,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'voucher_redeem')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE WHEN NEW.email = 'admin@ecoshop.com' THEN true ELSE false END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vouchers for testing
INSERT INTO public.vouchers (id, user_id, title, description, discount_percentage, min_purchase_amount, max_discount_amount, expires_at)
VALUES 
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Giảm 10%', 'Voucher giảm giá 10% cho đơn hàng từ 100k', 10, 100000, 50000, now() + interval '30 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Giảm 20%', 'Voucher giảm giá 20% cho đơn hàng từ 500k', 20, 500000, 100000, now() + interval '30 days');

-- Insert sample products
INSERT INTO public.products (name, category, price, description, image_url, co2_emission, certifications, rating, sales_count)
VALUES 
  ('Túi Vải Hữu Cơ', 'Thời trang', 150000, 'Túi vải organic cotton 100% tự nhiên, thân thiện môi trường', '/src/assets/organic-fashion.jpg', 1.2, ARRAY['Organic', 'Fair Trade'], 4.8, 125),
  ('Thực Phẩm Hữu Cơ', 'Thực phẩm', 80000, 'Rau củ hữu cơ tươi ngon, không thuốc trừ sâu', '/src/assets/organic-food.jpg', 0.8, ARRAY['Organic', 'Local'], 4.7, 89),
  ('Thời Trang Tái Chế', 'Thời trang', 320000, 'Áo làm từ vật liệu tái chế, giảm thiểu tác động môi trường', '/src/assets/recycled-fashion.jpg', 2.1, ARRAY['Recycled', 'Eco-Friendly'], 4.6, 67);