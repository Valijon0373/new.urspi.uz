import React, { useState, useEffect } from 'react';
import { FileText, Upload, Plus, Edit2, Trash2, Check, ExternalLink, Download, Search, RefreshCw, GraduationCap, BookOpen, ArrowLeftRight, Award, School } from 'lucide-react';

const INITIAL_DIRECTIONS = [
  { id: '1', code: '5111700', name: "Boshlang'ich ta'lim", type: 'Bakalavr', mode: 'Kunduzgi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Boshlang'ich_ta'lim_qabul_nizomi.pdf" },
  { id: '2', code: '5111300', name: "Ona tili va adabiyoti (Filologiya)", type: 'Bakalavr', mode: 'Kunduzgi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Ona_tili_va_adabiyot_nizomi.pdf" },
  { id: '3', code: '5110600', name: "Tarix o'qish metodikasi", type: 'Bakalavr', mode: 'Kunduzgi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Tarix_oqish_metodikasi.pdf" },
  { id: '4', code: '70110101', name: "Aniq va tabiiy fanlar (Magistratura)", type: 'Magistratura', mode: 'Kunduzgi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Magistratura_nizomi.pdf" },
  { id: '5', code: '5110900', name: "O'qishni ko'chirish va qayta tiklash", type: "O'qishni ko'chirish", mode: 'Kunduzgi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Oqishni_kochirish_tartibi.pdf" },
  { id: '6', code: '5111400', name: "Ikkinchi oliy ta'lim mutaxassisligi", type: 'Ikkinchi Mutaxassislik', mode: 'Sirtqi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Ikkinchi_mutaxassislik_nizomi.pdf" },
  { id: '7', code: '5111500', name: "Texnikum bitiruvchilarini suhbat asosida qabul qilish", type: 'Texnikum bitiruvchilari', mode: 'Kunduzgi', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', fileName: "Texnikum_bitiruvchilari_nizomi.pdf" },
];

const CATEGORIES = [
  { id: 'Bakalavr', label: 'Bakalavr', icon: GraduationCap },
  { id: 'Magistratura', label: 'Magistratura', icon: BookOpen },
  { id: "O'qishni ko'chirish", label: "O'qishni ko'chirish", icon: ArrowLeftRight },
  { id: 'Ikkinchi Mutaxassislik', label: 'Ikkinchi Mutaxassislik', icon: Award },
  { id: 'Texnikum bitiruvchilari', label: 'Texnikum bitiruvchilari', icon: School }
];

export default function AdmissionAdmin({ activeSubCategory }) {
  const [directions, setDirections] = useState(INITIAL_DIRECTIONS);

  const [selectedCat, setSelectedCat] = useState(() => {
    if (activeSubCategory && activeSubCategory !== 'Abituriyent') {
      return activeSubCategory;
    }
    return 'Bakalavr';
  });

  useEffect(() => {
    if (activeSubCategory && activeSubCategory !== 'Abituriyent') {
      setSelectedCat(activeSubCategory);
    }
  }, [activeSubCategory]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Bakalavr',
    mode: 'Kunduzgi',
    pdfUrl: '',
    fileName: ''
  });

  const showNotify = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => setNotification({ show: false, message: '' }), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      code: '',
      name: '',
      type: selectedCat,
      mode: 'Kunduzgi',
      pdfUrl: '',
      fileName: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      type: item.type || 'Bakalavr',
      mode: item.mode || 'Kunduzgi',
      pdfUrl: item.pdfUrl || '',
      fileName: item.fileName || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      setDirections(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
      showNotify("Yo'nalish va PDF hujjat muvaffaqiyatli tahrirlandi!");
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...formData
      };
      setDirections(prev => [newItem, ...prev]);
      showNotify("Yangi yo'nalish va PDF hujjat qo'shildi!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Rostdan ham ushbu yo'nalish va PDF hujjatni o'chirmoqchimisiz?")) {
      setDirections(prev => prev.filter(item => item.id !== id));
      showNotify("Muvaffaqiyatli o'chirildi!");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        pdfUrl: fakeUrl,
        fileName: file.name
      }));
    }
  };

  const filteredDirections = directions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.includes(searchTerm);
    if (!selectedCat || selectedCat === 'All') return matchesSearch;
    return matchesSearch && item.type === selectedCat;
  });

  return (
    <div className="max-w-[1280px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0eb99c]" />
            <span>Abituriyent Bo'limi va PDF Hujjatlar Boshqaruvi</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bakalavr, Magistratura, O'qishni ko'chirish va boshqa yo'nalishlar bo'yicha PDF yo'riqnoma hujjatlarini boshqarish.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0eb99c] hover:bg-[#0ca389] text-white font-bold rounded-xl text-sm transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Hujjat Qo'shish</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-[#0eb99c] text-white shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification Toast */}
      {notification.show && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-500" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Yo'nalish nomi yoki kodi bo'yicha qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb99c]/20 focus:border-[#0eb99c] text-slate-800 dark:text-slate-100"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Jami: {filteredDirections.length} ta yo'nalish ({selectedCat})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Kodi</th>
                <th className="px-6 py-4">Yo'nalish / Hujjat nomi</th>
                <th className="px-6 py-4">Toifasi / Shakli</th>
                <th className="px-6 py-4">Biriktirilgan PDF Fayl</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-sm text-slate-700 dark:text-slate-300">
              {filteredDirections.length > 0 ? (
                filteredDirections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-[#0eb99c]">{item.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.type} - {item.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.pdfUrl ? (
                        <a
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/50"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="max-w-[180px] truncate">{item.fileName || 'Faylni ochish (.pdf)'}</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">PDF biriktirilmagan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-400 dark:border-emerald-500/60 hover:bg-emerald-100/80 rounded-xl transition duration-200"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400 bg-white dark:bg-slate-800 border border-rose-400 dark:border-rose-500/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>O'chirish</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Ushbu toifada ma'lumotlar mavjud emas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-100 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingItem ? "Yo'nalish va PDFni tahrirlash" : "Yangi Yo'nalish va PDF qo'shish"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Yo'nalish / Hujjat kodi</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: 5111700"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0eb99c]/20 focus:border-[#0eb99c] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Yo'nalish / Hujjat nomi</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: Boshlang'ich ta'lim"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0eb99c]/20 focus:border-[#0eb99c] text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Bo'lim (Toifa)</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="Bakalavr">Bakalavr</option>
                    <option value="Magistratura">Magistratura</option>
                    <option value="O'qishni ko'chirish">O'qishni ko'chirish</option>
                    <option value="Ikkinchi Mutaxassislik">Ikkinchi Mutaxassislik</option>
                    <option value="Texnikum bitiruvchilari">Texnikum bitiruvchilari</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Ta'lim shakli</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="Kunduzgi">Kunduzgi</option>
                    <option value="Sirtqi">Sirtqi</option>
                    <option value="Kechki">Kechki</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">PDF Fayl havola (URL) yoki biriktirish</label>
                <input
                  type="text"
                  placeholder="https://... (yoki quyida fayl tanlang)"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdfUrl: e.target.value, fileName: e.target.value ? 'Hujjat_pdf.pdf' : '' }))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0eb99c]/20 focus:border-[#0eb99c] text-slate-800 dark:text-slate-100 text-xs mb-2"
                />
                
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition">
                    <Upload className="w-4 h-4 text-[#0eb99c]" />
                    <span>Fayl tanlash (.pdf)</span>
                    <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {formData.fileName && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium truncate">
                    Tanlangan fayl: {formData.fileName}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0eb99c] hover:bg-[#0ca389] text-white font-bold rounded-xl text-xs transition"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
