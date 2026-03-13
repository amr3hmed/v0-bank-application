-- Create user_roles enum
CREATE TYPE user_role AS ENUM ('customer', 'employee', 'admin');

-- Create profiles table for additional user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  user_type user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Customers can view and update their own profile
CREATE POLICY "Customers can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Customers can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Customers can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Employees and admins can view all profiles
CREATE POLICY "Employees can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type IN ('employee', 'admin')
  )
);

-- Create accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'savings',
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can update own accounts" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Employees can view all accounts" ON public.accounts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type IN ('employee', 'admin')
  )
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  balance_after DECIMAL(15, 2),
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own transactions" ON public.transactions FOR SELECT USING (
  account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
);

CREATE POLICY "Employees can view all transactions" ON public.transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type IN ('employee', 'admin')
  )
);

-- Create transfers table
CREATE TABLE IF NOT EXISTS public.transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  to_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'completed',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own transfers" ON public.transfers FOR SELECT USING (
  from_account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid()) OR
  to_account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
);

CREATE POLICY "Employees can view all transfers" ON public.transfers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type IN ('employee', 'admin')
  )
);

-- Create credit_cards table
CREATE TABLE IF NOT EXISTS public.credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  card_holder TEXT NOT NULL,
  expiry_month INTEGER,
  expiry_year INTEGER,
  cvv TEXT,
  card_type TEXT DEFAULT 'visa',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own cards" ON public.credit_cards FOR SELECT USING (
  account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
);

CREATE POLICY "Customers can update own cards" ON public.credit_cards FOR UPDATE USING (
  account_id IN (SELECT id FROM public.accounts WHERE user_id = auth.uid())
);

-- Create employees table for admin access
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can view own data" ON public.employees FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all employees" ON public.employees FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, user_type)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'customer')::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to log all transactions
CREATE OR REPLACE FUNCTION public.log_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.accounts SET balance = balance - NEW.amount
  WHERE id = NEW.account_id AND NEW.transaction_type = 'withdrawal';
  
  UPDATE public.accounts SET balance = balance + NEW.amount
  WHERE id = NEW.account_id AND NEW.transaction_type = 'deposit';
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_transaction_created ON public.transactions;

CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_transaction();
