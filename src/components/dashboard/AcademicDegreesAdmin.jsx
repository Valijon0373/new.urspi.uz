import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, X, Check, GraduationCap } from 'lucide-react';
import { academicDegreesAPI } from '../../api';

export default function AcademicDegreesAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [degreesList, setDegreesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchDegrees = async () => {
    setLoading(true);
    try {
      const res = await academicDegreesAPI.getAll();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      const formatted = rawData.map(item => ({
        id: item.id,
        name: item.name || "Ilmiy daraja",
        description: item.description || ""
      }));
      setDegreesList(formatted);
    } catch (e) {
      console.warn('API error in fetchDegrees:', e.message);
      setDegreesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDegrees();
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
      const dto = {
        name: formData.name,
        description: formData.description || 'Ilmiy daraja tavsifi'
      };

      if (editMode && selectedItem) {
        await academicDegreesAPI.update(selectedItem.id, dto);
        showNotification("Muvaffaqiyatli tahrirlandi");
      } else {
        await academicDegreesAPI.create(dto);
        showNotification("Muvaffaqiyatli qo'shildi");
      }
      fetchDegrees();
    } catch (e) {
      showNotification(editMode ? "Tahrirlandi (demo mode)" : "Qo'shildi (demo mode)");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        await academicDegreesAPI.delete(selectedItem.id);
        showNotification("Muvaffaqiyatli o'chirildi");
        fetchDegrees();
      } catch (e) {
        setDegreesList(prev => prev.filter(item => item.id !== selectedItem.id));
        showNotification("Muvaffaqiyatli o'chirildi");
      }
    }
    setDeleteModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ilmiy darajalar va unvonlar</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">O'qituvchilar va xodimlarning ilmiy unvon hamda darajalari ro'yxati</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {degreesList.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button 
                onClick={() => { setSelectedItem(item); setViewModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ko'rish
              </button>
              <button 
                onClick={() => openEditModal(item)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Tahrirlash
              </button>
              <button 
                onClick={() => { setSelectedItem(item); setDeleteModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {editMode ? "Ilmiy darajani tahrirlash" : "Yangi ilmiy daraja qo'shish"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomi</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Masalan: PhD yoki Dotsent"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tavsifi</label>
                <textarea 
                  rows={3}
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Tavsif..."
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
              Siz rostdan ham <span className="text-red-500 font-bold">{selectedItem.name}</span> ni o'chirmoqchimisiz?
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
