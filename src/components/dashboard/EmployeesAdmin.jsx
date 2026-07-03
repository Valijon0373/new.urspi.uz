import React, { useState } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Download, ChevronDown, X, Upload } from 'lucide-react';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { TbMail } from 'react-icons/tb';
import { FaRegFilePdf } from 'react-icons/fa6';

export default function EmployeesAdmin() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
      color: "from-blue-500 to-purple-500" 
    },
    { 
      id: 2, 
      fullName: "Davlatmuratov Valijon", 
      position: "Bosh hisobchi", 
      color: "from-emerald-500 to-teal-500" 
    },
    { 
      id: 3, 
      fullName: "Davlatmuratov Valijon", 
      position: "Frontend Dasturchi", 
      color: "from-orange-500 to-rose-500" 
    },
    { 
      id: 4, 
      fullName: "Davlatmuratov Valijon", 
      position: "Backend Dasturchi", 
      color: "from-indigo-500 to-blue-500" 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Xodimlar Ro'yxati</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
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
          <div key={employee.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
            {/* Top Color Banner */}
            <div className={`h-24 bg-gradient-to-r ${employee.color}`}></div>
            
            {/* Card Body */}
            <div className="relative pt-12 pb-6 px-6 text-center">
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
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                {employee.position}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-5">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[13px] font-medium text-blue-500 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  Ko'rish
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[13px] font-medium text-emerald-500 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Tahrirlash
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-[13px] font-medium text-red-500 border border-red-100 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Yangi xodim qo'shish</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
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
                      <span className="text-[10px] text-slate-500 group-hover:text-blue-500 font-medium">Rasm yuklash</span>
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
                    <input type="text" placeholder="To'liq ism-sharifi" className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefon raqami</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={phone}
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
                    <input type="email" placeholder="misol@urspi.uz" className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CV yuklash (PDF)</label>
                  <div className="relative">
                    <FaRegFilePdf className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="file" accept=".pdf" className="w-full h-11 pl-11 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bo'limi</label>
                  <div className="relative">
                    <select className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer">
                      <option value="">Bo'limni tanlang</option>
                      <option value="bugalteriya">Bugalteriya</option>
                      <option value="rttm">RTTM</option>
                      <option value="oquv">O'quv bo'limi</option>
                      <option value="kadrlar">Kadrlar bo'limi</option>
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Lavozimi</label>
                  <input type="text" placeholder="Masalan: Dasturchi" className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-lg transition-colors"
                onClick={() => {
                  // Simulate save
                  setIsAddModalOpen(false);
                }}
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
