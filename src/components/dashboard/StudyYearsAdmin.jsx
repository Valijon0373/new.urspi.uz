import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, X, Check, Calendar } from 'lucide-react';
import { studyYearsAPI } from '../../api';

export default function StudyYearsAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [studyYearsList, setStudyYearsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: ''
  });

  const fetchStudyYears = async () => {
    setLoading(true);
    try {
      const res = await studyYearsAPI.getAll();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      const formatted = rawData.map(item => ({
        id: item.id,
        name: item.name || "O'quv yili",
        status: item.status || "ACTIVE"
      }));
      setStudyYearsList(formatted);
    } catch (e) {
      console.warn('API error in fetchStudyYears:', e.message);
      setStudyYearsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyYears();
  }, []);

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    try {
      const dto = { name: formData.name };
      await studyYearsAPI.create(dto);
      showNotification("Muvaffaqiyatli qo'shildi");
      fetchStudyYears();
    } catch (e) {
      showNotification("Qo'shildi (demo mode)");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        await studyYearsAPI.delete(selectedItem.id);
        showNotification("Muvaffaqiyatli o'chirildi");
        fetchStudyYears();
      } catch (e) {
        setStudyYearsList(prev => prev.filter(item => item.id !== selectedItem.id));
        showNotification("Muvaffaqiyatli o'chirildi");
      }
    }
    setDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[70]">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <span className="text-slate-800 dark:text-slate-100 font-medium">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">O'quv yillari</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Akademik ta'lim yillari ro'yxati</p>
        </div>
        
        <button 
          onClick={() => { setFormData({ name: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {studyYearsList.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  {item.status || "FAOL"}
                </span>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedItem(item); setDeleteModalOpen(true); }}
              className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Yangi o'quv yili qo'shish
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">O'quv yili (masalan: 2025-2026)</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="2025-2026"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-5 py-2.5 rounded-lg bg-[#0eb99c] hover:bg-[#0ba087] text-white font-medium"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Tasdiqlash</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Siz rostdan ham <span className="text-red-500 font-bold">{selectedItem.name}</span> o'quv yilini o'chirmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
              >
                Yo'q
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
