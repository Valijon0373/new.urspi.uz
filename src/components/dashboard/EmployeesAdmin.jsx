import React, { useState } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Download, ChevronDown, X, Upload, Check } from 'lucide-react';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { TbMail } from 'react-icons/tb';
import { FaRegFilePdf } from 'react-icons/fa6';

export default function EmployeesAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [imagePreview, setImagePreview] = useState(null);
  const [phone, setPhone] = useState('+998 ');

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('998')) {
      val = val.substring(3);
    } else if (val.length === 0) {
      setPhone('+998 ');
      return;
    }
    val = val.substring(0, 9);
    
    let formatted = '+998 ';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += ' ' + val.substring(2, 5);
    if (val.length > 5) formatted += ' ' + val.substring(5, 7);
    if (val.length > 7) formatted += ' ' + val.substring(7, 9);
    
    setPhone(formatted);
  };

  const mockEmployees = [
    { 
      id: 1, 
      fullName: "Davlatmuratov Valijon", 
      position: "Dasturchi", 
      color: "from-blue-500 to-purple-500",
      phone: "+998 94 237 03 73",
      email: "valijon@urspi.uz",
      department: "Axborot texnologiyalari markazi"
    },
    { 
      id: 2, 
      fullName: "Davlatmuratov Valijon", 
      position: "Bosh hisobchi", 
      color: "from-emerald-500 to-teal-500",
      phone: "+998 90 123 45 67",
      email: "bux@urspi.uz",
      department: "Bugalteriya"
    },
    { 
      id: 3, 
      fullName: "Davlatmuratov Valijon", 
      position: "Frontend Dasturchi", 
      color: "from-orange-500 to-rose-500",
      phone: "+998 91 234 56 78",
      email: "frontend@urspi.uz",
      department: "Axborot texnologiyalari markazi"
    },
    { 
      id: 4, 
      fullName: "Davlatmuratov Valijon", 
      position: "Backend Dasturchi", 
      color: "from-indigo-500 to-blue-500",
      phone: "+998 93 456 78 90",
      email: "backend@urspi.uz",
      department: "Axborot texnologiyalari markazi"
    },
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
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

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

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Xodimlar Ro'yxati</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Qo'shish
          </button>
        </div>
      </div>

      {/* Search and Filter section */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Department Filter */}
        <div className="relative w-full md:w-[300px]">
          <select className="w-full h-12 px-5 pr-10 rounded-full border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors appearance-none cursor-pointer">
            <option value="">Barcha bo'limlar</option>
            <option value="bugalteriya">Bugalteriya</option>
            <option value="rttm">RTTM</option>
            <option value="oquv">O'quv bo'limi</option>
            <option value="kadrlar">Kadrlar bo'limi</option>
          </select>
          <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Xodimni qidirish..." 
            className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-blue-100 dark:border-blue-900/50 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none transition-colors"
          />
        </div>

        {/* Search Button */}
        <button className="w-full md:w-auto h-12 px-8 rounded-full border-2 border-blue-500 text-blue-500 font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors whitespace-nowrap">
          Qidirish
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-4">
        {mockEmployees.map((employee) => (
          <div key={employee.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {/* Top Color Banner */}
            <div className={`h-24 bg-gradient-to-r ${employee.color}`}></div>
            
            {/* Card Body */}
            <div className="relative pt-12 pb-6 px-6 text-center flex-1 flex flex-col">
              {/* Avatar */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                  {/* Placeholder for avatar */}
                  <span className="text-2xl font-bold text-slate-400">
                    {employee.fullName.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 leading-tight min-h-[44px] flex items-center justify-center">
                {employee.fullName}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 flex-1">
                {employee.position}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                <button 
                  onClick={() => { setSelectedItem(employee); setViewModalOpen(true); }}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-[13px] font-medium text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ko'rish
                </button>
                <button 
                  onClick={() => openEditModal(employee)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-[13px] font-medium text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Tahrirlash
                </button>
                <button 
                  onClick={() => { setSelectedItem(employee); setDeleteModalOpen(true); }}
                  className="flex-1 flex justify-center items-center gap-1.5 py-2 px-1 text-[13px] font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
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
                {selectedItem.image ? (
                  <img src={selectedItem.image} alt={selectedItem.fullName} className="w-full h-full object-cover rounded-xl object-top" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-6xl font-bold text-slate-300 dark:text-slate-600">
                      {selectedItem.fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right: Content */}
            <div className="w-full flex flex-col justify-center py-2">
              <div className="mb-6 text-center md:text-left">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50/50 dark:bg-blue-900/30 text-[#3b82f6] border border-blue-200/60 dark:border-blue-800/50 text-[13px] font-semibold mb-3">
                  {selectedItem.position}
                </span>
                <h2 className="text-[26px] md:text-[32px] font-bold text-[#0c1f4a] dark:text-slate-100 uppercase tracking-tight leading-tight">
                  {selectedItem.fullName}
                </h2>
              </div>
              
              <div className="space-y-4 text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Bo'lim</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedItem.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <FiPhone className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Telefon</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedItem.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <TbMail className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedItem.email}</p>
                  </div>
                </div>
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
              Siz rostdan ham <span className="text-red-500 font-bold">{selectedItem.fullName}</span> ni o'chirmoqchimisiz?
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {editMode ? "Xodim ma'lumotlarini tahrirlash" : "Yangi xodim qo'shish"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Image Upload */}
              <div className="flex flex-col items-center justify-center gap-2">
                <label className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all overflow-hidden relative group">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1" />
                      <span className="text-[10px] text-slate-500 group-hover:text-blue-500 font-medium text-center leading-tight">Rasm yuklash</span>
                    </>
                  )}
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">F.I.O</label>
                  <div className="relative">
                    <FaRegUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      defaultValue={selectedItem?.fullName || ''}
                      placeholder="To'liq ism-sharifi" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefon raqami</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={editMode && selectedItem ? selectedItem.phone : phone}
                      onChange={handlePhoneChange}
                      placeholder="+998 94 237 03 73" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-pochtasi</label>
                  <div className="relative">
                    <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      defaultValue={selectedItem?.email || ''}
                      placeholder="misol@urspi.uz" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CV yuklash (PDF)</label>
                  <div className="relative">
                    <FaRegFilePdf className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="w-full h-11 pl-11 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bo'limi</label>
                  <div className="relative">
                    <select 
                      defaultValue={selectedItem?.department || ''}
                      className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Bo'limni tanlang</option>
                      <option value="Bugalteriya">Bugalteriya</option>
                      <option value="Axborot texnologiyalari markazi">Axborot texnologiyalari markazi</option>
                      <option value="O'quv bo'limi">O'quv bo'limi</option>
                      <option value="Kadrlar bo'limi">Kadrlar bo'limi</option>
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Lavozimi</label>
                  <input 
                    type="text" 
                    defaultValue={selectedItem?.position || ''}
                    placeholder="Masalan: Dasturchi" 
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
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
