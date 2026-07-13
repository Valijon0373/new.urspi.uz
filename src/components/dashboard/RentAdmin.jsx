import React, { useState } from 'react';
import { Plus, Check, Trash2, X, Edit2, Key, MapPin, DollarSign, Image as ImageIcon, Search } from 'lucide-react';

export default function RentAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [activeLang, setActiveLang] = useState('uz');
  const [formData, setFormData] = useState({
    title: { uz: '', ru: '', en: '' },
    address: { uz: '', ru: '', en: '' },
    price: { uz: '', ru: '', en: '' },
    contact: '',
    images: []
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const [mockRents, setMockRents] = useState([
    { 
      id: 1, 
      title: { uz: "Talabalar uchun ijaraga uy", ru: "Квартира в аренду для студентов", en: "Apartment for rent for students" }, 
      address: { uz: "Urganch shahri, Al-Xorazmiy ko'chasi 15-uy", ru: "г. Ургенч, ул. Аль-Хорезми 15", en: "Urgench city, Al-Khwarizmi street 15" }, 
      price: { uz: "1 000 000 so'm / oyiga", ru: "1 000 000 сум / в месяц", en: "1 000 000 UZS / per month" },
      contact: "+998 90 123 45 67",
      date: "2023-09-01",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1de2d1f054?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1556910103-1c02745a828?auto=format&fit=crop&q=80&w=800"
      ]
    }
  ]);

  const filteredRents = mockRents.filter(rent => {
    const titleObj = rent.title || {};
    const titleUz = (titleObj.uz || titleObj).toLowerCase?.() || '';
    const titleRu = (titleObj.ru || '').toLowerCase();
    const titleEn = (titleObj.en || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = titleUz.includes(searchLower) || titleRu.includes(searchLower) || titleEn.includes(searchLower);
    const matchesDateFrom = dateFrom ? rent.date >= dateFrom : true;
    const matchesDateTo = dateTo ? rent.date <= dateTo : true;
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
  };

  const handleDelete = () => {
    setDeleteModalOpen(false);
    if (selectedItem) {
      setMockRents(mockRents.filter(rent => rent.id !== selectedItem.id));
      showNotification("Muvaffaqiyatli o'chirildi");
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      title: { uz: '', ru: '', en: '' },
      address: { uz: '', ru: '', en: '' },
      price: { uz: '', ru: '', en: '' },
      contact: '',
      images: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormData({
      title: { uz: item.title, ru: item.title, en: item.title },
      address: { uz: item.address, ru: item.address, en: item.address },
      price: { uz: item.price, ru: item.price, en: item.price },
      contact: item.contact,
      images: item.images || []
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3 z-[70]">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <span className="text-slate-800 dark:text-slate-100 font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Talabalarga ijara</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
            Ijaraga beriladigan uylar va kvartiralar
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Ijara qo'shish</span>
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
              placeholder="Nomi bo'yicha qidirish..."
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
      {filteredRents.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Hozircha ma'lumotlar yo'q</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Yangi ijara qo'shish uchun "Ijara qo'shish" tugmasini bosing yoki qidiruvni bekor qiling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRents.map((rent) => (
            <div key={rent.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-700 relative shrink-0">
                {rent.images && rent.images.length > 0 ? (
                  <>
                    <img src={rent.images[0]} alt={rent.title} className="w-full h-full object-cover" />
                    {rent.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                        + {rent.images.length - 1} rasm
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">Rasm yo'q</div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs text-slate-400 mb-2">{rent.date}</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 line-clamp-1">{rent.title.uz || rent.title}</h3>
                <div className="space-y-2 mb-4 flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> 
                    <span className="line-clamp-2">{rent.address.uz || rent.address}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 shrink-0 text-emerald-500" /> 
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{rent.price.uz || rent.price}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-2">
                    <span className="font-medium">Tel:</span> {rent.contact}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                  <button 
                    onClick={() => openEditModal(rent)}
                    className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-sm font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Tahrirlash
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(rent); setDeleteModalOpen(true); }}
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

      {/* Delete Modal */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
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
              Siz rostdan ham ushbu ma'lumotni o'chirmoqchimisiz?
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
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                {editMode ? 'Ijarani tahrirlash' : "Yangi ijara qo'shish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                {[
                  { id: 'uz', label: "O'zbekcha" },
                  { id: 'ru', label: 'Русский' },
                  { id: 'en', label: 'English' }
                ].map(lang => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setActiveLang(lang.id)}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-2.5 ${
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
                  uz: { titleLabel: "Sarlavha", titlePl: "Masalan: Qizlar uchun kvartira", addressLabel: "Manzil", addressPl: "Uy manzili", priceLabel: "Narxi", pricePl: "Masalan: 50$ oyiga" },
                  ru: { titleLabel: "Заголовок", titlePl: "Например: Квартира для девочек", addressLabel: "Адрес", addressPl: "Адрес дома", priceLabel: "Цена", pricePl: "Например: 50$ в месяц" },
                  en: { titleLabel: "Title", titlePl: "For example: Apartment for girls", addressLabel: "Address", addressPl: "House address", priceLabel: "Price", pricePl: "For example: $50 per month" }
                }[activeLang];

                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.titleLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.title[activeLang]}
                        onChange={e => setFormData({...formData, title: { ...formData.title, [activeLang]: e.target.value }})}
                        placeholder={text.titlePl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.addressLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.address[activeLang]}
                        onChange={e => setFormData({...formData, address: { ...formData.address, [activeLang]: e.target.value }})}
                        placeholder={text.addressPl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {text.priceLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.price[activeLang]}
                        onChange={e => setFormData({...formData, price: { ...formData.price, [activeLang]: e.target.value }})}
                        placeholder={text.pricePl}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors"
                      />
                    </div>
                  </div>
                );
              })()}

              {activeLang === 'uz' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 mt-4">
                    Aloqa uchun raqam
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                    placeholder="+998 XX XXX XX XX"
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] transition-colors mb-4"
                  />
                </div>
              )}

              {activeLang === 'uz' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Uy rasmlari (ko'pi bilan 10 ta)
                </label>
                <div className="flex flex-wrap gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      <img src={img} alt={`upload-${index}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        title="Rasmni o'chirish"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 10 && (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-[#0eb99c] transition-colors">
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-semibold">Yana</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>

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
