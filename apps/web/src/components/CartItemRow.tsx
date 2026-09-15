'use client';
import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemRowProps {
  item: any;
  product: any;
}

export default function CartItemRow({ item, product }: CartItemRowProps) {
  const { updateCart, loading } = useStore();

  const fPrice = (v: number = 0) =>
    (v / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

  return (
    <div className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="max-w-full sm:max-w-[50%]">
        <h3 className="font-bold text-sm text-gray-900 break-words leading-tight">{item.title}</h3>
        <p className="text-xs text-gray-400 mt-1 leading-none">{fPrice(item.unitPrice)} / шт</p>
      </div>

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t border-gray-50 sm:border-none">
        <div className="flex items-center h-8 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
          <button
            onClick={() => updateCart(item.productId, item.quantity - 1)}
            disabled={loading}
            className="flex items-center justify-center h-full px-2.5 hover:bg-gray-200 text-gray-600 transition"
            aria-label="Уменьшить"
          >
            <Minus size={12} />
          </button>

          <span className="w-8 text-center text-xs font-bold text-gray-900 leading-none">
            {item.quantity}
          </span>

          <button
            onClick={() => updateCart(item.productId, item.quantity + 1)}
            disabled={loading || (product && item.quantity >= product.stock)}
            className="flex items-center justify-center h-full px-2.5 hover:bg-gray-200 text-gray-600 transition disabled:opacity-20"
            aria-label="Увеличить"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-gray-900 min-w-20 text-right leading-none">
            {fPrice(item.lineTotal)}
          </span>

          <button
            onClick={() => updateCart(item.productId, 0)}
            disabled={loading}
            className="text-gray-400 hover:text-red-500 p-2 transition-colors disabled:opacity-30 rounded-lg hover:bg-red-50/50"
            aria-label="Удалить позицию"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
