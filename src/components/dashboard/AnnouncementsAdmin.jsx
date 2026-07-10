import React, { useState } from 'react';
import { Plus, Search, Calendar, X, Image as ImageIcon, Check, Eye, Edit2, Trash2 } from 'lucide-react';

export default function AnnouncementsAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    title: { uz: '', ru: '', en: '' },
    content: { uz: '', ru: '', en: '' },
    author: '©️ UrDPI matbuot xizmati'
  });

  const mockAnnouncements = [
    { 
      id: 1, 
      title: "Diqqat e'lon!", 
      content: "Barcha talabalar va o'qituvchilar diqqatiga...",
      date: "2023-09-05",
      author: "©️ UrDPI matbuot xizmati",
      image: "https://via.placeholder.com/300x200"
    }
  ];

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    if (editMode) {
      showNotification("Muvaffaqiyatli tahrirlandi");
    } else {
      showNotification("Muvaffaqiyatli qo'shildi");
    }
  };

  const handleDelete = () => {
    setDeleteModalOpen(false);
    showNotification("Muvaffaqiyatli o'chirildi");
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setFormData({
      title: { uz: item.title, ru: item.title, en: item.title },
      content: { uz: item.content, ru: item.content, en: item.content },
      author: item.author
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      title: { uz: '', ru: '', en: '' },
      content: { uz: '', ru: '', en: '' },
      author: '©️ UrDPI matbuot xizmati'
    });
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

      {/* Content area */}
      {mockAnnouncements.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha e'lonlar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi e'lon qo'shish uchun yuqoridagi "Qo'shish" tugmasini bosing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-700">
                <img src={announcement.image} alt={announcement.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-slate-400 mb-2">{announcement.date}</div>
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
                    className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-sm font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Tahrirlash
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(announcement); setDeleteModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> O'chirish
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
                onClick={handleDelete} 
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
                {editMode ? "E'lonni tahrirlash" : "Yangi e'lon qo'shish"}
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
                  uz: { titleLabel: "Sarlavha", titlePl: "E'lon sarlavhasini kiriting", contentLabel: "Izoh", contentPl: "E'lon matnini kiriting", authorLabel: "Muallif" },
                  ru: { titleLabel: "Заголовок", titlePl: "Введите заголовок объявления", contentLabel: "Текст", contentPl: "Введите текст объявления", authorLabel: "Автор" },
                  en: { titleLabel: "Title", titlePl: "Enter announcement title", contentLabel: "Content", contentPl: "Enter announcement content", authorLabel: "Author" }
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

                    {/* Rasm yuklash */}
                    {activeLang === 'uz' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Rasm yuklash
                        </label>

                        <div className="flex-1 w-full flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-500" aria-hidden="true" />
                            <div className="mt-2 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                              <label
                                className="relative cursor-pointer rounded-md font-semibold text-[#0eb99c] hover:text-[#0ca389] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0eb99c]"
                              >
                                <span>Rasm yuklash</span>
                                <input type="file" className="sr-only" accept="image/*" />
                              </label>
                            </div>
                          </div>
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
