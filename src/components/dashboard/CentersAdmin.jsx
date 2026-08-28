import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, Search, X, Check, Phone, Mail, Clock, User, Building } from 'lucide-react';
import { getStoredCenters, saveStoredCenters, renderCenterIcon, getAutoIcon } from '../../data/centersData';
import { centersAPI } from '../../api';

const AVAILABLE_ICONS = [
  { name: 'Monitor', label: "Kompyuter (Axborot texnologiyalari / AT)" },
  { name: 'Cpu', label: "Protsessor (Texnik vositalar)" },
  { name: 'BookOpen', label: "Kitob (Ta'lim)" },
  { name: 'GraduationCap', label: "Shapka (Ilm-fan)" },
  { name: 'Library', label: "Kutubxona (O'quv-uslubiy)" },
  { name: 'Users', label: "Odamlar (Murojaatlar)" },
  { name: 'Award', label: "Mukofot (Magistratura)" },
  { name: 'Heart', label: "Yurak (Xotin-qizlar)" },
  { name: 'Sparkles', label: "Yulduzchalar (Yoshlar/Ma'naviyat)" },
  { name: 'Star', label: "Yulduz (Iqtidorli talabalar)" },
  { name: 'Scale', label: "Tarozi (Yurist/Huquq)" },
  { name: 'Globe', label: "Globus (Xalqaro aloqalar)" },
  { name: 'Shield', label: "Qalqon (Kasaba uyushmasi)" },
  { name: 'Calculator', label: "Kalkulyator (Buxgalteriya/Moliya)" },
  { name: 'FileText', label: "Hujjat (Axborot resurs)" },
  { name: 'Landmark', label: "Bino (Kengash)" },
  { name: 'ShieldCheck', label: "Himoya qalqoni (Komplayens-nazorat)" },
  { name: 'TrendingUp', label: "O'sish grafikasi (Marketing)" },
  { name: 'UserCheck', label: "Foydalanuvchi (Xodimlarga xizmat)" },
  { name: 'Briefcase', label: "Portfel (Registrator ofisi)" }
];

