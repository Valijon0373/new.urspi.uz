import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, X, Check } from 'lucide-react';
import { positionsAPI } from '../../api';

export default function PositionsAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [positionsList, setPositionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    title: { uz: '', ru: '', en: '' }
  });

  const defaultTranslations = {
    "katta o'qituvchi": { ru: "Старший преподаватель", en: "Senior Teacher" },
    "katta oqituvchi": { ru: "Старший преподаватель", en: "Senior Teacher" },
    "kafedra mudiri": { ru: "Заведующий кафедрой", en: "Head of Department" },
    "kafedra mudri": { ru: "Заведующий кафедрой", en: "Head of Department" },
    "dekan": { ru: "Декан", en: "Dean" },
    "o'quv ishlari bo'yicha dekan o'rinbosari": { ru: "Заместитель декана по учебной работе", en: "Deputy Dean for Academic Affairs" },
    "yoshlar masalalari va ma'naviyat bo'yicha dekan o'rinbosari": { ru: "Заместитель декана по работе с молодежью", en: "Deputy Dean for Youth Affairs" },
    "dotsent": { ru: "Доцент", en: "Associate Professor" },
    "professor": { ru: "Профессор", en: "Professor" },
    "assistent": { ru: "Ассистент", en: "Assistant" },
  };

  const fetchPositions = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await positionsAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || []);
    } catch (e) {
      console.warn('API error in fetchPositions:', e.message);
    }

    const norm = (s) => (s || '').toLowerCase().trim().replace(/[''`ʼ‘’]/g, "'");

    const formatted = apiData.map(item => {
      const uz = item.nameUz || item.titleUz || item.name || item.title || "Lavozim";
      const key = norm(uz);
      const def = defaultTranslations[key] || {};

      const ru = item.nameRu || item.titleRu || def.ru || '';
      const en = item.nameEn || item.titleEn || def.en || '';

      return {
        id: item.id,
        title: uz,
        titleUz: uz,
        titleRu: ru,
        titleEn: en,
        description: item.description || "",
        rawItem: { ...item, nameUz: uz, titleUz: uz, nameRu: ru, titleRu: ru, nameEn: en, titleEn: en }
      };
    });
    setPositionsList(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  const handleSave = async () => {
    try {
      const nameUz = formData.title.uz?.trim();
      const nameRu = formData.title.ru?.trim() || '';
      const nameEn = formData.title.en?.trim() || '';
      if (!nameUz) {
        showNotification("Iltimos, lavozim nomini o'zbek tilida kiriting");
        return;
      }
      const dto = {
        name: nameUz,
        nameUz,
        nameRu,
        nameEn,
        titleUz: nameUz,
        titleRu: nameRu,
        titleEn: nameEn,
        description: 'Lavozim tavsifi'
      };

      if (editMode && selectedItem) {
        await positionsAPI.update(selectedItem.id, dto);
      } else {
        await positionsAPI.create(dto);
      }

      showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      fetchPositions();
    } catch (e) {
      showNotification("Xatolik yuz berdi");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        await positionsAPI.delete(selectedItem.id);
        showNotification("Muvaffaqiyatli o'chirildi");
        fetchPositions();
      } catch (e) {
        showNotification("O'chirishda xatolik yuz berdi");
      }
    }
    setDeleteModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormData({
      title: {
        uz: item.titleUz || item.title || '',
        ru: item.titleRu || '',
        en: item.titleEn || ''
      }
    });
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      title: { uz: '', ru: '', en: '' }
    });
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lavozim</h2>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {positionsList.map((pos) => (
          <div key={pos.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{pos.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {pos.titleRu || pos.titleEn ? `${pos.titleRu || '—'} / ${pos.titleEn || '—'}` : `ID: ${pos.id}`}
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button 
                onClick={() => { setSelectedItem(pos); setViewModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ko'rish
              </button>
              <button 
                onClick={() => openEditModal(pos)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Tahrirlash
              </button>
              <button 
                onClick={() => { setSelectedItem(pos); setDeleteModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 md:p-8 text-center">
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{selectedItem.title}</h2>
            <p className="text-slate-500 dark:text-slate-400">Lavozim ID: {selectedItem.id}</p>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setDeleteModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mt-2">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Tasdiqlash</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Siz rostdan ham <span className="text-red-500 font-bold">{selectedItem.title}</span> ni o'chirmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
              >
                Yo'q
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? "Lavozimni tahrirlash" : "Lavozim qo'shish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Language Tabs */}
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
                {[
                  { id: 'uz', label: "O'zbekcha" },
                  { id: 'ru', label: 'Русский' },
                  { id: 'en', label: 'English' }
                ].map(lang => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setActiveLang(lang.id)}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                      activeLang === lang.id
                        ? 'border-[#0eb99c] text-[#0eb99c]'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {(() => {
                const text = {
                  uz: { titleLabel: "Lavozim nomi", titlePl: "Lavozim nomini kiriting" },
                  ru: { titleLabel: "Название должности", titlePl: "Введите название должности" },
                  en: { titleLabel: "Position name", titlePl: "Enter position name" }
                }[activeLang];

                return (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      {text.titleLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.title[activeLang]}
                      onChange={e => setFormData({ ...formData, title: { ...formData.title, [activeLang]: e.target.value } })}
                      placeholder={text.titlePl}
                      className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors"
                    />
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-xl transition-colors shadow-sm"
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
