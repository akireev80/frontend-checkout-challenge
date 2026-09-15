'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { api } from '@/api/client';

interface SandboxModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SandboxModal({ open, onClose }: SandboxModalProps) {
  const { loading } = useStore();
  const [sandbox, setSandbox] = useState<any>(null);

  useEffect(() => {
    if (open) {
      api.getSandbox().then(setSandbox).catch(console.error);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="relative w-full max-w-xs bg-white p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 space-y-4">
        <h3 className="font-black text-gray-900 text-base">Тестовый эквайринг</h3>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Выберите карту для имитации ответа банка. Настоящие данные вводить запрещено.
        </p>

        <div className="space-y-2">
          {sandbox?.cards?.map((c: any) => (
            <button
              key={c.id}
              disabled={loading}
              onClick={() => {
                useStore.getState().pay(c.scenario);
                onClose();
              }}
              className="w-full text-left border border-gray-100 rounded-xl p-3 hover:border-[#003366] hover:bg-[#003366]/5 disabled:opacity-50 transition text-xs flex justify-between items-center group"
            >
              <div>
                <p className="font-bold text-gray-900">{c.title}</p>
                <p className="text-gray-400 font-mono mt-0.5">{c.maskedNumber}</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Выбрать
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 pt-2 block mx-auto"
        >
          Отмена платежа
        </button>
      </div>
    </div>
  );
}
