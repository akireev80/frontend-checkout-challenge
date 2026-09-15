'use client';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SuccessView() {
  const { currentOrder, reset } = useStore();

  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fPrice = (v: number = 0) =>
    (v / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

  if (!mounted) return null;

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <ShoppingBag className="mx-auto text-gray-300" size={40} />
          <p className="text-gray-600 font-medium">Заказ не найден или уже был сброшен.</p>
          <Link
            href="/"
            className="inline-block bg-[#003366] text-white text-sm font-bold px-6 py-2.5 rounded-xl"
          >
            В каталог
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isCard = useStore.getState().checkoutForm.paymentMethod === 'card';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between antialiased">
      <Header />

      <main className="max-w-md w-full mx-auto px-4 md:px-6 py-12 flex-1 space-y-6">
        <div className="text-center space-y-3 animate-in fade-in">
          <CheckCircle
            size={56}
            className="text-green-500 mx-auto animate-in zoom-in-95 duration-500"
          />
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-wide">
            Заказ успешно оформлен!
          </h1>
          <p className="text-xs text-gray-400">
            Номер документа:{' '}
            <span className="font-mono font-bold text-gray-700">{currentOrder.number}</span>
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="border-b pb-3">
            <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-2">
              Состав заказа
            </h3>
            <div className="space-y-2">
              {currentOrder.items?.map((item: any) => (
                <div key={item.productId} className="flex justify-between text-xs">
                  <span className="text-gray-600 truncate max-w-[70%]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-bold text-gray-900">{fPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b pb-3 text-xs space-y-1.5 text-gray-600">
            <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest mb-2">
              Доставка и статус
            </h3>
            <div className="flex justify-between">
              <span>Способ оплаты:</span>
              <span className="font-bold text-gray-900">
                {isCard ? 'Онлайн-карта' : 'Наличные при получении'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Статус платежа:</span>
              <span
                className={`font-bold ${currentOrder.status === 'paid' || currentOrder.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}
              >
                {currentOrder.status === 'paid'
                  ? 'Оплачено онлайн'
                  : currentOrder.status === 'confirmed'
                    ? 'Подтверждён'
                    : 'Ожидает подтверждения'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Итоговая сумма:
            </span>
            <span className="text-lg font-black text-[#003366]">{fPrice(currentOrder.total)}</span>
          </div>
        </div>

        <button
          onClick={async () => {
            reset();
            router.push('/');
          }}
          className="w-full bg-[#003366] text-white font-bold py-3 rounded-xl hover:bg-[#002855] transition text-sm shadow text-center block"
        >
          Вернуться за покупками
        </button>
      </main>

      <Footer />
    </div>
  );
}
