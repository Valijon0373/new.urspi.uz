import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, X, Image as ImageIcon, Check, Eye, Edit2, Trash2, CheckCircle2, XCircle, Power } from 'lucide-react';
import { newsAPI, getFileUrl } from '../../api';

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

  const [imageIds, setImageIds] = useState([1]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    title: { uz: '', ru: '', en: '' },
    content: { uz: '', ru: '', en: '' },
    author: '©️ UrDPI matbuot xizmati'
  });

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
      date: item.createdAt ? item.createdAt.split('T')[0] : (item.date || "2026-08-21"),
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

  const handleFileChange = (index, file) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [index]: file }));
    }
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
    try {
      const fd = new FormData();
      fd.append('titleUz', formData.title.uz || 'Yangilik');
      fd.append('titleRu', formData.title.ru || '');
      fd.append('titleEn', formData.title.en || '');
      fd.append('contentUz', formData.content.uz || '');
      fd.append('contentRu', formData.content.ru || '');
      fd.append('contentEn', formData.content.en || '');
      fd.append('author', formData.author || '©️ UrDPI matbuot xizmati');

      // Append main image if selected
      if (selectedFiles[0]) {
        fd.append('mainImage', selectedFiles[0]);
        fd.append('file', selectedFiles[0]);
      }

      // Append extra images
      Object.keys(selectedFiles).forEach(key => {
        if (Number(key) > 0 && selectedFiles[key]) {
          fd.append('images', selectedFiles[key]);
          fd.append('files', selectedFiles[key]);
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
      author: item.author || '©️ UrDPI matbuot xizmati'
    });
    setSelectedFiles({});
    setImageIds([1]);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setFormData({
      title: { uz: '', ru: '', en: '' },
      content: { uz: '', ru: '', en: '' },
      author: '©️ UrDPI matbuot xizmati'
    });
    setSelectedFiles({});
    setImageIds([1]);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[70]">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <span className="text-slate-800 dark:text-slate-100 font-medium">{notification.message}</span>
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
                  <span>{news.date}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-900/20 hover:bg-slate-900/40 text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 sm:h-80 w-full bg-slate-100 shrink-0">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedItem.date}</span>
                <span>{selectedItem.author}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{selectedItem.title}</h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                <p>{selectedItem.content}</p>
              </div>
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
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}
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
                  uz: { titleLabel: "Sarlavha", titlePl: "Yangilik sarlavhasini kiriting", contentLabel: "Izoh", contentPl: "Yangilik matnini kiriting", authorLabel: "Muallif" },
                  ru: { titleLabel: "Заголовок", titlePl: "Введите заголовок новости", contentLabel: "Текст", contentPl: "Введите текст новости", authorLabel: "Автор" },
                  en: { titleLabel: "Title", titlePl: "Enter news title", contentLabel: "Content", contentPl: "Enter news content", authorLabel: "Author" }
                }[activeLang];

                return (
                  <>
                    {/* Sarlavha */}
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

                    {/* Izoh */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.contentLabel}
                      </label>
                      <textarea
                        rows="4"
                        value={formData.content[activeLang]}
                        onChange={e => setFormData({ ...formData, content: { ...formData.content, [activeLang]: e.target.value } })}
                        placeholder={text.contentPl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors resize-none"
                      />
                    </div>

                    {/* Rasm yuklash faqat UZ da chiqadi */}
                    {activeLang === 'uz' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Rasm yuklash (maksimal 5 ta)
                        </label>

                        <div className="space-y-4">
                          {imageIds.map((id, index) => {
                            const isLast = index === imageIds.length - 1;
                            const currentFile = selectedFiles[index];
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
                                        <span>
                                          {currentFile
                                            ? currentFile.name
                                            : (index === 0 ? "Asosiy rasm yuklash" : `${index + 1}-rasm yuklash`)}
                                        </span>
                                        <input
                                          type="file"
                                          className="sr-only"
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(index, e.target.files?.[0])}
                                        />
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
                    )}

                    {/* Xizmat matni */}
                    {activeLang === 'uz' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          {text.authorLabel}
                        </label>
                        <input
                          type="text"
                          value={formData.author}
                          onChange={e => setFormData({ ...formData, author: e.target.value })}
                          className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors"
                        />
                      </div>
                    )}
                  </>
                );
              })()}
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
                onClick={handleSave}
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
