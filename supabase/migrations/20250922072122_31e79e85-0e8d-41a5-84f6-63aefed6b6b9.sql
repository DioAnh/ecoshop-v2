-- Enable RLS and create policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only view and update their own data
CREATE POLICY "Users can view own data" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users  
FOR UPDATE USING (auth.uid() = id);

-- Enable RLS and create policies for transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can only view and insert their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS and create policies for vouchers table (public read access)
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to vouchers" ON public.vouchers
FOR SELECT USING (true);