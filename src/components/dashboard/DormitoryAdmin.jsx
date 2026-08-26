import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Check, Trash2, X, Home, Edit2, Eye, Power, Search, Loader2 } from 'lucide-react';
import { dormitoriesAPI, filesAPI, getFileUrl } from '../../api';

export default function DormitoryAdmin() {
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
      return JSON.parse(localStorage.getItem('urspi_custom_dormitories') || '[]');
    } catch (e) {
      return [];
    }
  };

  const setLocalItems = (items) => {
    try {
      localStorage.setItem('urspi_custom_dormitories', JSON.stringify(items));
    } catch (e) {}
  };

  const fetchItems = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await dormitoriesAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
    } catch (e) {
      console.warn('API fetch error in DormitoryAdmin:', e.message);
    }

    const localItems = getLocalItems();
    const combinedMap = new Map();
    apiData.forEach(item => {
      if (item && item.id != null) combinedMap.set(String(item.id), item);
    });
    localItems.forEach(item => {
      if (item && item.id != null && !combinedMap.has(String(item.id))) {
        combinedMap.set(String(item.id), item);
      }
    });

    const rawData = Array.from(combinedMap.values());
    const formatted = rawData.map(item => {
      const keys = ['image', 'photo', 'imageLink', 'photoLink', 'filePath', 'fileName', 'fileLink', 'file', 'url', 'path', 'link', 'mainImageLink'];
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

      const titleObj = typeof item.title === 'object' ? item.title : null;
      const titleUz = item.titleUz || titleObj?.uz || (typeof item.title === 'string' ? item.title : "1-sonli Talabalar turar joyi");
      const titleRu = item.titleRu || titleObj?.ru || titleUz;
      const titleEn = item.titleEn || titleObj?.en || titleUz;

      const descObj = typeof item.description === 'object' ? item.description : null;
      const descUz = item.descriptionUz || item.contentUz || descObj?.uz || (typeof item.description === 'string' ? item.description : "");
      const descRu = item.descriptionRu || item.contentRu || descObj?.ru || descUz;
      const descEn = item.descriptionEn || item.contentEn || descObj?.en || descUz;

      return {
        id: item.id,
        title: titleUz,
        description: descUz,
        titleUz,
        titleRu,
        titleEn,
        descriptionUz: descUz,
        descriptionRu: descRu,
        descriptionEn: descEn,
        status: item.status || (item.active !== false ? 'ACTIVE' : 'DISABLED'),
        active: item.active !== false && item.status !== 'DISABLED',
        image: finalImg || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
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
      let updatedStatus = item.active ? 'DISABLED' : 'ACTIVE';
      try {
        await dormitoriesAPI.toggleStatus(item.id);
      } catch (err) {
        console.warn('API status update error:', err.message);
      }

      const updatedList = itemsList.map(i => {
        if (i.id === item.id) {
          const newActive = !i.active;
          return {
            ...i,
            active: newActive,
            status: newActive ? 'ACTIVE' : 'DISABLED'
          };
        }
        return i;
      });

      setItemsList(updatedList);
      const local = getLocalItems();
      const updatedLocal = local.map(l => {
        if (String(l.id) === String(item.id)) {
          return { ...l, active: !item.active, status: updatedStatus };
        }
        return l;
      });
      setLocalItems(updatedLocal);
      showNotification(`Holat ${!item.active ? 'FAOL' : 'FAOL EMAS'} holatiga o'zgartirildi`);
    } catch (e) {
      showNotification("Holatni o'zgartirishda xatolik: " + e.message, 'error');
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setImageFile(null);
    setFormData({
      title: { uz: '', ru: '', en: '' },
      description: { uz: '', ru: '', en: '' }
    });
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setImageFile(null);
    setFormData({
      title: {
        uz: item.titleUz || item.title || '',
        ru: item.titleRu || '',
        en: item.titleEn || ''
      },
      description: {
        uz: item.descriptionUz || item.description || '',
        ru: item.descriptionRu || '',
        en: item.descriptionEn || ''
      }
    });
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.uz) {
      showNotification("O'zbek tilidagi sarlavhani kiriting", 'error');
      return;
    }

    let uploadedImageLink = selectedItem?.rawItem?.image || selectedItem?.image || '';
    if (imageFile && filesAPI) {
      try {
        const uploadRes = await filesAPI.upload(imageFile);
        if (uploadRes && (uploadRes.fileLink || uploadRes.link || uploadRes.url || uploadRes.fileName)) {
          uploadedImageLink = uploadRes.fileLink || uploadRes.link || uploadRes.url || uploadRes.fileName;
        }
      } catch (err) {
        console.warn('File upload endpoint failed, proceeding with direct payload:', err.message);
      }
    }

    const payload = {
      titleUz: formData.title.uz,
      titleRu: formData.title.ru || formData.title.uz,
      titleEn: formData.title.en || formData.title.uz,
      descriptionUz: formData.description.uz,
      descriptionRu: formData.description.ru || formData.description.uz,
      descriptionEn: formData.description.en || formData.description.uz,
      status: 'ACTIVE'
    };

    if (imageFile) {
      payload.image = imageFile;
    } else if (uploadedImageLink) {
      payload.image = uploadedImageLink;
      payload.imageLink = uploadedImageLink;
    }

    try {
      if (editMode && selectedItem) {
        try {
          await dormitoriesAPI.update(selectedItem.id, payload);
        } catch (err) {
          console.warn('API update failed, saving locally:', err.message);
        }

        const local = getLocalItems();
        const updatedLocal = local.map(l => {
          if (String(l.id) === String(selectedItem.id)) {
            return { ...l, ...payload, id: l.id };
          }
          return l;
        });
        if (!local.some(l => String(l.id) === String(selectedItem.id))) {
          updatedLocal.push({ id: selectedItem.id, ...payload });
        }
        setLocalItems(updatedLocal);
        showNotification("Turar joy ma'lumotlari yangilandi");
      } else {
        let created = null;
        try {
          created = await dormitoriesAPI.create(payload);
        } catch (err) {
          console.warn('API create failed, saving locally:', err.message);
        }

        const newItemId = created?.id || created?.data?.id || `dorm-${Date.now()}`;
        const newLocalItem = {
          id: newItemId,
          ...payload,
          image: imageFile ? URL.createObjectURL(imageFile) : uploadedImageLink
        };

        const local = getLocalItems();
        setLocalItems([newLocalItem, ...local]);
        showNotification("Yangi turar joy muvaffaqiyatli qo'shildi");
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (err) {
      showNotification("Saqlashda xatolik: " + err.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      try {
        await dormitoriesAPI.delete(selectedItem.id);
      } catch (err) {
        console.warn('API delete failed, removing locally:', err.message);
      }

      const local = getLocalItems();
      const updatedLocal = local.filter(l => String(l.id) !== String(selectedItem.id));
      setLocalItems(updatedLocal);

      setItemsList(itemsList.filter(i => i.id !== selectedItem.id));
      setDeleteModalOpen(false);
      setSelectedItem(null);
      showNotification("Turar joy muvaffaqiyatli o'chirildi");
    } catch (err) {
      showNotification("O'chirishda xatolik: " + err.message, 'error');
    }
  };

  const filteredItems = itemsList.filter(item => {
    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return title.includes(query) || desc.includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 ${notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'} text-white shadow-xl rounded-xl px-5 py-3 flex items-center gap-3 animate-fade-in z-[70]`}>
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Talabalar turar joyi boshqaruvi</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Dormitory REST API (/api/dormitories) orqali yotoqxona va turar joylarni boshqarish
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Yangi turar joy qo'shish</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Sarlavha yoki tavsif bo'yicha qidirish..."
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <Loader2 className="w-8 h-8 text-[#0eb99c] animate-spin mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ma'lumotlar yuklanmoqda...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <Home className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Turar joy topilmadi</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mb-6">
            Hozircha hech qanday talabalar turar joyi mavjud emas. Yangi turar joy qo'shish uchun tugmani bosing.
          </p>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Qo'shish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image & Status Badge */}
              <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md ${
                      item.active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-slate-500/90 text-white'
                    }`}
                  >
                    {item.active ? 'FAOL' : 'INAKTIV'}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg line-clamp-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {item.description || "Tavsif berilmagan."}
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    title={item.active ? "Inaktiv qilish" : "Faol qilish"}
                    className={`p-2 rounded-xl transition-colors ${
                      item.active
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedItem(item); setViewModalOpen(true); }}
                      className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                      title="Ko'rish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(item); setDeleteModalOpen(true); }}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 rounded-xl transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal (Matching Swagger API: titleUz, titleRu, titleEn, descriptionUz, descriptionRu, descriptionEn, image) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 my-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? "Turar joyni tahrirlash" : "Yangi turar joy qo'shish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 px-6 pt-3 gap-2">
              {[
                { code: 'uz', label: "O'zbekcha" },
                { code: 'ru', label: "Русский" },
                { code: 'en', label: "English" }
              ].map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-xl transition-colors ${
                    activeLang === lang.code
                      ? 'bg-white dark:bg-slate-800 text-[#0eb99c] border-t-2 border-[#0eb99c] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nomi ({activeLang.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  required={activeLang === 'uz'}
                  value={formData.title[activeLang]}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, [activeLang]: e.target.value }
                  })}
                  placeholder="Masalan: 1-sonli Talabalar turar joyi"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tavsif / Sharoitlar ({activeLang.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={formData.description[activeLang]}
                  onChange={(e) => setFormData({
                    ...formData,
                    description: { ...formData.description, [activeLang]: e.target.value }
                  })}
                  placeholder="Yotoqxona haqida ma'lumot, qulayliklar va tartiblar..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Rasm yuklash (image)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#0eb99c]/10 file:text-[#0eb99c] hover:file:bg-[#0eb99c]/20"
                  />
                </div>
                {imageFile && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                    Tanlangan fayl: {imageFile.name}
                  </p>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  {editMode ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="relative aspect-[16/9] w-full bg-slate-900">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-900/60 text-white hover:bg-slate-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedItem.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                {selectedItem.description || "Tavsif mavjud emas."}
              </p>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-medium"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700">
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
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Siz rostdan ham <span className="font-semibold text-slate-800 dark:text-slate-200">"{selectedItem.title}"</span> turar joyini o'chirmoqchimisiz?
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
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
