'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        router.push('/login?success=true');
      } else {
        const error = await response.json();
        alert(error.message || 'حدث خطأ في إنشاء الحساب');
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('حدث خطأ في عملية التسجيل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white/95 backdrop-blur border-blue-200">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">إنشاء حساب جديد</h1>
      <p className="text-center text-slate-600 mb-6">انضم إلى تطبيق البنك الآن</p>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-slate-700">الاسم الكامل</Label>
          <Input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="أحمد محمد"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="mt-2 border-slate-300"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-slate-700">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 border-slate-300"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-slate-700">رقم الهاتف</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            placeholder="01001234567"
            value={formData.phone}
            onChange={handleChange}
            className="mt-2 border-slate-300"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-slate-700">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-2 border-slate-300"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-slate-700">تأكيد كلمة المرور</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-2 border-slate-300"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2"
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600 text-sm">
          هل لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </Card>
  );
}
