'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartItemRow from '@/components/CartItemRow';

export default function CartView() {
  const { init, cart, productMap } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    init();
    setMounted(true);
  }, []);

  const fPrice = (v: number = 0) =>
    (v / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

  if (!mounted) return null;

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between antialiased">
      <Header />

      <main className="max-w-3xl w-full mx-auto px-4 md:px-6 py-8 flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest text-[14px]">
            Корзина
          </h1>
        </div>

        {!hasItems ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-in fade-in">
            <p className="text-gray-400 text-sm font-medium">Ваша корзина пуста</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Вернитесь в каталог, чтобы добавить интересующие вас товары.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#003366] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#002855] transition-all"
            >
              В каталог
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm divide-y divide-gray-100">
              {cart.items.map((item) => {
                const product = productMap.get(item.productId);
                return <CartItemRow key={item.productId} item={item} product={product} />;
              })}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Итого без доставки:
                </span>
                <p className="text-xl font-black text-[#003366]">{fPrice(cart.subtotal)}</p>
              </div>

              <Link
                href="/checkout"
                className="w-full sm:w-auto bg-[#003366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#002855] text-sm text-center shadow-md transition-all"
              >
                Перейти к оформлению
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
