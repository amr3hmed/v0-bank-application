'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle } from 'lucide-react';

export default function TransfersPage() {
  const [formData, setFormData] = useState({
    recipientAccount: '',
    recipientName: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('/api/customer/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ recipientAccount: '', recipientName: '', amount: '', description: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('حدث خطأ في العملية');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      alert('حدث خطأ في التحويل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Send className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">تحويل الأموال</h1>
            <p className="text-slate-600 text-sm">قم بتحويل الأموال إلى حسابات أخرى</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-semibold">تم التحويل بنجاح!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="recipientName" className="text-slate-700">اسم المستقبل</Label>
            <Input
              id="recipientName"
              name="recipientName"
              placeholder="أحمد محمد"
              value={formData.recipientName}
              onChange={handleChange}
              required
              className="mt-2 border-slate-300"
            />
          </div>

          <div>
            <Label htmlFor="recipientAccount" className="text-slate-700">رقم حساب المستقبل</Label>
            <Input
              id="recipientAccount"
              name="recipientAccount"
              placeholder="1234567890"
              value={formData.recipientAccount}
              onChange={handleChange}
              required
              className="mt-2 border-slate-300"
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-slate-700">المبلغ (جنيه)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="1000.00"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-2 border-slate-300"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-700">البيان (اختياري)</Label>
            <Input
              id="description"
              name="description"
              placeholder="السبب من التحويل..."
              value={formData.description}
              onChange={handleChange}
              className="mt-2 border-slate-300"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          >
            {loading ? 'جاري المعالجة...' : 'تأكيد التحويل'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
