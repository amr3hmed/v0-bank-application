# تطبيق البنك - دليل الإعداد

## متطلبات البدء

- Node.js 18+ 
- حساب Supabase
- متصفح حديث

## خطوات الإعداد

### 1. تثبيت المكتبات
```bash
npm install
# أو
pnpm install
# أو
yarn install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env.local` في المجلد الجذر:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. إنشاء جداول قاعدة البيانات

أذهب إلى Supabase SQL Editor وأنفذ الكود التالي:

```sql
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
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, password_hash, full_name, phone, balance, account_number, role, is_active) VALUES
('customer@bank.com', 'password', 'عميل البنك', '01001234567', 50000, '1234567890', 'customer', true),
('admin@bank.com', 'password', 'مدير الإدارة', '01109876543', 0, NULL, 'admin', true);

-- Insert sample transactions
INSERT INTO transactions (user_id, type, amount, description, status) 
SELECT id, 'deposit', 5000, 'إيداع أولي', 'completed' 
FROM users WHERE email = 'customer@bank.com';
```

### 4. تشغيل التطبيق

```bash
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000)

## حسابات اختبار

**عميل:**
- البريد: `customer@bank.com`
- كلمة المرور: `password`

**إدارة:**
- البريد: `admin@bank.com`
- كلمة المرور: `password`

## المميزات

### للعملاء
- عرض الرصيد والعمليات
- تحويل الأموال
- عرض سجل المعاملات
- لوحة تحكم شاملة

### للمسؤولين
- عرض قائمة المستخدمين
- تفعيل/تعطيل الحسابات
- حذف المستخدمين
- عرض إحصائيات النظام

## البنية

```
app/
├── (auth)/          # صفحات المصادقة
│   ├── login/
│   └── register/
├── (customer)/      # صفحات العميل
│   └── customer/
├── (admin)/         # صفحات الإدارة
│   └── admin/
├── api/            # API routes
│   ├── auth/
│   ├── customer/
│   └── admin/
└── page.tsx        # الصفحة الرئيسية
```

## الدعم

للمزيد من المساعدة، راجع الوثائق الرسمية:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
