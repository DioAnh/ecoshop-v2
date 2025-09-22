-- Add note field to transactions table for voucher exchange tracking
ALTER TABLE public.transactions 
ADD COLUMN note TEXT;