#!/usr/bin/env python3
import os
import sys

# Get database URL from environment
db_url = os.getenv('POSTGRES_URL')
if not db_url:
    print("Error: POSTGRES_URL not set")
    sys.exit(1)

# Read SQL file content directly
sql_content = """
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  balance DECIMAL(15, 2) DEFAULT 0.00,
  account_number VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  description VARCHAR(255),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (email, password_hash, full_name, phone, balance, account_number) VALUES
('customer@bank.com', '$2b$10$example', 'عميل البنك', '01001234567', 50000, '1234567890'),
('admin@bank.com', '$2b$10$example', 'الإدارة', '01109876543', 0, NULL);

UPDATE users SET role = 'admin' WHERE email = 'admin@bank.com';
"""

# Execute using psycopg2
try:
    import psycopg2
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Execute all statements
    cursor.execute(sql_content)
    conn.commit()
    
    cursor.close()
    conn.close()
    print("✓ Database schema created successfully!")
    
except ImportError:
    print("Error: psycopg2 not installed")
    sys.exit(1)
except Exception as e:
    print(f"Error setting up database: {e}")
    sys.exit(1)
