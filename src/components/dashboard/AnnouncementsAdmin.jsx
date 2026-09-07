import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, X, Check, Eye, Edit2, Trash2, Power, Upload, Globe, FileText, User, Image as ImageIcon, Sparkles, Megaphone } from 'lucide-react';
import { announcementsAPI, getFileUrl, newsDateIso, formatNewsDate } from '../../api';

const todayIso = () => newsDateIso(new Date());

const formatDateForBackend = (dateStr) => {
  const iso = newsDateIso(dateStr);
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};

export default function AnnouncementsAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    title: { uz: '', ru: '', en: '' },
    content: { uz: '', ru: '', en: '' },
    publishedAt: todayIso(),
    author: '©️ UrDPI matbuot xizmati'
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await announcementsAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
    } catch (e) {
      console.warn('API error in fetchAnnouncements:', e.message);
    }

    const formatted = apiData.map(item => ({
      id: item.id,
      title: item.titleUz || item.title || "E'lon",
      content: item.contentUz || item.content || "",
      titleUz: item.titleUz || '',
      titleRu: item.titleRu || '',
      titleEn: item.titleEn || '',
      contentUz: item.contentUz || '',
      contentRu: item.contentRu || '',
      contentEn: item.contentEn || '',
      publishedAt: newsDateIso(item.publishedAt || item.date || item.createdAt) || todayIso(),
      date: newsDateIso(item.publishedAt || item.date || item.createdAt) || todayIso(),
      author: item.author || "©️ UrDPI matbuot xizmati",
      status: item.status || (item.active !== false ? 'ACTIVE' : 'DISABLED'),
      active: item.active !== false,
      image: getFileUrl(item.imageLink || item.image) || "https://via.placeholder.com/300x200",
      rawItem: item
    }));
    setAnnouncementsList(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcementsList.filter(item => {
    const titleStr = (typeof item.title === 'string' ? item.title : '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = titleStr.includes(searchLower);
    const matchesDateFrom = dateFrom ? item.date >= dateFrom : true;
    const matchesDateTo = dateTo ? item.date <= dateTo : true;
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await announcementsAPI.toggleStatus(item.id);
      showNotification("E'lon holati o'zgartirildi");
      fetchAnnouncements();
    } catch (err) {
      console.warn("Toggle status API error:", err.message);
      showNotification(err.message || "Xatolik yuz berdi", 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.title.uz?.trim()) {
      showNotification("Sarlavha (O'zbekcha) kiritilishi shart!", 'error');
      setActiveLang('uz');
      return;
    }

    if (!formData.publishedAt) {
      showNotification("Sana kiritilishi shart!", 'error');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('titleUz', formData.title.uz.trim());
      if (formData.title.ru) fd.append('titleRu', formData.title.ru.trim());
      if (formData.title.en) fd.append('titleEn', formData.title.en.trim());
      
      if (formData.content.uz) fd.append('contentUz', formData.content.uz.trim());
      if (formData.content.ru) fd.append('contentRu', formData.content.ru.trim());
      if (formData.content.en) fd.append('contentEn', formData.content.en.trim());
      
      const formattedDate = formatDateForBackend(formData.publishedAt);
      fd.append('publishedAt', formattedDate);
      fd.append('date', formattedDate);
      if (formData.publishedAt) fd.append('createdAt', formData.publishedAt);

      if (formData.author) fd.append('author', formData.author.trim());

      if (imageFile) {
        fd.append('file', imageFile);
        fd.append('image', imageFile);
      }

      if (editMode && selectedItem) {
        await announcementsAPI.update(selectedItem.id, fd);
      } else {
        await announcementsAPI.create(fd);
      }

      showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
      fetchAnnouncements();
      setIsModalOpen(false);
    } catch (e) {
      showNotification(e.message || (editMode ? "Tahrirlashda xatolik" : "Qo'shishda xatolik"), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        await announcementsAPI.delete(selectedItem.id);
        showNotification("Muvaffaqiyatli o'chirildi");
        fetchAnnouncements();
      } catch (e) {
        console.warn("Backend delete error:", e.message);
        showNotification(e.message || "O'chirishda xatolik", 'error');
      }
    }
    setDeleteModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormData({
      title: { 
        uz: item.titleUz || item.rawItem?.titleUz || (typeof item.title === 'string' ? item.title : ''),
        ru: item.titleRu || item.rawItem?.titleRu || '',
        en: item.titleEn || item.rawItem?.titleEn || ''
      },
      content: {
        uz: item.contentUz || item.rawItem?.contentUz || (typeof item.content === 'string' ? item.content : ''),
        ru: item.contentRu || item.rawItem?.contentRu || '',
        en: item.contentEn || item.rawItem?.contentEn || ''
      },
      publishedAt: newsDateIso(item.publishedAt || item.date || item.createdAt || item.rawItem?.publishedAt) || todayIso(),
      author: item.author || '©️ UrDPI matbuot xizmati'
    });
    setImageFile(null);
    setImagePreview(item.image || null);
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setFormData({
      title: { uz: '', ru: '', en: '' },
      content: { uz: '', ru: '', en: '' },
      publishedAt: todayIso(),
      author: '©️ UrDPI matbuot xizmati'
    });
    setImageFile(null);
    setImagePreview(null);
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl border ${notification.type === 'error' ? 'border-red-200 text-red-600' : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'} rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[70]`}>
          <div className={`w-8 h-8 rounded-full ${notification.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'} flex items-center justify-center shrink-0`}>
            <Check className="w-5 h-5" />
          </div>
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">E'lonlar</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Platformadagi barcha e'lonlarni boshqarish
          </p>
        </div>
        <button
          onClick={openAddModal}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="block w-full sm:w-auto px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-slate-500 dark:text-slate-400">Gacha:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="block w-full sm:w-auto px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      {filteredAnnouncements.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha e'lonlar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi e'lon qo'shish uchun yuqoridagi "Qo'shish" tugmasini bosing hamda qidiruvni tekshiring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-700">
                <img src={announcement.image} alt={announcement.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <span>{formatNewsDate(announcement.date)}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(announcement)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${
                      announcement.active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                    title="Holatni o'zgartirish"
                  >
                    <Power className="w-3 h-3" />
                    <span>{announcement.active ? 'Faol' : 'No-faol'}</span>
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{announcement.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{announcement.content}</p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <button 
                    onClick={() => { setSelectedItem(announcement); setViewModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Ko'rish
                  </button>
                  <button 
                    onClick={() => openEditModal(announcement)}
                    className="flex-1 flex justify-center items-center gap-1.5 py-1.5 px-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-400 dark:border-emerald-500/60 hover:bg-emerald-100/80 rounded-xl transition duration-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> <span>Tahrirlash</span>
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(announcement); setDeleteModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-1.5 py-1.5 px-1 text-xs font-semibold text-rose-500 dark:text-rose-400 bg-white dark:bg-slate-800 border border-rose-400 dark:border-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span>O'chirish</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all">
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md text-white rounded-full transition-all z-10 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 sm:h-80 w-full bg-slate-900 shrink-0 relative">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-center gap-4 text-xs font-semibold text-[#0eb99c] dark:text-emerald-400 mb-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0eb99c]/10 border border-[#0eb99c]/20">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatNewsDate(selectedItem.date)}</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400">{selectedItem.author}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug mb-4">{selectedItem.title}</h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                <p>{selectedItem.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 max-w-sm w-full p-6 text-center">
            <button 
              onClick={() => setDeleteModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 mx-auto bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-2xl flex items-center justify-center mb-4 mt-2 border border-rose-200 dark:border-rose-900/40 shadow-sm">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">E'lonni o'chirish</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Siz rostdan ham <span className="text-slate-900 dark:text-white font-bold">"{selectedItem.title}"</span> e'lonini o'chirib tashlamoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-all"
              >
                Yo'q
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="flex-1 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-rose-500/20"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="relative px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#0eb99c]/10 text-[#0eb99c] flex items-center justify-center shrink-0 border border-[#0eb99c]/20 shadow-sm">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                    {editMode ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 m-0">
                    Barcha kerakli maydonlarni to'ldiring (<span className="text-red-500 font-bold">*</span> majburiy maydonlar)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">

              {/* Language Tabs - Segmented Control */}
              <div className="bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-2xl flex gap-1.5">
                {[
                  { id: 'uz', flag: '🇺🇿', label: "O'zbekcha", req: true },
                  { id: 'ru', flag: '🇷🇺', label: 'Русский', req: false },
                  { id: 'en', flag: '🇬🇧', label: 'English', req: false }
                ].map(lang => {
                  const isActive = activeLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setActiveLang(lang.id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isActive
                          ? 'bg-white dark:bg-slate-700 text-[#0eb99c] dark:text-emerald-400 shadow-md shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-900/5 dark:ring-white/10'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
                      }`}
                    >
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {lang.req && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                          isActive
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          *
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Language Text Inputs */}
              {activeLang === 'uz' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                        <span>Sarlavha (O'zbekcha)</span>
                      </span>
                      <span className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                        Majburiy
                      </span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <input
                        type="text"
                        value={formData.title.uz}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, uz: e.target.value } })}
                        placeholder="E'lon sarlavhasini kiriting (O'zbekcha)..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none rounded-2xl"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Matn (O'zbekcha)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <textarea
                        rows="4"
                        value={formData.content.uz}
                        onChange={e => setFormData({ ...formData, content: { ...formData.content, uz: e.target.value } })}
                        placeholder="E'lon matnini batafsil kiriting (O'zbekcha)..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none resize-none rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeLang === 'ru' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Заголовок (Ruscha / На русском)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <input
                        type="text"
                        value={formData.title.ru}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, ru: e.target.value } })}
                        placeholder="Введите заголовок объявления на русском..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none rounded-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Текст (Ruscha / На русском)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <textarea
                        rows="4"
                        value={formData.content.ru}
                        onChange={e => setFormData({ ...formData, content: { ...formData.content, ru: e.target.value } })}
                        placeholder="Введите текст объявления на русском..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none resize-none rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeLang === 'en' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Title (Inglizcha / English)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <input
                        type="text"
                        value={formData.title.en}
                        onChange={e => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                        placeholder="Enter announcement title in English..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none rounded-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Content (Inglizcha / English)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <textarea
                        rows="4"
                        value={formData.content.en}
                        onChange={e => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                        placeholder="Enter announcement content in English..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none resize-none rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* General Metadata Fields: publishedAt & author */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0eb99c]" />
                        <span>Sana</span>
                      </span>
                      <span className="text-[11px] text-red-500 font-semibold">Majburiy</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-2 focus-within:ring-[#0eb99c]/10 transition-all">
                        <input
                          type="date"
                          value={formData.publishedAt}
                          onChange={e => setFormData({ ...formData, publishedAt: e.target.value })}
                          className="w-full px-3 py-2.5 bg-transparent text-slate-900 dark:text-slate-100 text-sm focus:outline-none rounded-xl"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, publishedAt: todayIso() })}
                        className="px-3.5 py-2.5 bg-emerald-50 hover:bg-[#0eb99c] text-[#0eb99c] hover:text-white dark:bg-emerald-950/40 dark:hover:bg-[#0eb99c] text-xs font-bold rounded-xl transition-all border border-[#0eb99c]/30 shrink-0 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Bugun</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Muallif</span>
                    </label>
                    <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-2 focus-within:ring-[#0eb99c]/10 transition-all">
                      <input
                        type="text"
                        value={formData.author}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Muallif yoki matbuot xizmati..."
                        className="w-full px-4 py-2.5 bg-transparent text-slate-900 dark:text-slate-100 text-sm focus:outline-none rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0eb99c]" />
                    <span>E'lon Rasmi</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">PNG, JPG, WEBP</span>
                </label>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group h-48 w-full shadow-sm">
                    <img src={imagePreview} alt="Announcement Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer px-4 py-2 bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#0eb99c]" />
                        <span>Almashtirish</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>O'chirish</span>
                      </button>
                    </div>
                    {imageFile && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                        {imageFile.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="group relative cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700/80 hover:border-[#0eb99c] dark:hover:border-[#0eb99c] rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/50 text-[#0eb99c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      E'lon rasmini tanlang yoki shu yerga tashlang
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG, WEBP formatlari qo'llab-quvvatlanadi
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 bg-slate-50/70 dark:bg-slate-900/90">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl font-semibold text-sm transition-all"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#0eb99c] hover:bg-[#0ca389] active:scale-[0.98] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-[#0eb99c]/25 flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Saqlash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
