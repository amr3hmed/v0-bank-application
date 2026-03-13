-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'customer' or 'admin'
  balance DECIMAL(15, 2) DEFAULT 0.00,
  account_number VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'transfer'
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transfers_from_user_id ON transfers(from_user_id);
CREATE INDEX idx_transfers_to_user_id ON transfers(to_user_id);
CREATE INDEX idx_users_email ON users(email);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id OR current_setting('app.user_role') = 'admin');

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id OR current_setting('app.user_role') = 'admin');

-- RLS Policies for transfers table
CREATE POLICY "Users can view their transfers" ON transfers
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id OR current_setting('app.user_role') = 'admin');

-- Insert sample data
INSERT INTO users (email, password_hash, full_name, phone, role, balance, account_number)
VALUES 
  ('customer@example.com', '$2a$10$YIX2/zBjMq4FX9pWN7nM6eXZ7dD3mK7nM5pL8qM9nP1qR2sT3uV4w', 'أحمد محمود', '0123456789', 'customer', 5000.00, 'ACC-001'),
  ('admin@example.com', '$2a$10$YIX2/zBjMq4FX9pWN7nM6eXZ7dD3mK7nM5pL8qM9nP1qR2sT3uV4w', 'أدمن البنك', '0987654321', 'admin', 0.00, 'ADM-001');

-- Insert sample transactions
INSERT INTO transactions (user_id, type, amount, description, status)
SELECT id, 'deposit', 1000.00, 'إيداع راتب الشهر', 'completed'
FROM users WHERE email = 'customer@example.com'
LIMIT 1;

INSERT INTO transactions (user_id, type, amount, description, status)
SELECT id, 'withdrawal', 500.00, 'سحب نقدي من الصراف الآلي', 'completed'
FROM users WHERE email = 'customer@example.com'
LIMIT 1;
