'use client';
import { useStore } from '@/store/useStore';

export default function CheckoutFormFields() {
  const { cart, checkoutForm, updateForm, getQuote, quote, placeOrder, loading, apiError } =
    useStore();

  const fPrice = (v: number = 0) =>
    (v / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

  const getFieldError = (path: string) => {
    const err = apiError?.fields?.find((f: any) => f.path.includes(path));
    if (!err) return undefined;

    if (path === 'customer/phone' && err.message.includes('must match pattern')) {
      return 'Формат телефона: +79990000000 (от 10 до 15 цифр, начиная с +)';
    }

    if (path === 'delivery/address' && err.message.includes('fewer than 2 characters')) {
      return 'Адрес слишком короткий. Пожалуйста, введите корректные данные.';
    }

    return err.message;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        quote ? placeOrder() : getQuote();
      }}
      className="space-y-4"
    >
      <div className="space-y-3">
        <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b pb-1">
          Получатель
        </h3>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1" htmlFor="name">
            ФИО получателя
          </label>
          <input
            required
            id="name"
            type="text"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={checkoutForm.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
          {getFieldError('customer/name') && (
            <p className="text-xs text-red-500 mt-1">{getFieldError('customer/name')}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1" htmlFor="email">
              Email
            </label>
            <input
              required
              id="email"
              type="email"
              placeholder="buyer@example.test"
              className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={checkoutForm.email}
              onChange={(e) => updateForm({ email: e.target.value })}
            />
            {getFieldError('customer/email') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('customer/email')}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1" htmlFor="phone">
              Телефон
            </label>
            <input
              required
              id="phone"
              type="tel"
              placeholder="+79990000000"
              className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={checkoutForm.phone}
              onChange={(e) => updateForm({ phone: e.target.value })}
            />
            {getFieldError('customer/phone') && (
              <p className="text-xs text-red-500 mt-1 font-semibold">
                {getFieldError('customer/phone')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b pb-1">
          Доставка
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`border rounded-xl py-2.5 text-xs font-bold transition ${checkoutForm.methodId === 'pickup' ? 'border-[#003366] bg-[#003366]/5 text-[#003366]' : 'border-gray-200'}`}
            onClick={() => updateForm({ methodId: 'pickup', address: 'point-center' })}
          >
            Самовывоз
          </button>
          <button
            type="button"
            className={`border rounded-xl py-2.5 text-xs font-bold transition ${checkoutForm.methodId === 'courier' ? 'border-[#003366] bg-[#003366]/5 text-[#003366]' : 'border-gray-200'}`}
            onClick={() => updateForm({ methodId: 'courier', address: '' })}
          >
            Курьер
          </button>
        </div>
      </div>

      {checkoutForm.methodId === 'pickup' ? (
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1" htmlFor="pt">
            Пункт самовывоза
          </label>
          <select
            id="pt"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white outline-none focus:ring-1 focus:ring-blue-500"
            value={checkoutForm.address}
            onChange={(e) => updateForm({ address: e.target.value })}
          >
            <option value="point-center">Центральный пункт (ул. Примерная, 1)</option>
            <option value="point-north">Северный пункт (ул. Макетная, 7)</option>
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1" htmlFor="addr">
            Адрес курьерской доставки
          </label>
          <input
            required
            id="addr"
            type="text"
            placeholder="Город, Улица, Дом, Квартира"
            className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={checkoutForm.address}
            onChange={(e) => updateForm({ address: e.target.value })}
          />
          {getFieldError('delivery/address') && (
            <p className="text-xs text-red-500 mt-1 font-semibold animate-in fade-in">
              {getFieldError('delivery/address')}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b pb-1">
          Способ оплаты
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`border rounded-xl py-2.5 text-xs font-bold transition ${checkoutForm.paymentMethod === 'card' ? 'border-[#003366] bg-[#003366]/5 text-[#003366]' : 'border-gray-200'}`}
            onClick={() => updateForm({ paymentMethod: 'card' })}
          >
            Картой онлайн
          </button>
          <button
            type="button"
            className={`border rounded-xl py-2.5 text-xs font-bold transition ${checkoutForm.paymentMethod === 'cash_on_delivery' ? 'border-[#003366] bg-[#003366]/5 text-[#003366]' : 'border-gray-200'}`}
            onClick={() => updateForm({ paymentMethod: 'cash_on_delivery' })}
          >
            При получении
          </button>
        </div>
      </div>

      {quote && cart && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs space-y-1.5 text-gray-600 animate-in fade-in">
          <div className="flex justify-between">
            <span>Стоимость товаров:</span>
            <span className="font-bold text-gray-900">{fPrice(quote.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Транспортировка:</span>
            <span className="font-bold text-gray-900">{fPrice(quote.shipping)}</span>
          </div>
          <div className="flex justify-between font-black text-sm pt-2 border-t text-gray-900">
            <span>Итого к оплате:</span>
            <span>{fPrice(quote.total)}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#003366] text-white font-bold py-3 rounded-xl hover:bg-[#002855] disabled:bg-gray-300 transition text-sm shadow"
      >
        {quote ? 'Оформить заказ' : 'Рассчитать стоимость'}
      </button>
    </form>
  );
}
