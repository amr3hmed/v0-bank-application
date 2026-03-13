'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, TrendingDown, TrendingUp, Send } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

export default function CustomerDashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/customer/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance || 0);
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <Card className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-2">الرصيد الحالي</p>
              <h2 className="text-4xl font-bold">{balance.toLocaleString('ar-EG')} جنيه</h2>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Account Number Card */}
        <Card className="p-8 bg-white border-slate-200">
          <p className="text-slate-600 text-sm mb-2">رقم الحساب</p>
          <p className="text-2xl font-bold text-slate-900 mb-4">1234567890</p>
          <div className="space-y-2">
            <Link href="/customer/transfers">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                تحويل الأموال
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">الإيداعات هذا الشهر</p>
              <p className="text-2xl font-bold text-green-600 mt-2">+5,000.00 جنيه</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">المسحوبات هذا الشهر</p>
              <p className="text-2xl font-bold text-red-600 mt-2">-2,000.00 جنيه</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">آخر العمليات</h3>
          <Link href="/customer/transactions">
            <Button variant="outline" size="sm">عرض الكل</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">جاري التحميل...</p>
        ) : transactions.length === 0 ? (
          <p className="text-slate-600 text-center py-8">لا توجد عمليات حالياً</p>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <TrendingUp className={`w-5 h-5 ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`} />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{transaction.description}</p>
                    <p className="text-sm text-slate-600">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount.toLocaleString('ar-EG')} جنيه
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
