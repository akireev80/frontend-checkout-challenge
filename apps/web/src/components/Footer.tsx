export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-gray-400 text-xs font-medium">
          © 2026 CHECKOUT.SHOP. Все права защищены.
        </div>
        <div className="flex gap-6 text-xs font-bold uppercase tracking-wider text-gray-400">
          <span className="text-gray-300">Контакты</span>
          <span className="text-gray-300">О нас</span>
        </div>
      </div>
    </footer>
  );
}
