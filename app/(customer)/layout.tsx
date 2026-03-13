'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Send, History, Settings } from 'lucide-react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'customer') {
      router.push('/login');
    }
    setUserName(localStorage.getItem('userName') || 'العميل');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">البنك</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/customer" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">الرئيسية</span>
            </Link>
            <Link href="/customer/transfers" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">تحويل</span>
            </Link>
            <Link href="/customer/transactions" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition">
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">العمليات</span>
            </Link>
            <div className="w-px h-6 bg-slate-200"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
