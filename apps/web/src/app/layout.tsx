import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  title: 'Тестовый Магазин',
  description: 'Интерфейс оформления заказа',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-50 min-h-screen text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
