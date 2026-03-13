'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userId', data.userId);
        
        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/customer');
        }
      } else {
        alert('خطأ في البريد أو كلمة المرور');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('حدث خطأ في عملية تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white/95 backdrop-blur border-blue-200">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center text-slate-900 mb-2">تطبيق البنك</h1>
      <p className="text-center text-slate-600 mb-6">تسجيل الدخول إلى حسابك</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-slate-700">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 border-slate-300"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-slate-700">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 border-slate-300"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2"
        >
          {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600 text-sm">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          حسابات تجريبية:
        </p>
        <p className="text-xs text-slate-500 text-center mt-2">
          عميل: customer@bank.com / password<br />
          إدارة: admin@bank.com / password
        </p>
      </div>
    </Card>
  );
}
