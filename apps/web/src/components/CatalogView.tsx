'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface CatalogViewProps {
  initialProducts: any[];
}

export default function CatalogView({ initialProducts }: CatalogViewProps) {
  const { init, products, cart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    init();
    setMounted(true);
  }, []);

  const displayProducts = products.length > 0 ? products : initialProducts;
  const activeCart = mounted ? cart : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between antialiased">
      <Header />

      <main className="w-full py-6 flex-1 space-y-4">
        <div className="px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest text-[14px]">
              Каталог товаров
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-100">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {activeCart && activeCart.items?.length > 0 && (
          <div className="px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex justify-end pt-4 animate-in fade-in">
              <Link
                href="/cart"
                className="bg-[#003366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#002855] text-sm shadow-md transition-all"
              >
                Перейти в корзину ({activeCart.quantity})
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
