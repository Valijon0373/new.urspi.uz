import React from 'react';
import { Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';

export default function DepartmentsAdmin() {
  const mockDepartments = [
    { id: 1, title: "Rus tili va adabiyoti kafedrasi", faculty: "Filologiya fakulteti" },
    { id: 2, title: "O'zbek tili va adabiyoti kafedrasi", faculty: "Filologiya fakulteti" },
    { id: 3, title: "Xorijiy filologiya kafedrasi", faculty: "Filologiya fakulteti" },
    { id: 4, title: "Pedagogika va psixologiya kafedrasi", faculty: "Pedagogika fakulteti" },
    { id: 5, title: "Maktabgacha ta'lim kafedrasi", faculty: "Pedagogika fakulteti" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Kafedralar</h2>
        
        <button className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Kafedra qidirish..." 
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <button className="px-6 h-11 rounded-lg border border-blue-500 text-blue-500 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
          Qidirish
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {mockDepartments.map((dept) => (
          <div key={dept.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{dept.title}</h3>
              <p className="text-sm text-slate-400 mt-1">Fakultet: {dept.faculty}</p>
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
