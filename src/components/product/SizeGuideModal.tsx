"use client";

import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizeTable = [
    { size: "XS", height: "165–172", chest: "84–90", waist: "68–74", shoulders: "42–44", hips: "88–94" },
    { size: "S", height: "170–176", chest: "90–96", waist: "74–80", shoulders: "44–46", hips: "94–100" },
    { size: "M", height: "175–182", chest: "96–104", waist: "80–88", shoulders: "46–48", hips: "100–106" },
    { size: "L", height: "180–188", chest: "104–112", waist: "88–96", shoulders: "48–50", hips: "106–112" },
    { size: "XL", height: "185–192", chest: "112–120", waist: "96–104", shoulders: "50–52", hips: "112–118" },
    { size: "XXL", height: "188–196", chest: "120–128", waist: "104–112", shoulders: "52–54", hips: "118–124" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-900 transition-colors p-1"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-2">
          <Ruler className="w-4 h-4" />
          <span>Гид по размерам</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-900 mb-2">
          Европейская размерная сетка (EU)
        </h2>

        <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-light">
          Все изделия бренда QARA BALA скроены в соответствии с европейскими стандартами.
          Для оверсайз моделей мы рекомендуем выбирать ваш привычный размер, чтобы сохранить авторский силуэт.
        </p>

        {/* Table */}
        <div className="overflow-x-auto border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white uppercase text-[10px] tracking-[0.15em]">
              <tr>
                <th className="py-3 px-4 font-semibold">Размер</th>
                <th className="py-3 px-4 font-semibold">Рост (см)</th>
                <th className="py-3 px-4 font-semibold">Грудь (см)</th>
                <th className="py-3 px-4 font-semibold">Талия (см)</th>
                <th className="py-3 px-4 font-semibold">Плечи (см)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-700">
              {sizeTable.map((row) => (
                <tr key={row.size} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-950">{row.size}</td>
                  <td className="py-3 px-4">{row.height}</td>
                  <td className="py-3 px-4">{row.chest}</td>
                  <td className="py-3 px-4">{row.waist}</td>
                  <td className="py-3 px-4">{row.shoulders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="mt-6 border-t border-neutral-100 pt-6 space-y-3 text-xs text-neutral-500">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-900">
            Как правильно снять мерки:
          </h4>
          <ul className="list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
            <li>
              <strong className="text-neutral-800">Обхват груди:</strong> измеряется по наиболее выступающим точкам груди горизонтально вокруг тела.
            </li>
            <li>
              <strong className="text-neutral-800">Обхват талии:</strong> измеряется строго по естественной линии талии в самом узком месте.
            </li>
            <li>
              <strong className="text-neutral-800">Ширина плеч:</strong> расстояние от крайней точки левого плечевого шва до правого по спине.
            </li>
          </ul>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-950 text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
