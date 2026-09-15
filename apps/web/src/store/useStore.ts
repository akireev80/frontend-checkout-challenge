import { create } from 'zustand';
import { api } from '@/api/client';
import * as C from '@checkout/contracts';

interface StoreState {
  token: string | null;
  products: C.Product[];
  productMap: Map<string, C.Product>;
  cart: C.Cart | null;
  quote: C.Quote | null;
  currentOrder: C.Order | null;
  loading: boolean;
  apiError: { message: string; fields?: any[] } | null;
  checkoutForm: {
    name: string;
    email: string;
    phone: string;
    methodId: string;
    address: string;
    paymentMethod: 'card' | 'cash_on_delivery';
  };

  init: () => Promise<void>;
  updateCart: (productId: string, qty: number) => Promise<void>;
  updateForm: (fields: any) => void;
  getQuote: () => Promise<void>;
  placeOrder: () => Promise<void>;
  pay: (scenario: C.Scenario) => Promise<void>;
  reset: () => void;
}

let pollInterval: any = null;

export const useStore = create<StoreState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('session_token') : null,
  products: [],
  productMap: new Map(),
  cart: null,
  quote: null,
  currentOrder: null,
  loading: false,
  apiError: null,
  checkoutForm: {
    name: '',
    email: '',
    phone: '',
    methodId: 'pickup',
    address: 'point-center',
    paymentMethod: 'card',
  },

  init: async () => {
    if (typeof window === 'undefined') return;
    try {
      set({ loading: true, apiError: null });

      const savedForm = localStorage.getItem('checkout_form');
      if (savedForm) set({ checkoutForm: JSON.parse(savedForm) });

      let token = localStorage.getItem('session_token');
      let cart: any = null;
      let order: any = null;
      const savedOrderId = localStorage.getItem('active_order_id');

      if (token) {
        try {
          cart = await api.getCart();
          if (savedOrderId) {
            order = await api.getOrder(savedOrderId);
          }
        } catch (authError: any) {
          if (authError.status === 404 || authError.status === 401) {
            localStorage.removeItem('session_token');
            localStorage.removeItem('active_order_id');
            token = null;
            cart = null;
            order = null;
          }
        }
      }

      if (!token) {
        const res = await api.createSession();
        localStorage.setItem('session_token', res.token);
        token = res.token;
        cart = await api.getCart();
      }
      set({ token });

      const products = await api.getProducts();
      const productMap = new Map(products.map((p) => [p.id, p]));
      set({ products, productMap });

      if (order && cart) {
        if (order.status === 'awaiting_payment' && cart.items.length === 0) {
          for (const item of order.items) {
            await api.setCartItem(item.productId, item.quantity);
          }

          localStorage.removeItem('active_order_id');
          localStorage.removeItem('idemp_order_key');
          localStorage.removeItem('idemp_pay_key');

          const freshCart = await api.getCart();
          set({ currentOrder: null, quote: null, cart: freshCart });
          return;
        } else {
          set({ currentOrder: order });
          if (
            ['awaiting_payment', 'pending', 'processing'].includes(order.status) ||
            order.paymentStatus === 'pending'
          ) {
            get().pay((localStorage.getItem('last_scenario') as C.Scenario) || 'success');
          }
        }
      }
      set({ cart });
    } catch (err: any) {
      set({ apiError: { message: err.message, fields: err.fields } });
    } finally {
      set({ loading: false });
    }
  },

  updateCart: async (productId, qty) => {
    try {
      set({ apiError: null });
      if (qty <= 0) await api.deleteCartItem(productId);
      else await api.setCartItem(productId, qty);
      const cart = await api.getCart();
      set({ cart, quote: null });
    } catch (err: any) {
      set({ apiError: { message: err.message } });
    }
  },

  updateForm: (fields) => {
    const updated = { ...get().checkoutForm, ...fields };
    localStorage.setItem('checkout_form', JSON.stringify(updated));

    if (fields.methodId || fields.address !== undefined) {
      set({ checkoutForm: updated, quote: null });
    } else {
      set({ checkoutForm: updated });
    }
  },

  getQuote: async () => {
    const { cart, checkoutForm } = get();
    if (!cart) return;
    try {
      set({ loading: true, apiError: null });

      let deliveryData: any;

      if (checkoutForm.methodId === 'pickup') {
        deliveryData = {
          method: 'pickup',
          pickupPointId: checkoutForm.address || 'point-center',
        };
      } else {
        const parts = checkoutForm.address.split(',').map((p: string) => p.trim());

        deliveryData = {
          method: 'courier',
          address: {
            city: parts[0] || 'г. Учебный',
            street: parts[1] || 'ул. Примерная',
            house: parts[2] || '1',
            apartment: parts[3] || undefined,
          },
        };
      }

      const quote = await api.createQuote(cart.version, deliveryData);
      set({ quote });
    } catch (err: any) {
      set({ apiError: { message: err.message, fields: err.fields } });
    } finally {
      set({ loading: false });
    }
  },

  placeOrder: async () => {
    const { quote, checkoutForm } = get();
    if (!quote) return;

    let key = localStorage.getItem('idemp_order_key') || crypto.randomUUID();
    localStorage.setItem('idemp_order_key', key);

    try {
      set({ loading: true, apiError: null });
      const order = await api.createOrder(
        {
          quoteId: quote.id,
          paymentMethod: checkoutForm.paymentMethod,
          customer: {
            name: checkoutForm.name,
            email: checkoutForm.email,
            phone: checkoutForm.phone,
          },
        },
        key,
      );

      localStorage.setItem('active_order_id', order.id);
      set({ currentOrder: order });

      if (checkoutForm.paymentMethod === 'cash_on_delivery') {
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(async () => {
          const u = await api.getOrder(order.id);
          set({ currentOrder: u });
          if (u.status === 'confirmed') clearInterval(pollInterval);
        }, 1000);
      }
    } catch (err: any) {
      set({ apiError: { message: err.message, fields: err.fields } });
    } finally {
      set({ loading: false });
    }
  },

  pay: async (scenario) => {
    const { currentOrder } = get();
    if (!currentOrder) return;

    localStorage.setItem('last_scenario', scenario);
    const payKey = crypto.randomUUID();

    try {
      set({ loading: true, apiError: null });

      const payment = await api.createPayment(currentOrder.id, payKey);
      await api.simulatePayment(payment.id, scenario);

      if (pollInterval) clearInterval(pollInterval);

      pollInterval = setInterval(async () => {
        const u = await api.getOrder(currentOrder.id);

        if (localStorage.getItem('active_order_id') !== currentOrder.id) {
          clearInterval(pollInterval);
          set({ loading: false });
          return;
        }

        set({ currentOrder: u });

        if (['paid', 'confirmed'].includes(u.status)) {
          clearInterval(pollInterval);
          localStorage.removeItem('last_scenario');
          set({ loading: false });
        }

        if (u.paymentStatus === 'failed') {
          clearInterval(pollInterval);
          localStorage.removeItem('last_scenario');
          set({
            loading: false,
            apiError: {
              message:
                'Платеж отклонен банком. Пожалуйста, проверьте баланс или выберите другую карту.',
            },
          });
        }
      }, 1000);
    } catch (err: any) {
      set({ loading: false, apiError: { message: err.message } });
    }
  },

  reset: async () => {
    if (pollInterval) clearInterval(pollInterval);

    localStorage.removeItem('idemp_order_key');
    localStorage.removeItem('idemp_pay_key');
    localStorage.removeItem('active_order_id');
    localStorage.removeItem('last_scenario');

    set({ currentOrder: null, quote: null, cart: null });

    await get().init();
  },
}));
