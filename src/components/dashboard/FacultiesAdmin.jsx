import React from 'react';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';

export default function FacultiesAdmin() {
  const mockFaculties = [
    { id: 1, title: "Filologiya fakulteti" },
    { id: 2, title: "Pedagogika fakulteti" },
    { id: 3, title: "Boshlang'ich ta'lim fakulteti" },
    { id: 4, title: "Aniq va tabiiy fanlar fakulteti" },
    { id: 5, title: "Ijtimoiy va amaliy fanlar fakulteti" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Fakultetlar</h2>
        
        <button className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {mockFaculties.map((fac) => (
          <div key={fac.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{fac.title}</h3>
            </div>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Eye className="w-4 h-4" />
                Ko'rish
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                <Edit2 className="w-4 h-4" />
                Tahrirlash
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4" />
                O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
