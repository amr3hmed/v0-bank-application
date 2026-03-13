'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Check, X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  balance: number;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        alert('تم حذف المستخدم بنجاح');
      } else {
        alert('فشل حذف المستخدم');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حدث خطأ في حذف المستخدم');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, is_active: !isActive } : u
          )
        );
        alert(isActive ? 'تم تعطيل الحساب' : 'تم تفعيل الحساب');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('حدث خطأ في تحديث الحساب');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">إدارة المستخدمين</h1>
        <p className="text-slate-600">إدارة حسابات جميع العملاء</p>
      </div>

      <Card className="p-6 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">قائمة المستخدمين</h2>
          <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {users.length} مستخدم
          </span>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">جاري التحميل...</p>
        ) : users.length === 0 ? (
          <p className="text-slate-600 text-center py-8">لا توجد مستخدمون</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-4 px-4 text-slate-600 font-semibold">الاسم</th>
                  <th className="py-4 px-4 text-slate-600 font-semibold">البريد الإلكتروني</th>
                  <th className="py-4 px-4 text-slate-600 font-semibold">رقم الهاتف</th>
                  <th className="py-4 px-4 text-slate-600 font-semibold">الرصيد</th>
                  <th className="py-4 px-4 text-slate-600 font-semibold">الحالة</th>
                  <th className="py-4 px-4 text-slate-600 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {user.full_name}
                    </td>
                    <td className="py-4 px-4 text-slate-600">{user.email}</td>
                    <td className="py-4 px-4 text-slate-600">{user.phone}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {user.balance.toLocaleString('ar-EG')} جنيه
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.is_active ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          className="flex items-center gap-1"
                        >
                          {user.is_active ? (
                            <>
                              <X className="w-4 h-4" />
                              <span className="hidden sm:inline text-xs">تعطيل</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="hidden sm:inline text-xs">تفعيل</span>
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline text-xs">حذف</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
