'use client';
import { useStore } from '@/store/useStore';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, updateCart, loading } = useStore();

  const fPrice = (v: number = 0) =>
    (v / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

  const inCart = cart?.items?.find((i: any) => i.productId === product.id)?.quantity || 0;

  const imageMap: Record<string, string> = {
    'lamp-orbit': '/lamp.webp',
    'mug-line': '/mug.webp',
    'bag-day': '/bag.webp',
    'clock-dot': '/watch.webp',
  };

  const productImg = imageMap[product.id] || null;

  return (
    <article className="group bg-white border border-gray-100 flex flex-col relative transition-all duration-300 hover:border-gray-300 overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-100">
        {productImg ? (
          <img
            src={productImg}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#003366]">
            <ShoppingCart
              size={28}
              strokeWidth={1.5}
              className="bg-[#003366]/5 p-4 rounded-full w-16 h-16"
            />
          </div>
        )}

        <div className="absolute bottom-2 left-2 z-10 text-[10px] bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded font-bold text-gray-500 border border-gray-100">
          Остаток: {product.stock} шт
        </div>
      </div>

      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-[#003366] transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 grow leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-0 pt-2 border-t border-gray-50">
          <span className="text-sm sm:text-lg font-black text-[#003366] leading-none">
            {fPrice(product.price)}
          </span>

          {product.stock <= 0 ? (
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1.5 rounded-xl font-bold leading-none">
              Закончился
            </span>
          ) : inCart > 0 ? (
            <div className="flex items-center h-8 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
              <button
                onClick={() => updateCart(product.id, inCart - 1)}
                disabled={loading}
                className="flex items-center justify-center h-full px-2.5 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Уменьшить"
              >
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-xs font-bold text-gray-900 leading-none">
                {inCart}
              </span>
              <button
                onClick={() => updateCart(product.id, inCart + 1)}
                disabled={loading || inCart >= product.stock}
                className="flex items-center justify-center h-full px-2.5 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-20"
                aria-label="Увеличить"
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => updateCart(product.id, 1)}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center bg-[#003366] text-white hover:bg-amber-500 rounded-lg transition-colors shadow-sm"
              title="Добавить в корзину"
            >
              <ShoppingCart size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
