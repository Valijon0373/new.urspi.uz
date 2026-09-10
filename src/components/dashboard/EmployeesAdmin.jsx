import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, SlidersHorizontal, Eye, Edit2, Trash2, Download, ChevronDown, X, Upload, Check } from 'lucide-react';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { TbMail } from 'react-icons/tb';
import { FaRegFilePdf } from 'react-icons/fa6';
import { employeesAPI, centersAPI, positionsAPI, getPositionName, getFileUrl } from '../../api';

function CustomPositionDropdown({ positions, value, onChange, activeLang, placeholder = "Lavozimni tanlang" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedPos = positions.find(p => String(p.id) === String(value));
  const selectedLabel = selectedPos ? getPositionName(selectedPos, activeLang, 'Lavozim') : placeholder;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-left text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors flex items-center justify-between cursor-pointer"
      >
        <span className={selectedPos ? "text-slate-800 dark:text-slate-100 font-medium" : "text-slate-400"}>
          {selectedLabel}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 max-h-52 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[150] py-1 divide-y divide-slate-100 dark:divide-slate-700/50 animate-fade-in">
          <div
            onClick={() => { onChange(''); setIsOpen(false); }}
            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${!value ? 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-400'}`}
          >
            {placeholder}
          </div>
          {positions.map(p => {
            const isSelected = String(p.id) === String(value);
            return (
              <div
                key={p.id}
                onClick={() => { onChange(String(p.id)); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-700 dark:text-slate-200'}`}
              >
                <span>{getPositionName(p, activeLang, 'Lavozim')}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EmployeesAdmin() {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [activeLang, setActiveLang] = useState('uz');
  const [centers, setCenters] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [centerId, setCenterId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [formData, setFormData] = useState({
    fullName: { uz: '', ru: '', en: '' },
    position: { uz: '', ru: '', en: '' },
    phone: '+998 ',
    email: '',
    department: '',
  });

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('998')) {
      val = val.substring(3);
    } else if (val.length === 0) {
      setFormData(prev => ({ ...prev, phone: '+998 ' }));
      return;
    }
    val = val.substring(0, 9);
    
    let formatted = '+998 ';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += ' ' + val.substring(2, 5);
    if (val.length > 5) formatted += ' ' + val.substring(5, 7);
    if (val.length > 7) formatted += ' ' + val.substring(7, 9);
    
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const [employeesList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPositions = async () => {
    try {
      const res = await positionsAPI.getAll();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      setPositions(rawData);
      return rawData;
    } catch (e) {
      console.warn('Failed to fetch positions:', e.message);
      setPositions([]);
      return [];
    }
  };

  const fetchCenters = async () => {
    let rawData = [];
    try {
      const res = await centersAPI.getAll();
      rawData = Array.isArray(res) ? res : (res?.data || []);
    } catch (e1) {
      try {
        const res = await centersAPI.getLanding(0, 100);
        rawData = res?.data?.content || (Array.isArray(res?.data) ? res.data : []);
      } catch (e2) {
        console.warn('Failed to fetch centers:', e2.message);
      }
    }
    setCenters(rawData);
    return rawData;
  };

  const fetchEmployees = async (loadedCenters = centers) => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await employeesAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || []);
    } catch (e) {
      try {
        const res = await employeesAPI.getLanding(0, 100);
        apiData = res?.data?.content || (Array.isArray(res?.data) ? res.data : []);
      } catch (e2) {
        console.warn('API error in fetchEmployees:', e2.message);
      }
    }

    const cardColors = [
      'from-blue-600 to-indigo-600',
      'from-emerald-600 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-purple-600 to-indigo-600',
      'from-rose-600 to-pink-600'
    ];
    const formatted = apiData.map((emp, idx) => {
      const matchedCenter = loadedCenters.find(c => String(c.id) === String(emp.centerId || emp.center?.id));
      const deptName = emp.center?.nameUz || emp.center?.name || matchedCenter?.nameUz || matchedCenter?.name || emp.department || "Markaz";
      return {
        id: emp.id,
        fullName: emp.fullNameUz || emp.fullName || "Xodim",
        position: emp.positionTitleUz || emp.positionTitle || "Xodim",
        phone: emp.phoneNumber || emp.phone || "+998 90 123 45 67",
        email: emp.email || "info@urspi.uz",
        department: deptName,
        centerId: emp.centerId || emp.center?.id || matchedCenter?.id || '',
        image: getFileUrl(emp.photoLink || emp.photo || emp.image),
        color: cardColors[idx % cardColors.length],
        rawItem: emp
      };
    });
    setEmployeesList(formatted);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const loadedCenters = await fetchCenters();
      await fetchPositions();
      fetchEmployees(loadedCenters);
    };
    init();

    const handlePositionsUpdate = async () => {
      await fetchPositions();
    };
    window.addEventListener('urspi_positions_updated', handlePositionsUpdate);
    return () => window.removeEventListener('urspi_positions_updated', handlePositionsUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  const handleSave = async () => {
    const missingFields = [];

    // 1. Photo validation
    if (!photoFile && !imagePreview) {
      missingFields.push("Rasm");
    }

    // 2. Full Name validation
    const fullNameUz = formData.fullName.uz?.trim() || formData.fullName.ru?.trim() || formData.fullName.en?.trim();
    if (!fullNameUz) {
      missingFields.push("F.I.O");
    }
    const fullNameRu = formData.fullName.ru?.trim() || fullNameUz || '';
    const fullNameEn = formData.fullName.en?.trim() || fullNameUz || '';

    // 3. Position validation
    const posUz = formData.position.uz?.trim() || formData.position.ru?.trim() || formData.position.en?.trim();
    if (!posUz) {
      missingFields.push("Lavozimi");
    }
    const posRu = formData.position.ru?.trim() || posUz || '';
    const posEn = formData.position.en?.trim() || posUz || '';

    // 4. Phone validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 12) {
      missingFields.push("Telefon raqami");
    }

    // 5. Email validation
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      missingFields.push("E-pochtasi");
    }

    // 6. Center ID validation
    if (!centerId) {
      missingFields.push("Bo'limi / Markazi");
    }

    // Show alert and notification if any mandatory fields are missing
    if (missingFields.length > 0) {
      const msg = `Ushbu maydonlar majburiy, iltimos to'ldiring: ${missingFields.join(', ')}`;
      alert(msg);
      showNotification(msg);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('fullNameUz', fullNameUz);
      fd.append('fullNameRu', fullNameRu);
      fd.append('fullNameEn', fullNameEn);
      fd.append('fullName', fullNameUz);
      fd.append('phoneNumber', phoneDigits.startsWith('998') ? `+${phoneDigits}` : `+998${phoneDigits}`);
      fd.append('email', formData.email.trim());
      fd.append('positionTitleUz', posUz);
      fd.append('positionTitleRu', posRu);
      fd.append('positionTitleEn', posEn);
      if (selectedPositionId) {
        fd.append('positionId', String(selectedPositionId));
      }
      fd.append('centerId', centerId);
      if (photoFile) fd.append('photo', photoFile);
      if (cvFile) fd.append('cv', cvFile);

      if (editMode && selectedItem) {
        await employeesAPI.update(selectedItem.id, fd);
      } else {
        await employeesAPI.create(fd);
      }
    } catch (apiErr) {
      console.warn('Backend API save failed:', apiErr.message);
      showNotification(apiErr.message || "Backendga saqlashda xatolik yuz berdi");
      return;
    }

    setSearchTerm('');
    setSelectedDepartment('');
    showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
    setIsModalOpen(false);
    setPhotoFile(null);
    setCvFile(null);
    fetchEmployees();
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await employeesAPI.delete(selectedItem.id);
      showNotification("Muvaffaqiyatli o'chirildi");
      setDeleteModalOpen(false);
      fetchEmployees();
    } catch (e) {
      console.warn("API delete failed:", e.message);
      showNotification(e.message || "O'chirishda xatolik yuz berdi");
    }
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setFormData({
      fullName: {
        uz: item.rawItem?.fullNameUz || item.fullName || '',
        ru: item.rawItem?.fullNameRu || '',
        en: item.rawItem?.fullNameEn || ''
      },
      position: {
        uz: item.rawItem?.positionTitleUz || item.position || '',
        ru: item.rawItem?.positionTitleRu || '',
        en: item.rawItem?.positionTitleEn || ''
      },
      phone: item.phone || '+998 ',
      email: item.email || '',
      department: item.department || '',
    });

    const posId = item.rawItem?.positionId || item.rawItem?.position?.id;
    const currentTitleUz = item.rawItem?.positionTitleUz || item.position || '';
    const matchedPos = positions.find(p => String(p.id) === String(posId)) || 
                       positions.find(p => (p.nameUz || p.titleUz || p.name || p.title || '').toLowerCase() === currentTitleUz.toLowerCase());
    if (matchedPos) {
      setSelectedPositionId(String(matchedPos.id));
    } else {
      setSelectedPositionId('');
    }

    setCenterId(item.centerId || item.rawItem?.centerId || item.rawItem?.center?.id || '');
    setImagePreview(item.image || null);
    setPhotoFile(null);
    setCvFile(null);
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setSelectedPositionId('');
    setFormData({
      fullName: { uz: '', ru: '', en: '' },
      position: { uz: '', ru: '', en: '' },
      phone: '+998 ',
      email: '',
      department: '',
    });
    setCenterId('');
    setImagePreview(null);
    setPhotoFile(null);
    setCvFile(null);
    setActiveLang('uz');
    setIsModalOpen(true);
  };

  const filteredEmployees = employeesList.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !selectedDepartment || employee.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    return matchesSearch && matchesDept;
  });

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
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full h-12 px-5 pr-10 rounded-full border-2 border-blue-100 dark:border-blue-900/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Barcha bo'lim va markazlar</option>
            {centers.map(c => (
              <option key={c.id} value={c.nameUz || c.name}>
                {c.nameUz || c.name || "Markaz/Bo'lim"}
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Xodimni qidirish..." 
            className="w-full h-12 pl-12 pr-4 rounded-full border-2 border-blue-100 dark:border-blue-900/50 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table section */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Ma'lumotlar yuklanmoqda...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="py-16 text-center text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          Xodimlar topilmadi
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-slate-200">
                  <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold w-16 text-center">№</th>
                  <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold text-center w-20">Rasm</th>
                  <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Bo'lim / Markaz</th>
                  <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Lavozim</th>
                  <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">F.I.O</th>
                  <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold text-center w-24">Amallar</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400 font-medium text-center">{index + 1}</td>
                    <td className="border border-slate-200 dark:border-slate-700 p-0 text-center w-20">
                      <div className="w-20 h-24 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto overflow-hidden">
                        {employee.image ? (
                          <img src={employee.image} alt={employee.fullName} className="w-full h-full object-cover object-top" />
                        ) : (
                          <span className="text-sm font-semibold text-slate-400">
                            {employee.fullName.charAt(0)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400 font-medium">{employee.department}</td>
                    <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400 font-medium">{employee.position}</td>
                    <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-800 dark:text-slate-200 font-bold">{employee.fullName}</td>
                    <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-center relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(employee.id);
                        }}
                        className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === employee.id && (
                        <div 
                          ref={menuRef}
                          className="absolute right-[80%] top-1/2 -translate-y-1/2 mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in"
                          style={{ animationDuration: '0.2s' }}
                        >
                          <button 
                            onClick={() => { setSelectedItem(employee); setActiveMenuId(null); setViewModalOpen(true); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ko'rish
                          </button>
                          <button 
                            onClick={() => { openEditModal(employee); setActiveMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Tahrirlash
                          </button>
                          <button 
                            onClick={() => { setSelectedItem(employee); setActiveMenuId(null); setDeleteModalOpen(true); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            O'chirish
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                        const file = e.target.files[0];
                        setPhotoFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-1" />
                      <span className="text-[10px] text-slate-500 group-hover:text-blue-500 font-medium text-center leading-tight">Rasm yuklash <span className="text-red-500">*</span></span>
                    </>
                  )}
                </label>
              </div>

              {/* Language Tabs */}
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
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

              {/* Form Fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    F.I.O ({activeLang.toUpperCase()}) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaRegUserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={formData.fullName[activeLang]}
                      onChange={e => setFormData({ ...formData, fullName: { ...formData.fullName, [activeLang]: e.target.value } })}
                      placeholder="To'liq ism-sharifi" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Lavozimi <span className="text-red-500">*</span>
                  </label>
                  <div className="mb-2">
                    <CustomPositionDropdown 
                      positions={positions}
                      value={selectedPositionId}
                      activeLang={activeLang}
                      onChange={(val) => {
                        setSelectedPositionId(val);
                        const posObj = positions.find(p => String(p.id) === String(val));
                        if (posObj) {
                          setFormData(prev => ({
                            ...prev,
                            position: {
                              uz: posObj.nameUz || posObj.titleUz || posObj.name || posObj.title || '',
                              ru: posObj.nameRu || posObj.titleRu || posObj.name || posObj.title || '',
                              en: posObj.nameEn || posObj.titleEn || posObj.name || posObj.title || ''
                            }
                          }));
                        }
                      }}
                    />
                  </div>
                  <input 
                    type="text" 
                    value={formData.position[activeLang] || ''}
                    onChange={e => setFormData({ ...formData, position: { ...formData.position, [activeLang]: e.target.value } })}
                    placeholder={`Lavozim nomi (${activeLang.toUpperCase()})`} 
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Telefon raqami <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+998 94 237 03 73" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    E-pochtasi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <TbMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="misol@urspi.uz" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    CV yuklash (PDF) <span className="text-xs text-slate-400 font-normal">(ixtiyoriy)</span>
                  </label>
                  <div className="relative">
                    <FaRegFilePdf className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCvFile(e.target.files[0]);
                        }
                      }}
                      className="w-full h-11 pl-11 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Bo'limi / Markazi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={centerId}
                      onChange={e => {
                        const id = e.target.value;
                        setCenterId(id);
                        const sel = centers.find(c => String(c.id) === String(id));
                        setFormData({ ...formData, department: sel?.nameUz || sel?.name || '' });
                      }}
                      className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Bo'lim yoki markazni tanlang</option>
                      {centers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.nameUz || c.name || "Markaz/Bo'lim"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
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
