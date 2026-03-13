'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/customer/${userId}/transactions`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">سجل العمليات</h1>

        {loading ? (
          <p className="text-slate-600 text-center py-8">جاري التحميل...</p>
        ) : transactions.length === 0 ? (
          <p className="text-slate-600 text-center py-8">لا توجد عمليات حالياً</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      transaction.type === 'deposit'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'deposit' ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-slate-600">{transaction.date}</p>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-1 ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status === 'completed' ? 'مكتملة' : 'قيد الانتظار'}
                    </span>
                  </div>
                </div>
                <p className={`font-bold text-lg ${
                  transaction.type === 'deposit'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {transaction.amount.toLocaleString('ar-EG')} جنيه
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
