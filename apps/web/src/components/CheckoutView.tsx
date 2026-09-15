'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutFormFields from '@/components/CheckoutFormFields';
import SandboxModal from '@/components/SandboxModal';

export default function CheckoutView() {
  const { init, cart, currentOrder, apiError, loading } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (currentOrder && ['paid', 'confirmed'].includes(currentOrder.status)) {
      router.push('/success');
    }
  }, [currentOrder?.status, router]);

  useEffect(() => {
    init();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!cart?.items?.length && !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <AlertTriangle className="mx-auto text-amber-500" size={40} />
          <p className="text-gray-600 font-medium">
            Для оформления заказа добавьте товары в корзину.
          </p>
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

  const isCardPayment = useStore.getState().checkoutForm.paymentMethod === 'card';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between antialiased">
      <Header />

      <main className="max-w-xl w-full mx-auto px-4 md:px-6 py-8 flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/cart" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black uppercase text-[14px] text-gray-900 tracking-widest">
            Оформление заказа
          </h1>
        </div>

        {apiError && !apiError.fields && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm"
            role="alert"
          >
            <AlertTriangle className="flex-shrink-0" />
            <span>{apiError.message}</span>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
          {!currentOrder ? (
            <CheckoutFormFields />
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className="text-xs text-amber-700 font-bold bg-amber-50 py-2.5 px-3 rounded-xl border border-amber-100 flex items-center justify-center gap-1.5 animate-pulse">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Заказ #{currentOrder.number} сформирован</span>
              </div>

              {isCardPayment ? (
                loading || ['paid', 'confirmed'].includes(currentOrder?.status) ? (
                  <div
                    className="flex flex-col items-center justify-center gap-2 py-2 animate-in fade-in"
                    role="status"
                  >
                    <div className="w-6 h-6 border-2 border-[#003366] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                      Обработка транзакции, пожалуйста, подождите...
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setModal(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-sm flex items-center justify-center gap-2 shadow active:scale-[0.99]"
                  >
                    <span>Перейти к онлайн-оплате</span>
                  </button>
                )
              ) : (
                <p className="text-xs text-gray-400 animate-pulse font-medium">
                  Ожидание автоматического подтверждения заказа...
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <SandboxModal open={modal} onClose={() => setModal(false)} />

      <Footer />
    </div>
  );
}
