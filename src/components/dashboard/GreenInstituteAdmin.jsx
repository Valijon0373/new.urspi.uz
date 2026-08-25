import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Check, Trash2, X, Leaf, Edit2, Eye, Power, Search } from 'lucide-react';
import { greenInstitutesAPI, filesAPI, getFileUrl } from '../../api';

export default function GreenInstituteAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    title: { uz: '', ru: '', en: '' },
    description: { uz: '', ru: '', en: '' }
  });

  const getLocalItems = () => {
    try {
      return JSON.parse(localStorage.getItem('urspi_custom_green_institutes') || '[]');
    } catch (e) {
      return [];
    }
  };

  const setLocalItems = (items) => {
    try {
      localStorage.setItem('urspi_custom_green_institutes', JSON.stringify(items));
    } catch (e) {}
  };

  const fetchItems = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await greenInstitutesAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
    } catch (e) {
      console.warn('API fetch error in GreenInstituteAdmin:', e.message);
    }

    const localItems = getLocalItems();
    const combinedMap = new Map();
    apiData.forEach(item => {
      if (item && item.id) combinedMap.set(item.id, item);
    });
    localItems.forEach(item => {
      if (item && item.id && !combinedMap.has(item.id)) {
        combinedMap.set(item.id, item);
      }
    });

    const rawData = Array.from(combinedMap.values());
    const formatted = rawData.map(item => {
      const keys = ['image', 'photo', 'imageLink', 'photoLink', 'filePath', 'fileName', 'fileLink', 'file', 'url', 'path', 'link'];
      let imgRaw = '';
      for (const k of keys) {
        const val = item[k];
        if (typeof val === 'string' && val.trim() && !val.trim().startsWith('blob:')) {
          imgRaw = val.trim();
          break;
        }
        if (val && typeof val === 'object') {
          const nested = val.link || val.url || val.path || val.filePath || val.fileName || val.fileLink || val.photoLink || val.imageLink;
          if (typeof nested === 'string' && nested.trim() && !nested.trim().startsWith('blob:')) {
            imgRaw = nested.trim();
            break;
          }
        }
      }

      let finalImg = '';
      if (imgRaw) {
        if (imgRaw.startsWith('http://') || imgRaw.startsWith('https://') || imgRaw.startsWith('data:')) {
          finalImg = imgRaw;
        } else if (!imgRaw.startsWith('blob:')) {
          finalImg = getFileUrl(imgRaw);
        }
      }

      return {
        id: item.id,
        title: item.titleUz || item.title || "Yashil Institut",
        description: item.descriptionUz || item.description || item.contentUz || item.content || "",
        titleUz: item.titleUz || item.title || '',
        titleRu: item.titleRu || '',
        titleEn: item.titleEn || '',
        descriptionUz: item.descriptionUz || item.contentUz || '',
        descriptionRu: item.descriptionRu || item.contentRu || '',
        descriptionEn: item.descriptionEn || item.contentEn || '',
        status: item.status || (item.active !== false ? 'ACTIVE' : 'DISABLED'),
        active: item.active !== false,
        image: finalImg,
        rawItem: item
      };
    });

    setItemsList(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleToggleStatus = async (item) => {
    try {
      await greenInstitutesAPI.toggleStatus(item.id);
    } catch (err) {
      console.warn("Toggle status API error:", err.message);
    }
    const localList = getLocalItems();
    const idx = localList.findIndex(x => x.id === item.id);
    if (idx >= 0) {
      localList[idx].active = !localList[idx].active;
      setLocalItems(localList);
    }
    showNotification("Holati o'zgartirildi");
    fetchItems();
  };

  const handleSave = async () => {
    try {
      let uploadedFileName = '';
      if (imageFile) {
        try {
          const fileRes = await filesAPI.upload(imageFile);
          uploadedFileName = typeof fileRes === 'string' ? fileRes : (fileRes?.url || fileRes?.filePath || fileRes?.fileName || fileRes?.name || fileRes?.path || fileRes?.data || '');
        } catch (err) {
          console.warn('filesAPI.upload failed:', err.message);
        }
      }

      const fd = new FormData();
      fd.append('titleUz', formData.title.uz || "Yashil Institut");
      fd.append('titleRu', formData.title.ru || '');
      fd.append('titleEn', formData.title.en || '');
      fd.append('title', formData.title.uz || "Yashil Institut");
      fd.append('descriptionUz', formData.description.uz || '');
      fd.append('descriptionRu', formData.description.ru || '');
      fd.append('descriptionEn', formData.description.en || '');
      fd.append('description', formData.description.uz || '');

      if (uploadedFileName) {
        fd.append('photoLink', uploadedFileName);
        fd.append('imageLink', uploadedFileName);
        fd.append('filePath', uploadedFileName);
        fd.append('photo', uploadedFileName);
        fd.append('image', uploadedFileName);
      }

      if (imageFile) {
        fd.append('file', imageFile);
        fd.append('image', imageFile);
        fd.append('photo', imageFile);
      }

      let apiResItem = null;
      try {
        if (editMode && selectedItem) {
          const res = await greenInstitutesAPI.update(selectedItem.id, fd);
          apiResItem = res?.data || res;
        } else {
          const res = await greenInstitutesAPI.create(fd);
          apiResItem = res?.data || res;
        }
      } catch (e) {
        console.warn("Backend green institute save failed, falling back to local storage:", e.message);
      }

      let base64Image = '';
      if (imageFile) {
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(imageFile);
        });
      }

      const targetId = (apiResItem && apiResItem.id) || (editMode && selectedItem ? selectedItem.id : Date.now());
      const fallbackObj = {
        id: targetId,
        title: formData.title.uz || "Yashil Institut",
        titleUz: formData.title.uz || "Yashil Institut",
        titleRu: formData.title.ru || '',
        titleEn: formData.title.en || '',
        description: formData.description.uz || '',
        descriptionUz: formData.description.uz || '',
        descriptionRu: formData.description.ru || '',
        descriptionEn: formData.description.en || '',
        active: true,
        imageLink: uploadedFileName || (apiResItem?.imageLink || apiResItem?.photoLink || ''),
        image: uploadedFileName ? getFileUrl(uploadedFileName) : (base64Image || (apiResItem?.image || selectedItem?.image || ''))
      };

      const localList = getLocalItems();
      const existingIdx = localList.findIndex(x => x.id === targetId);
      if (existingIdx >= 0) {
        localList[existingIdx] = { ...localList[existingIdx], ...fallbackObj };
      } else {
        localList.unshift(fallbackObj);
      }
      setLocalItems(localList);
      window.dispatchEvent(new Event('storage'));

      showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
      fetchItems();
      setIsModalOpen(false);
    } catch (e) {
      showNotification(e.message || (editMode ? "Tahrirlashda xatolik" : "Qo'shishda xatolik"), 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      try {
        await greenInstitutesAPI.delete(selectedItem.id);
      } catch (e) {
        console.warn("Backend delete error:", e.message);
      }
      const localList = getLocalItems().filter(x => x.id !== selectedItem.id);
      setLocalItems(localList);
      window.dispatchEvent(new Event('storage'));
      showNotification("Muvaffaqiyatli o'chirildi");
      fetchItems();
    }
    setDeleteModalOpen(false);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormData({
      title: { uz: item.titleUz || item.title, ru: item.titleRu || item.title, en: item.titleEn || item.title },
      description: { uz: item.descriptionUz || item.description, ru: item.descriptionRu || item.description, en: item.descriptionEn || item.description }
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setFormData({
      title: { uz: '', ru: '', en: '' },
      description: { uz: '', ru: '', en: '' }
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const filteredItems = itemsList.filter(item => {
    const titleStr = (typeof item.title === 'string' ? item.title : '').toLowerCase();
    return titleStr.includes(searchTerm.toLowerCase());
  });

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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-500" />
            Yashil Universitet Boshqaruvi
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Yashil institut bo'limi ma'lumotlari va rasm-galereyalarini boshqarish
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi qo'shish</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sarlavha bo'yicha qidirish..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center text-slate-500">
          Ma'lumotlar yuklanmoqda...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha ma'lumotlar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi element qo'shish uchun "Yangi qo'shish" tugmasini bosing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative">
              <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                )}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md shadow-md transition-colors ${
                      item.active
                        ? 'bg-emerald-500/90 text-white hover:bg-emerald-600'
                        : 'bg-slate-600/90 text-white hover:bg-slate-700'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{item.active ? 'Faol' : 'No-faol'}</span>
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">{item.title || 'Nomsiz'}</h3>
                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">{item.description}</p>
                )}
                
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <button
                    onClick={() => { setSelectedItem(item); setViewModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-1 py-1.5 px-2 text-xs font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ko'rish
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 flex justify-center items-center gap-1 py-1.5 px-2 text-xs font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Tahrirlash
                  </button>
                  <button
                    onClick={() => { setSelectedItem(item); setDeleteModalOpen(true); }}
                    className="flex-1 flex justify-center items-center gap-1 py-1.5 px-2 text-xs font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> O'chirish
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
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-900/40 hover:bg-slate-900/60 text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-64 w-full bg-slate-100 flex items-center justify-center shrink-0">
              {selectedItem.image ? (
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
              )}
            </div>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">{selectedItem.title}</h2>
              {selectedItem.description && (
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedItem.description}</p>
              )}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? "Yashil Institut ma'lumotini tahrirlash" : "Yangi Yashil Institut ma'lumotini qo'shish"}
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
                  uz: { titleLabel: "Sarlavha", titlePl: "Sarlavhani kiriting", descLabel: "Tavsif / Matn", descPl: "Batafsil ma'lumot kiriting" },
                  ru: { titleLabel: "Заголовок", titlePl: "Введите заголовок", descLabel: "Описание", descPl: "Введите подробное описание" },
                  en: { titleLabel: "Title", titlePl: "Enter title", descLabel: "Description", descPl: "Enter detailed description" }
                }[activeLang];

                return (
                  <>
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

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.descLabel}
                      </label>
                      <textarea
                        rows="4"
                        value={formData.description[activeLang]}
                        onChange={e => setFormData({ ...formData, description: { ...formData.description, [activeLang]: e.target.value } })}
                        placeholder={text.descPl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors resize-none"
                      />
                    </div>

                    {activeLang === 'uz' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Rasm yuklash
                        </label>
                        <div className="flex-1 w-full flex justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 px-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-500" aria-hidden="true" />
                            <div className="mt-2 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                              <label className="relative cursor-pointer rounded-md font-semibold text-[#0eb99c] hover:text-[#0ca389]">
                                <span>{imageFile ? imageFile.name : "Fayl tanlash"}</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</p>
                          </div>
                        </div>
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
