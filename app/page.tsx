'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, Wallet, Send, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Bank App</h1>
            <Button variant="outline">تسجيل الدخول</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">أهلاً بك في تطبيق البنك</h2>
          <p className="text-lg text-muted-foreground mb-8">
            خدمات مصرفية حديثة وآمنة في متناول يدك
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">ابدأ الآن</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">الخدمات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: 'بطاقة ائتمان', desc: 'بطاقات آمنة وموثوقة' },
              { icon: Wallet, title: 'المحفظة', desc: 'إدارة أموالك بسهولة' },
              { icon: Send, title: 'التحويلات', desc: 'تحويل أموال فوري' },
              { icon: TrendingUp, title: 'الاستثمار', desc: 'استثمر أموالك بذكاء' },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h4 className="font-bold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-foreground mb-8">حسابك البنكي</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-primary text-primary-foreground">
            <p className="text-sm opacity-90 mb-2">الرصيد الحالي</p>
            <p className="text-3xl font-bold">1,250.00 ريال</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">الحد الائتماني</p>
            <p className="text-3xl font-bold text-foreground">5,000.00 ريال</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">آخر معاملة</p>
            <p className="text-3xl font-bold text-foreground">-150.00 ريال</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2026 Bank App. جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </main>
  );
}
