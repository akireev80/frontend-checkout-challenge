import * as C from '@checkout/contracts';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: any[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('session_token') : null;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (response.status === 204) return {} as T;

  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(
      response.status,
      json.error?.code || 'UNKNOWN_ERROR',
      json.error?.message || 'Ошибка выполнения запроса',
      json.error?.fields,
    );
  }
  return json.data;
}

export const api = {
  createSession: () =>
    request<{ token: string }>('/api/sessions', { method: 'POST', body: JSON.stringify({}) }),
  getProducts: () => request<C.Product[]>('/api/products'),
  getSandbox: () => request<{ cards: any[] }>('/api/sandbox'),
  getCart: () => request<C.Cart>('/api/cart'),
  setCartItem: (productId: string, quantity: number) =>
    request<C.Cart>([`/api/cart/items/${productId}`].join(''), {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  deleteCartItem: (productId: string) =>
    request<void>([`/api/cart/items/${productId}`].join(''), { method: 'DELETE' }),
  createQuote: (cartVersion: number, delivery: any) =>
    request<C.Quote>('/api/quotes', {
      method: 'POST',
      body: JSON.stringify({ cartVersion, delivery }),
    }),
  createOrder: (body: C.CreateOrder, idempotencyKey: string) =>
    request<C.Order>('/api/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(body),
    }),
  getOrder: (orderId: string) => request<C.Order>([`/api/orders/${orderId}`].join('')),
  createPayment: (orderId: string, idempotencyKey: string) =>
    request<C.Payment>([`/api/orders/${orderId}/payments`].join(''), {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({}),
    }),
  simulatePayment: (paymentId: string, scenario: C.Scenario) =>
    request<C.Simulation>([`/api/payments/${paymentId}/simulations`].join(''), {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    }),
};
