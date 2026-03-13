'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, Wallet, Send, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-blue-800/50 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">البنك</h1>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">تسجيل الدخول</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">أهلاً بك في تطبيق البنك</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            خدمات مصرفية حديثة وآمنة في متناول يدك. تحويلات فورية، إدارة الأموال بسهولة، وأمان عالي الجودة.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                ابدأ الآن
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
                إنشاء حساب جديد
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 backdrop-blur border-y border-blue-800/50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">خدماتنا</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CreditCard, title: 'بطاقة ائتمان', desc: 'بطاقات آمنة وموثوقة' },
              { icon: Wallet, title: 'المحفظة', desc: 'إدارة أموالك بسهولة' },
              { icon: Send, title: 'التحويلات', desc: 'تحويل أموال فوري' },
              { icon: TrendingUp, title: 'الاستثمار', desc: 'استثمر أموالك بذكاء' },
            ].map((feature, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow bg-slate-700/50 border-blue-800/50">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-blue-200">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white mb-12 text-center">لماذا تختارنا؟</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-800/50 border border-blue-800/50 rounded-lg hover:border-blue-600 transition">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">أمان عالي</h4>
            <p className="text-blue-200">تشفير من الدرجة الأولى وحماية كاملة لأموالك</p>
          </div>
          <div className="p-6 bg-slate-800/50 border border-blue-800/50 rounded-lg hover:border-blue-600 transition">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">سهولة الاستخدام</h4>
            <p className="text-blue-200">واجهة بسيطة وسهلة الاستخدام للجميع</p>
          </div>
          <div className="p-6 bg-slate-800/50 border border-blue-800/50 rounded-lg hover:border-blue-600 transition">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">تحويلات فورية</h4>
            <p className="text-blue-200">تحويل الأموال بسرعة وأمان في أي وقت</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">انضم إلينا الآن</h3>
          <p className="text-blue-100 mb-6">ابدأ رحلتك المصرفية مع أفضل تطبيق بنكي</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              إنشاء حساب مجاني
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-800/50 bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-blue-300 text-sm">
            © 2026 Bank App. جميع الحقوق محفوظة
          </p>
          <p className="text-center text-blue-400 text-xs mt-2">
            حسابات تجريبية: customer@bank.com / admin@bank.com (كلمة المرور: password)
          </p>
        </div>
      </footer>
    </main>
  );
}
