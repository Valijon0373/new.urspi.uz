import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Check, Trash2, X, Loader2 } from 'lucide-react';
import { photoGalleriesAPI, filesAPI, getFileUrl } from '../../api';

export default function GalleryAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const fetchPhotos = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await photoGalleriesAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || res?.content || []);
    } catch (err) {
      console.warn('Error fetching gallery photos:', err.message);
    }

    setPhotos(apiData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Iltimos, rasm faylini tanlang");
      return;
    }
    setSubmitting(true);
    try {
      let uploadedFileName = '';
      try {
        const fileRes = await filesAPI.upload(selectedFile);
        uploadedFileName = typeof fileRes === 'string' ? fileRes : (fileRes?.url || fileRes?.filePath || fileRes?.fileName || fileRes?.name || fileRes?.path || fileRes?.data);
      } catch (e) {
        console.warn('filesAPI.upload skipped or failed:', e.message);
      }

      const formData = new FormData();
      formData.append('title', title || '');
      formData.append('titleUz', title || '');
      formData.append('titleRu', title || '');
      formData.append('titleEn', title || '');

      if (uploadedFileName && typeof uploadedFileName === 'string') {
        formData.append('photoLink', uploadedFileName);
        formData.append('imageLink', uploadedFileName);
        formData.append('fileLink', uploadedFileName);
        formData.append('photo', uploadedFileName);
        formData.append('image', uploadedFileName);
      }

      formData.append('file', selectedFile);
      formData.append('image', selectedFile);
      formData.append('photo', selectedFile);

      await photoGalleriesAPI.create(formData);

      showNotification("Rasm muvaffaqiyatli yuklandi");
      setIsModalOpen(false);
      setTitle('');
      setSelectedFile(null);
      setPreviewUrl('');
      fetchPhotos();
    } catch (err) {
      console.error('Failed to create gallery photo:', err);
      alert(err.message || "Rasm yuklashda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      if (selectedItem.id) {
        await photoGalleriesAPI.delete(selectedItem.id);
      }
      showNotification("Rasm muvaffaqiyatli o'chirildi");
      setDeleteModalOpen(false);
      setSelectedItem(null);
      fetchPhotos();
    } catch (err) {
      console.error('Failed to delete gallery photo:', err);
      alert(err.message || "Rasmni o'chirishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const getImageSrc = (photo) => {
    if (!photo) return '';
    const raw = photo.photoLink || photo.imageLink || photo.fileLink || photo.attachmentLink || photo.mainImageLink || photo.photoUrl || photo.imageUrl || photo.image || photo.photo || photo.file || photo.url || photo.link || photo.filePath || photo.imagePath || photo.attachmentUrl;
    if (!raw) return '';
    return getFileUrl(raw);
  };

  const getItemTitle = (photo) => {
    if (!photo) return 'Nomsiz rasm';
    const t = photo.titleUz || photo.title || photo.titleRu || photo.titleEn || photo.name || photo.caption || photo.description;
    if (t && typeof t === 'string' && t.trim() !== '') return t;
    return 'Nomsiz rasm';
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Fotogalereya</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Platformadagi barcha rasmlarni boshqarish
          </p>
        </div>
        <button
          onClick={() => {
            setTitle('');
            setSelectedFile(null);
            setPreviewUrl('');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Rasm yuklash</span>
        </button>
      </div>

      {/* Content area */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-[#0eb99c] animate-spin mb-2" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Yuklanmoqda...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha rasmlar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi rasm qo'shish uchun "Rasm yuklash" tugmasini bosing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div key={photo.id || index} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative">
              <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-slate-700 relative">
                <img src={getImageSrc(photo)} alt={getItemTitle(photo)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => { setSelectedItem(photo); setDeleteModalOpen(true); }}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
                <h3 className="font-medium text-slate-800 dark:text-slate-100 line-clamp-1">{getItemTitle(photo)}</h3>
              </div>
            </div>
          ))}
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
              Siz rostdan ham ushbu rasmni o'chirmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                disabled={submitting}
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
              >
                Yo'q
              </button>
              <button 
                onClick={handleDelete} 
                disabled={submitting}
                className="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Ha</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                Yangi rasm yuklash
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Rasm sarlavhasi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Rasm sarlavhasini kiriting"
                  className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Rasm fayli
                </label>

                {previewUrl ? (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 w-full flex justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 px-6 py-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-500" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400 justify-center">
                        <label
                          className="relative cursor-pointer rounded-md font-semibold text-[#0eb99c] hover:text-[#0ca389] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0eb99c] focus-within:ring-offset-2"
                        >
                          <span>Fayl tanlash</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">yoki shu yerga tashlang</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 mt-2">
                        PNG, JPG, WEBP (max. 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Yuklash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