export default function CentersAdmin() {
  const [centers, setCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    id: null,
    title: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' },
    headName: '',
    phone: '',
    email: '',
    receptionHours: '',
    iconName: 'Monitor',
    borderColor: 'border-t-blue-500',
    iconBg: 'bg-blue-50'
  });

  useEffect(() => {
    loadCenters();
    const handleUpdate = () => loadCenters();
    window.addEventListener('urspi_centers_updated', handleUpdate);
    return () => window.removeEventListener('urspi_centers_updated', handleUpdate);
  }, []);

  const loadCenters = async () => {
    try {
      const res = await centersAPI.getAll();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      const formatted = rawData.map(c => {
        const titleUz = c.nameUz || c.name || '';
        return {
          id: c.id,
          title: { uz: titleUz, ru: c.nameRu || c.name || titleUz, en: c.nameEn || c.name || titleUz },
          description: { uz: c.descriptionUz || c.description || '', ru: c.descriptionRu || c.description || '', en: c.descriptionEn || c.description || '' },
          iconName: c.iconName || c.icon || getAutoIcon(titleUz),
          borderColor: 'border-t-blue-500',
          iconBg: 'bg-blue-50'
        };
      });
      setCenters(formatted);
    } catch (e) {
      console.warn('API error in loadCenters:', e.message);
      setCenters([]);
    }
  };

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 4000);
  };

  const handleSave = async () => {
    const currentTitle = formData.title.uz || formData.title.ru || formData.title.en;
    if (!currentTitle.trim()) {
      alert("Iltimos, bo'lim nomini kiriting!");
      return;
    }

    try {
      const dto = {
        nameUz: formData.title.uz || currentTitle,
        nameRu: formData.title.ru || '',
        nameEn: formData.title.en || '',
        descriptionUz: formData.description.uz || '',
        descriptionRu: formData.description.ru || '',
        descriptionEn: formData.description.en || '',
        icon: formData.iconName,
        iconName: formData.iconName
      };

      if (editMode && formData.id) {
        await centersAPI.update(formData.id, dto);
        showNotification("Muvaffaqiyatli tahrirlandi");
      } else {
        await centersAPI.create(dto);
        showNotification("Muvaffaqiyatli qo'shildi");
      }
      loadCenters();
    } catch (e) {
      showNotification(e.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await centersAPI.delete(selectedItem.id);
      showNotification("Muvaffaqiyatli o'chirildi");
      loadCenters();
    } catch (e) {
      showNotification(e.message || "O'chirishda xatolik yuz berdi");
    }
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setFormData({
      id: item.id,
      title: typeof item.title === 'object' ? { ...item.title } : { uz: item.title, ru: item.title, en: item.title },
      description: typeof item.description === 'object' ? { ...item.description } : { uz: item.description, ru: item.description, en: item.description },
      headName: item.headName || '',
      phone: item.phone || '',
      email: item.email || '',
      receptionHours: item.receptionHours || '',
      iconName: item.iconName || 'BookOpen',
      borderColor: item.borderColor || 'border-t-blue-500',
      iconBg: item.iconBg || 'bg-blue-50'
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      id: null,
      title: { uz: '', ru: '', en: '' },
      description: { uz: '', ru: '', en: '' },
      headName: '',
      phone: '',
      email: '',
      receptionHours: '09:00 - 17:00',
      iconName: 'BookOpen',
      borderColor: 'border-t-blue-500',
      iconBg: 'bg-blue-50'
    });
    setIsModalOpen(true);
  };

  const getItemTitle = (item, lang = 'uz') => {
    if (!item) return '';
    if (typeof item.title === 'string') return item.title;
    return item.title?.[lang] || item.title?.uz || item.title?.ru || item.title?.en || '';
  };

  const getItemDesc = (item, lang = 'uz') => {
    if (!item) return '';
    if (typeof item.description === 'string') return item.description;
    return item.description?.[lang] || item.description?.uz || item.description?.ru || item.description?.en || '';
  };

  const filteredCenters = centers.filter(center => {
    const title = getItemTitle(center, activeLang).toLowerCase();
    const desc = getItemDesc(center, activeLang).toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || desc.includes(search);
  });

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Markaz va Bo'limlar</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Jami: <span className="font-semibold text-blue-600 dark:text-blue-400">{centers.length}</span> ta markaz va bo'limlar
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          Yangi bo'lim qo'shish
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bo'limlar va markazlar orasidan qidirish..." 
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Centers List */}
      <div className="flex flex-col gap-4">
        {filteredCenters.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500">
            Birorta ham markaz yoki bo'lim topilmadi.
          </div>
        ) : (
          filteredCenters.map((center) => (
            <div 
              key={center.id} 
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${center.iconBg || 'bg-blue-50'} border border-slate-100 dark:border-slate-800`}>
                  {renderCenterIcon(center.iconName, "w-6 h-6 text-blue-600")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                    {getItemTitle(center, activeLang)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {getItemDesc(center, activeLang)}
                  </p>
                  {center.headName && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Boshliq: <strong className="text-slate-800 dark:text-slate-200">{center.headName}</strong></span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <button 
                  onClick={() => { setSelectedItem(center); setViewModalOpen(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ko'rish
                </button>
                <button 
                  onClick={() => openEditModal(center)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-400 dark:border-emerald-500/60 hover:bg-emerald-100/80 rounded-xl transition duration-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Tahrirlash</span>
                </button>
                <button 
                  onClick={() => { setSelectedItem(center); setDeleteModalOpen(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400 bg-white dark:bg-slate-800 border border-rose-400 dark:border-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>O'chirish</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedItem.iconBg || 'bg-blue-50'}`}>
                {renderCenterIcon(selectedItem.iconName, "w-8 h-8 text-blue-600")}
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                  Markaz / Bo'lim #{selectedItem.id}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {getItemTitle(selectedItem, 'uz')}
                </h2>
              </div>
            </div>

            <div className="space-y-4 my-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
              {selectedItem.headName && (
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4 text-blue-500" />
                  <span><strong>Bo'lim boshlig'i:</strong> {selectedItem.headName}</span>
                </div>
              )}
              {selectedItem.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span><strong>Telefon:</strong> {selectedItem.phone}</span>
                </div>
              )}
              {selectedItem.email && (
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span><strong>Email:</strong> {selectedItem.email}</span>
                </div>
              )}
              {selectedItem.receptionHours && (
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span><strong>Qabul vaqtlari:</strong> {selectedItem.receptionHours}</span>
                </div>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Tavsif:</h4>
              <p>{getItemDesc(selectedItem, 'uz')}</p>
            </div>
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
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
              Siz rostdan ham <span className="text-red-500 font-bold">{getItemTitle(selectedItem, 'uz')}</span> ni o'chirmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-sm"
              >
                Yo'q
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? "Bo'limni tahrirlash" : "Yangi bo'lim qo'shish"}
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

              {/* Multilingual Title & Description */}
              {(() => {
                const text = {
                  uz: { titleLabel: "Bo'lim / Markaz nomi", titlePl: "Nomi kiriting...", descLabel: "Batafsil ma'lumot (Tavsif)", descPl: "Bo'lim maqsadi va faoliyati haqida ma'lumot..." },
                  ru: { titleLabel: "Название отдела / центра", titlePl: "Введите название...", descLabel: "Информация (Описание)", descPl: "Информация о целях и деятельности..." },
                  en: { titleLabel: "Department / Center Name", titlePl: "Enter name...", descLabel: "Detailed Information", descPl: "Information about goals and activities..." }
                }[activeLang];

                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.titleLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title[activeLang] || ''}
                        onChange={e => setFormData({
                          ...formData,
                          title: { ...formData.title, [activeLang]: e.target.value }
                        })}
                        placeholder={text.titlePl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.descLabel}
                      </label>
                      <textarea
                        rows="3"
                        value={formData.description[activeLang] || ''}
                        onChange={e => setFormData({
                          ...formData,
                          description: { ...formData.description, [activeLang]: e.target.value }
                        })}
                        placeholder={text.descPl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors resize-none text-sm"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Icon selection */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Bo'lim belgisi (Icon)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">
                    {renderCenterIcon(formData.iconName, "w-5 h-5 text-blue-600 dark:text-blue-400")}
                  </div>
                  <select
                    value={formData.iconName}
                    onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                    className="block flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                  >
                    {AVAILABLE_ICONS.map(icon => (
                      <option key={icon.name} value={icon.name}>{icon.label}</option>
                    ))}
                  </select>
                </div>
              </div>
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
