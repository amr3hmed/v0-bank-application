'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Activity, TrendingUp, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    activeTransactions: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'إجمالي الأرصدة',
      value: `${stats.totalBalance.toLocaleString('ar-EG')} جنيه`,
      icon: CreditCard,
      color: 'green',
    },
    {
      title: 'العمليات النشطة',
      value: stats.activeTransactions,
      icon: Activity,
      color: 'orange',
    },
    {
      title: 'إجمالي العمليات',
      value: stats.totalTransactions,
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">مرحباً بك في لوحة التحكم</h1>
        <p className="text-slate-600">إدارة شاملة لتطبيق البنك</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const colorClass = colorClasses[card.color as keyof typeof colorClasses];

          return (
            <Card key={idx} className="p-6 border-slate-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm mb-2">{card.title}</p>
                  {loading ? (
                    <p className="text-2xl font-bold text-slate-400">...</p>
                  ) : (
                    <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                  )}
                </div>
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="p-8 border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">معلومات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-slate-600 mb-2">المستخدمون الجدد</p>
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-xs text-slate-500 mt-2">هذا الأسبوع</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-slate-600 mb-2">إجمالي التحويلات</p>
            <p className="text-2xl font-bold text-green-600">245</p>
            <p className="text-xs text-slate-500 mt-2">هذا الشهر</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-slate-600 mb-2">معدل الرضا</p>
            <p className="text-2xl font-bold text-orange-600">98%</p>
            <p className="text-xs text-slate-500 mt-2">من المستخدمين</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
