import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, X, Check, Eye, Edit2, Trash2, Power, Upload, Globe, FileText, User, Image as ImageIcon, Newspaper, Sparkles, AlertCircle } from 'lucide-react';
import { newsAPI, getFileUrl, newsDateIso, formatNewsDate } from '../../api';

const todayIso = () => newsDateIso(new Date());

const formatDateForBackend = (dateStr) => {
  const iso = newsDateIso(dateStr);
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};

export default function NewsAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    titleUz: '',
    titleRu: '',
    titleEn: '',
    contentUz: '',
    contentRu: '',
    contentEn: '',
    publishedAt: todayIso(),
    author: '©️ UrDPI matbuot xizmati'
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const fetchNews = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await newsAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
    } catch (err) {
      console.warn('API error in fetchNews:', err.message);
    }

    const formatted = apiData.map(item => ({
      id: item.id,
      title: item.titleUz || item.title || "Yangilik",
      content: item.contentUz || item.content || "",
      titleUz: item.titleUz || '',
      titleRu: item.titleRu || '',
      titleEn: item.titleEn || '',
      contentUz: item.contentUz || '',
      contentRu: item.contentRu || '',
      contentEn: item.contentEn || '',
      publishedAt: newsDateIso(item) || todayIso(),
      date: newsDateIso(item) || todayIso(),
      author: item.author || "©️ UrDPI matbuot xizmati",
      status: item.status || (item.active !== false ? 'ACTIVE' : 'DISABLED'),
      active: item.active !== false,
      image: getFileUrl(item.mainImageLink || item.mainImage || item.image) || "https://via.placeholder.com/300x200",
      rawItem: item
    }));
    setNewsList(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = newsList.filter(news => {
    const titleStr = (typeof news.title === 'string' ? news.title : '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = titleStr.includes(searchLower);
    const matchesDateFrom = dateFrom ? news.date >= dateFrom : true;
    const matchesDateTo = dateTo ? news.date <= dateTo : true;
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 5 - additionalFiles.length;
    if (availableSlots <= 0) {
      showNotification("Qo'shimcha rasmlar soni ko'pi bilan 5 ta bo'lishi mumkin!", 'error');
      return;
    }

    const filesToAdd = files.slice(0, availableSlots);
    const newPreviews = filesToAdd.map(f => URL.createObjectURL(f));

    setAdditionalFiles(prev => [...prev, ...filesToAdd]);
    setAdditionalPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveAdditionalImage = (index) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleStatus = async (item) => {
    try {
      await newsAPI.toggleStatus(item.id);
      showNotification("Yangilik holati o'zgartirildi");
      fetchNews();
    } catch (err) {
      console.warn("Toggle status API error:", err.message);
      showNotification(err.message || "Xatolik yuz berdi", 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.titleUz?.trim()) {
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
      fd.append('titleUz', formData.titleUz.trim());
      if (formData.titleRu) fd.append('titleRu', formData.titleRu.trim());
      if (formData.titleEn) fd.append('titleEn', formData.titleEn.trim());

      if (formData.contentUz) fd.append('contentUz', formData.contentUz.trim());
      if (formData.contentRu) fd.append('contentRu', formData.contentRu.trim());
      if (formData.contentEn) fd.append('contentEn', formData.contentEn.trim());

      // Format publishedAt as dd-MM-yyyy
      const formattedDate = formatDateForBackend(formData.publishedAt);
      fd.append('publishedAt', formattedDate);

      if (formData.author) fd.append('author', formData.author.trim());
      fd.append('date', formattedDate);

      // Main image
      if (mainImageFile) {
        fd.append('mainImage', mainImageFile);
        fd.append('file', mainImageFile);
      }

      // Additional images (up to 5)
      additionalFiles.forEach((file) => {
        if (file) {
          fd.append('images', file);
          fd.append('files', file);
        }
      });

      if (editMode && selectedItem) {
        await newsAPI.update(selectedItem.id, fd);
      } else {
        await newsAPI.create(fd);
      }

      showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
      fetchNews();
      setIsModalOpen(false);
    } catch (e) {
      showNotification(e.message || (editMode ? "Tahrirlashda xatolik" : "Qo'shishda xatolik"), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        await newsAPI.delete(selectedItem.id);
        showNotification("Muvaffaqiyatli o'chirildi");
        fetchNews();
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
    const raw = item.rawItem || {};
    setFormData({
      titleUz: raw.titleUz || item.titleUz || (typeof item.title === 'string' ? item.title : ''),
      titleRu: raw.titleRu || item.titleRu || '',
      titleEn: raw.titleEn || item.titleEn || '',
      contentUz: raw.contentUz || item.contentUz || (typeof item.content === 'string' ? item.content : ''),
      contentRu: raw.contentRu || item.contentRu || '',
      contentEn: raw.contentEn || item.contentEn || '',
      publishedAt: newsDateIso(raw.publishedAt || item.publishedAt || item.date || item.createdAt) || todayIso(),
      author: raw.author || item.author || '©️ UrDPI matbuot xizmati'
    });
    setMainImageFile(null);
    setMainImagePreview(item.image || null);
    
    const existingExtra = raw.images || raw.imageLinks || [];
    setAdditionalFiles([]);
    setAdditionalPreviews(Array.isArray(existingExtra) ? existingExtra.map(img => getFileUrl(img)) : []);
    
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setFormData({
      titleUz: '',
      titleRu: '',
      titleEn: '',
      contentUz: '',
      contentRu: '',
      contentEn: '',
      publishedAt: todayIso(),
      author: '©️ UrDPI matbuot xizmati'
    });
    setMainImageFile(null);
    setMainImagePreview(null);
    setAdditionalFiles([]);
    setAdditionalPreviews([]);
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Yangiliklar</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Platformadagi barcha yangiliklarni boshqarish
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
      {filteredNews.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha yangiliklar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi yangilik qo'shish uchun yuqoridagi "Qo'shish" tugmasini bosing yoki qidiruvni bekor qiling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div key={news.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-700">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <span>{formatNewsDate(news.date)}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(news)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${
                      news.active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                    title="Holatni o'zgartirish"
                  >
                    <Power className="w-3 h-3" />
                    <span>{news.active ? 'Faol' : 'No-faol'}</span>
                  </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{news.content}</p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <button 
                    onClick={() => { setSelectedItem(news); setViewModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-sm font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Ko'rish
                  </button>
                  <button 
                    onClick={() => openEditModal(news)}
                    className="flex-1 flex justify-center items-center gap-1.5 py-1.5 px-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-400 dark:border-emerald-500/60 hover:bg-emerald-100/80 rounded-xl transition duration-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> <span>Tahrirlash</span>
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(news); setDeleteModalOpen(true); }}
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Yangilikni o'chirish</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Siz rostdan ham <span className="text-slate-900 dark:text-white font-bold">"{selectedItem.title}"</span> yangiligini o'chirib tashlamoqchimisiz?
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
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
                    {editMode ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}
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

              {/* Language Tabs - Segmented Pill Control */}
              <div className="bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-2xl flex gap-1.5">
                {[
                  { id: 'uz', flag: '🇺🇿', label: "O'zbekcha", code: 'UZ', req: true },
                  { id: 'ru', flag: '🇷🇺', label: 'Русский', code: 'RU', req: false },
                  { id: 'en', flag: '🇬🇧', label: 'English', code: 'EN', req: false }
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
                        value={formData.titleUz}
                        onChange={e => setFormData({ ...formData, titleUz: e.target.value })}
                        placeholder="Yangilik sarlavhasini kiriting (O'zbekcha)..."
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
                        value={formData.contentUz}
                        onChange={e => setFormData({ ...formData, contentUz: e.target.value })}
                        placeholder="Yangilik matnini batafsil kiriting (O'zbekcha)..."
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
                      <span>Sarlavha (Ruscha / На русском)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <input
                        type="text"
                        value={formData.titleRu}
                        onChange={e => setFormData({ ...formData, titleRu: e.target.value })}
                        placeholder="Введите заголовок новости на русском..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none rounded-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Matn (Ruscha / На русском)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <textarea
                        rows="4"
                        value={formData.contentRu}
                        onChange={e => setFormData({ ...formData, contentRu: e.target.value })}
                        placeholder="Введите текст новости на русском..."
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
                      <span>Sarlavha (Inglizcha / English)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <input
                        type="text"
                        value={formData.titleEn}
                        onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                        placeholder="Enter news title in English..."
                        className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none rounded-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0eb99c]" />
                      <span>Matn (Inglizcha / English)</span>
                    </label>
                    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0eb99c] focus-within:ring-4 focus-within:ring-[#0eb99c]/10 transition-all duration-200">
                      <textarea
                        rows="4"
                        value={formData.contentEn}
                        onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                        placeholder="Enter news content in English..."
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

              {/* Main Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0eb99c]" />
                    <span>Asosiy Muqova Rasmi</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Tavsiya etiladi: 16:9 yoki horizontal</span>
                </label>

                {mainImagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group h-48 w-full shadow-sm">
                    <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer px-4 py-2 bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#0eb99c]" />
                        <span>Almashtirish</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleMainImageChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMainImageFile(null); setMainImagePreview(null); }}
                        className="px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>O'chirish</span>
                      </button>
                    </div>
                    {mainImageFile && (
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                        {mainImageFile.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="group relative cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700/80 hover:border-[#0eb99c] dark:hover:border-[#0eb99c] rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-all duration-200">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 dark:bg-emerald-950/50 text-[#0eb99c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Asosiy rasmni tanlang yoki shu yerga tashlang
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG, WEBP formatlari qo'llab-quvvatlanadi
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleMainImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Additional Images Upload (up to 5) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0eb99c]" />
                    <span>Qo'shimcha Rasmlar</span>
                  </label>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {additionalPreviews.length} / 5 ta
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {additionalPreviews.map((previewUrl, idx) => (
                    <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 group bg-slate-900 shadow-sm">
                      <img src={previewUrl} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(idx)}
                          className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {additionalPreviews.length < 5 && (
                    <label className="h-24 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700/80 hover:border-[#0eb99c] dark:hover:border-[#0eb99c] rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 hover:bg-emerald-50/30 text-slate-400 hover:text-[#0eb99c] transition-all group">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-[#0eb99c]/10 text-slate-400 group-hover:text-[#0eb99c] flex items-center justify-center transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold mt-1">Rasm qo'shish</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                      />
                    </label>
                  )}
                </div>
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

