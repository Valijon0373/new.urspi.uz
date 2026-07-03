import React, { useState } from 'react';
import { Plus, Search, Calendar, X, Image as ImageIcon } from 'lucide-react';

export default function NewsAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageIds, setImageIds] = useState([1]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Yangiliklar</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Platformadagi barcha yangiliklarni boshqarish
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Qo'shish</span>
        </button>
      </div>

      {/* Filters section */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Qidirish..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
            />
          </div>
          <button className="px-4 py-2 border-2 border-[#0eb99c] text-[#0eb99c] hover:bg-[#0eb99c] hover:text-white rounded-xl font-medium transition-colors shrink-0">
            Izlash
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-slate-500 dark:text-slate-400">Dan:</span>
            <input
              type="date"
              className="block w-full sm:w-auto px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-slate-500 dark:text-slate-400">Gacha:</span>
            <input
              type="date"
              className="block w-full sm:w-auto px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Empty State / Content area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha yangiliklar yo'q</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi yangilik qo'shish uchun yuqoridagi "Qo'shish" tugmasini bosing.</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">Yangi yangilik qo'shish</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Sarlavha */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Sarlavha
                </label>
                <input
                  type="text"
                  placeholder="Yangilik sarlavhasini kiriting"
                  className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors"
                />
              </div>

              {/* Izoh */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Izoh
                </label>
                <textarea
                  rows="4"
                  placeholder="Yangilik matnini kiriting"
                  className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors resize-none"
                />
              </div>

              {/* Rasm yuklash */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Rasm yuklash (maksimal 5 ta)
                </label>

                <div className="space-y-4">
                  {imageIds.map((id, index) => {
                    const isLast = index === imageIds.length - 1;
                    return (
                      <div key={id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Upload box */}
                        <div className="flex-1 w-full flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-500" aria-hidden="true" />
                            <div className="mt-2 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                              <label
                                className="relative cursor-pointer rounded-md font-semibold text-[#0eb99c] hover:text-[#0ca389] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0eb99c]"
                              >
                                <span>{index === 0 ? "Asosiy rasm yuklash" : `${index + 1}-rasm yuklash`}</span>
                                <input type="file" className="sr-only" accept="image/*" />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 shrink-0 sm:w-[100px] w-full items-start">
                          {isLast && imageIds.length < 5 && (
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                id={`extra-image-${id}`}
                                checked={false}
                                onChange={() => setImageIds(prev => [...prev, Date.now()])}
                                className="w-4 h-4 text-[#0eb99c] rounded focus:ring-[#0eb99c] border-slate-300 dark:border-slate-600 cursor-pointer"
                              />
                              <label htmlFor={`extra-image-${id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                yana
                              </label>
                            </div>
                          )}

                          {isLast && index > 0 && (
                            <button 
                              type="button"
                              onClick={() => setImageIds(prev => prev.filter(imgId => imgId !== id))}
                              className="text-sm font-medium text-red-500 hover:text-red-600 text-left flex items-center gap-1 transition-colors whitespace-nowrap"
                            >
                              <X className="w-4 h-4" />
                              Tashlash
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Xizmat matni */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Muallif
                </label>
                <input
                  type="text"
                  defaultValue="©️ UrDPI matbuot xizmati"
                  className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
              >
                Bekor qilish
              </button>
              <button
                className="px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
