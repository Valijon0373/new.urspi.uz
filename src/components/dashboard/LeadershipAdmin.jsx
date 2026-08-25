import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2, X, Image as ImageIcon, MapPin, Clock, Mail, Phone, Check, Loader2 } from 'lucide-react';
import rektorImg from '../../assets/men.jpg';
import { leadersAPI, filesAPI, getFileUrl } from '../../api';

export default function LeadershipAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });
  const [leadersList, setLeadersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeLang, setActiveLang] = useState('uz');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    fullName: { uz: '', ru: '', en: '' },
    position: { uz: '', ru: '', en: '' },
    address: { uz: '', ru: '', en: '' },
    reception: { uz: '', ru: '', en: '' },
    email: '',
    phone: '',
    photoLink: ''
  });

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const res = await leadersAPI.getAll();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      const formatted = rawData.map(item => ({
        id: item.id,
        rawItem: item,
        fullName: item.fullNameUz || item.fullName || "Rahbar",
        fullNameUz: item.fullNameUz || item.fullName || "",
        fullNameRu: item.fullNameRu || "",
        fullNameEn: item.fullNameEn || "",
        position: item.positionTitleUz || item.positionTitle || "Lavozim",
        positionUz: item.positionTitleUz || item.positionTitle || "",
        positionRu: item.positionTitleRu || "",
        positionEn: item.positionTitleEn || "",
        address: item.addressUz || item.address || "Urganch shahri",
        addressUz: item.addressUz || item.address || "",
        addressRu: item.addressRu || "",
        addressEn: item.addressEn || "",
        reception: item.receptionTimeUz || item.receptionTime || "09:00 - 17:00",
        receptionUz: item.receptionTimeUz || item.receptionTime || "",
        receptionRu: item.receptionTimeRu || "",
        receptionEn: item.receptionTimeEn || "",
        email: item.email || "info@urspi.uz",
        phone: item.phoneNumber || item.phone || "+998622261840",
        photoLink: item.photoLink || item.photo || "",
        image: getFileUrl(item.photoLink || item.photo) || rektorImg
      }));
      setLeadersList(formatted);
    } catch (e) {
      console.warn('API error in fetchLeaders:', e.message);
      setLeadersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const showNotification = (msg, isError = false) => {
    setNotification({ show: true, message: msg, isError });
    setTimeout(() => {
      setNotification({ show: false, message: '', isError: false });
    }, 5000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.uz || !formData.position.uz) {
      showNotification("F.I.SH va Lavozim (O'zbekcha) kiritilishi shart!", true);
      return;
    }

    setSaving(true);
    try {
      let finalPhotoLink = formData.photoLink;
      if (selectedFile) {
        try {
          const fileRes = await filesAPI.upload(selectedFile);
          finalPhotoLink = fileRes?.link || fileRes?.url || fileRes?.fileName || fileRes || finalPhotoLink;
        } catch (fileErr) {
          console.warn("File upload error:", fileErr);
        }
      }

      const dto = {
        fullNameUz: formData.fullName.uz || '',
        fullNameRu: formData.fullName.ru || '',
        fullNameEn: formData.fullName.en || '',
        fullName: formData.fullName.uz || '',

        positionTitleUz: formData.position.uz || '',
        positionTitleRu: formData.position.ru || '',
        positionTitleEn: formData.position.en || '',
        positionTitle: formData.position.uz || '',

        addressUz: formData.address.uz || '',
        addressRu: formData.address.ru || '',
        addressEn: formData.address.en || '',
        address: formData.address.uz || '',

        receptionTimeUz: formData.reception.uz || '',
        receptionTimeRu: formData.reception.ru || '',
        receptionTimeEn: formData.reception.en || '',
        receptionTime: formData.reception.uz || '',

        email: formData.email || '',
        phoneNumber: formData.phone || '',
        phone: formData.phone || '',
        photoLink: finalPhotoLink || '',
        photo: selectedFile || finalPhotoLink || ''
      };

      if (editMode && selectedPerson) {
        await leadersAPI.update(selectedPerson.id, dto);
        showNotification("Muvaffaqiyatli tahrirlandi.");
      } else {
        await leadersAPI.create(dto);
        showNotification("Muvaffaqiyatli qo'shildi.");
      }
      setIsModalOpen(false);
      fetchLeaders();
    } catch (e) {
      showNotification(e.message || "Xatolik yuz berdi", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedPerson) {
      try {
        await leadersAPI.delete(selectedPerson.id);
        showNotification("Muvaffaqiyatli o'chirildi");
        fetchLeaders();
      } catch (e) {
        showNotification(e.message || "O'chirishda xatolik", true);
      }
    }
    setDeleteModalOpen(false);
  };

  const openEditModal = (person) => {
    setSelectedPerson(person);
    setEditMode(true);
    setSelectedFile(null);
    setPreviewUrl(person.image || '');
    setFormData({
      fullName: { uz: person.fullNameUz || person.fullName, ru: person.fullNameRu || '', en: person.fullNameEn || '' },
      position: { uz: person.positionUz || person.position, ru: person.positionRu || '', en: person.positionEn || '' },
      address: { uz: person.addressUz || person.address, ru: person.addressRu || '', en: person.addressEn || '' },
      reception: { uz: person.receptionUz || person.reception, ru: person.receptionRu || '', en: person.receptionEn || '' },
      email: person.email || '',
      phone: person.phone || '',
      photoLink: person.photoLink || ''
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedPerson(null);
    setEditMode(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData({
      fullName: { uz: '', ru: '', en: '' },
      position: { uz: '', ru: '', en: '' },
      address: { uz: '', ru: '', en: '' },
      reception: { uz: '', ru: '', en: '' },
      email: '',
      phone: '',
      photoLink: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 shadow-xl border rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[70] ${
          notification.isError
            ? 'bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            notification.isError ? 'bg-red-100 dark:bg-red-800 text-red-500' : 'bg-emerald-100 text-emerald-500'
          }`}>
            <Check className="w-5 h-5" />
          </div>
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rahbariyat</h2>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Qo'shish
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-3 text-[#0eb99c]" />
          <p className="text-sm font-medium">Yuklanmoqda...</p>
        </div>
      ) : leadersList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha rahbarlar kiritilmagan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leadersList.map((person) => (
            <div key={person.id} className="w-full bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center transition-all duration-300 hover:shadow-lg">

              {/* Top Gradient Header */}
              <div className="h-24 w-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>

              {/* Avatar */}
              <div className="relative -mt-12 w-24 h-24 rounded-full border-4 border-white dark:border-[#1e293b] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={person.image}
                  alt={person.fullName}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.onerror = null; e.target.src = rektorImg; }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col items-center p-5 text-center flex-1 w-full">
                <h3 className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight mb-1">{person.fullName}</h3>
                <p className="text-[13px] text-[#3b82f6] dark:text-blue-400 font-semibold mb-4">{person.position}</p>

                {/* Contact Info (Compact) */}
                <div className="flex flex-col gap-2 w-full text-left mt-auto bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-2 text-[12px] text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2" title={person.address}>{person.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{person.reception}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{person.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="grid grid-cols-3 gap-2 w-full p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => { setSelectedPerson(person); setViewModalOpen(true); }}
                  className="flex flex-col xl:flex-row items-center justify-center gap-1.5 py-2 px-1 text-[#3b82f6] border border-[#3b82f6]/30 dark:border-[#3b82f6]/40 rounded-lg hover:bg-blue-50 dark:hover:bg-[#3b82f6]/10 transition-colors text-[11px] sm:text-[12px] font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ko'rish</span>
                </button>
                <button
                  onClick={() => openEditModal(person)}
                  className="flex flex-col xl:flex-row items-center justify-center gap-1.5 py-2 px-1 text-[#10b981] border border-[#10b981]/30 dark:border-[#10b981]/40 rounded-lg hover:bg-emerald-50 dark:hover:bg-[#10b981]/10 transition-colors text-[11px] sm:text-[12px] font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Tahrirlash</span>
                </button>
                <button
                  onClick={() => { setSelectedPerson(person); setDeleteModalOpen(true); }}
                  className="flex flex-col xl:flex-row items-center justify-center gap-1.5 py-2 px-1 text-[#ef4444] border border-[#ef4444]/30 dark:border-[#ef4444]/40 rounded-lg hover:bg-red-50 dark:hover:bg-[#ef4444]/10 transition-colors text-[11px] sm:text-[12px] font-semibold"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>O'chirish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row p-5 md:p-7 gap-6 md:gap-10">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image Frame */}
            <div className="w-full md:w-[240px] shrink-0 mt-6 md:mt-0">
              <div className="w-full md:w-[240px] aspect-[4/5] mx-auto rounded-2xl border-[3px] border-[#0c1f4a] dark:border-blue-500 p-1 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                <img src={selectedPerson.image} alt={selectedPerson.fullName} className="w-full h-full object-cover rounded-xl object-top" />
              </div>
            </div>

            {/* Right: Content */}
            <div className="w-full flex flex-col justify-center py-2">
              <div className="mb-6 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50/50 dark:bg-blue-900/30 text-[#3b82f6] border border-blue-200/60 dark:border-blue-800/50 text-[13px] font-semibold mb-3">
                  {selectedPerson.position}
                </span>
                <h2 className="text-[26px] md:text-[32px] font-bold text-[#0c1f4a] dark:text-slate-100 uppercase tracking-tight leading-tight">
                  {selectedPerson.fullName}
                </h2>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#3b82f6] shrink-0 mt-0.5" />
                  <span className="text-base">{selectedPerson.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <span className="text-base">{selectedPerson.reception}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <a href={`mailto:${selectedPerson.email}`} className="text-base hover:text-[#3b82f6] transition-colors">{selectedPerson.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#3b82f6] shrink-0" />
                  <a href={`tel:${selectedPerson.phone}`} className="text-base hover:text-[#3b82f6] transition-colors">{selectedPerson.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Tasdiqlash</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Siz rostdan ham <span className="text-red-500 font-bold">{selectedPerson.fullName}</span> ni o'chirmoqchimisiz?
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? "Rahbarni tahrirlash" : "Rahbar qo'shish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
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
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeLang === lang.id
                      ? 'border-[#0eb99c] text-[#0eb99c]'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Language Dependent Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      F.I.SH ({activeLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.fullName[activeLang]}
                      onChange={e => setFormData({ ...formData, fullName: { ...formData.fullName, [activeLang]: e.target.value } })}
                      placeholder="Masalan: ABDULLAYEV DIYORJON"
                      className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Lavozim ({activeLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.position[activeLang]}
                      onChange={e => setFormData({ ...formData, position: { ...formData.position, [activeLang]: e.target.value } })}
                      placeholder="Masalan: Rektor v.b"
                      className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Manzil ({activeLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.address[activeLang]}
                      onChange={e => setFormData({ ...formData, address: { ...formData.address, [activeLang]: e.target.value } })}
                      placeholder="Masalan: Xorazm viloyati..."
                      className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Qabul vaqti ({activeLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={formData.reception[activeLang]}
                      onChange={e => setFormData({ ...formData, reception: { ...formData.reception, [activeLang]: e.target.value } })}
                      placeholder="Masalan: Seshanba, Juma 14:00 - 16:00"
                      className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Language Independent Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Masalan: mail@urspi.uz"
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Masalan: +998622261840"
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Rasm
                </label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                  <label className="flex-1 flex justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-600 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <div className="text-center flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-slate-400" />
                      <span className="text-sm font-semibold text-[#0eb99c]">
                        {selectedFile ? selectedFile.name : "Rasm tanlash"}
                      </span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-xl transition-colors shadow-sm flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Saqlash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

