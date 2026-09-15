'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold min-w-4 h-4 flex items-center justify-center rounded-full px-1 border border-[#003366] animate-in zoom-in duration-200">
      {count > 99 ? '99+' : count}
    </div>
  );
}

export default function Header() {
  const { cart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinkStyle =
    'flex flex-col items-center text-white hover:text-amber-400 transition-all group cursor-pointer relative';
  const labelStyle = 'text-[10px] font-medium uppercase tracking-wider mt-1 hidden sm:block';

  const totalQuantity = mounted ? cart?.quantity || 0 : 0;

  return (
    <header className="sticky top-0 z-40 shadow-lg bg-[#003366]">
      <div className="border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-white font-black text-xl tracking-tight">
              CHECKOUT<span className="text-amber-400">.SHOP</span>
            </Link>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/cart" className={navLinkStyle}>
              <div className="relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                <Badge count={totalQuantity} />
              </div>
              <span className={labelStyle}>Корзина</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
