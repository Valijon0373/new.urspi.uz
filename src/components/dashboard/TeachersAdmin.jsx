import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, Eye, Edit2, Trash2, ChevronDown, X, Upload, Check, BookOpen, Globe, FileDown, GraduationCap } from 'lucide-react';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { TbMail } from 'react-icons/tb';
import { FaRegFilePdf } from 'react-icons/fa6';
import { teachersAPI, facultiesAPI, departmentsAPI, getFileUrl } from '../../api';


export default function TeachersAdmin() {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [articleDeleteModalOpen, setArticleDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [imagePreview, setImagePreview] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Filter states
  const [filterFaculty, setFilterFaculty] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [fullNameUz, setFullNameUz] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const [articles, setArticles] = useState({
    1: [
      { id: 1, title: "Boshlang'ich sinflarda pedagogik texnologiyalar", type: "Xalqaro maqola", journal: "Science and Education", year: "2024", url: "https://doi.org/10.37547/su-ed-01", file: null },
      { id: 2, title: "Ta'lim sifatini oshirish tamoyillari", type: "OAK maqolasi", journal: "Pedagogika jurnali", year: "2023", url: "", file: null }
    ],
    2: [
      { id: 1, title: "Matematik modellashtirish asoslari", type: "Mahalliy maqola", journal: "UrSPI Ilmiy Xabarlari", year: "2025", url: "https://example.com/math-article", file: null }
    ],
    3: []
  });

  const [newArticle, setNewArticle] = useState({
    title: '',
    type: 'Xalqaro maqola',
    journal: '',
    year: new Date().getFullYear().toString(),
    url: '',
    file: null
  });

  const handleAddArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.journal) return;

    const teacherId = selectedItem.id;
    const newId = Date.now();
    const articleToAdd = {
      id: newId,
      ...newArticle,
      fileName: newArticle.file ? newArticle.file.name : 'maqola.pdf'
    };

    setArticles(prev => ({
      ...prev,
      [teacherId]: [...(prev[teacherId] || []), articleToAdd]
    }));

    setNewArticle({
      title: '',
      type: 'Xalqaro maqola',
      journal: '',
      year: new Date().getFullYear().toString(),
      url: '',
      file: null
    });
    
    showNotification("Maqola muvaffaqiyatli yuklandi");
  };

  const handleConfirmDeleteArticle = () => {
    if (!selectedArticle) return;
    const teacherId = selectedItem.id;
    setArticles(prev => ({
      ...prev,
      [teacherId]: prev[teacherId].filter(art => art.id !== selectedArticle.id)
    }));
    setArticleDeleteModalOpen(false);
    setSelectedArticle(null);
    showNotification("Maqola muvaffaqiyatli o'chirildi");
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('998')) {
      val = val.substring(3);
    } else if (val.length === 0) {
      setPhoneNumber('+998 ');
      return;
    }
    val = val.substring(0, 9);
    
    let formatted = '+998 ';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += ' ' + val.substring(2, 5);
    if (val.length > 5) formatted += ' ' + val.substring(5, 7);
    if (val.length > 7) formatted += ' ' + val.substring(7, 9);
    
    setPhoneNumber(formatted);
  };
  const getLocalTeachers = () => {
    try {
      return JSON.parse(localStorage.getItem('urspi_custom_teachers') || '[]');
    } catch (e) {
      return [];
    }
  };

  const setLocalTeachers = (items) => {
    try {
      localStorage.setItem('urspi_custom_teachers', JSON.stringify(items));
      window.dispatchEvent(new Event('urspi_teachers_updated'));
    } catch (e) {}
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const fetchTeachers = async () => {
    setLoading(true);
    let apiData = [];
    try {
      const res = await teachersAPI.getAll();
      apiData = Array.isArray(res) ? res : (res?.data || []);
    } catch (e) {
      console.warn('API error in fetchTeachers:', e.message);
    }

    const localItems = getLocalTeachers();
    const combinedMap = new Map();
    localItems.forEach(item => combinedMap.set(String(item.id), item));
    apiData.forEach(item => {
      if (!combinedMap.has(String(item.id))) {
        combinedMap.set(String(item.id), item);
      }
    });

    const rawData = Array.from(combinedMap.values());
    const formatted = rawData.map(t => {
      const facObj = faculties.find(f => String(f.id) === String(t.facultyId || t.faculty?.id));
      const deptObj = departments.find(d => String(d.id) === String(t.departmentId || t.department?.id));
      return {
        id: t.id,
        faculty: t.facultyName || facObj?.nameUz || facObj?.name || t.faculty?.nameUz || t.faculty?.name || "Fakultet",
        department: t.departmentName || deptObj?.nameUz || deptObj?.name || t.department?.nameUz || t.department?.name || "Kafedra",
        position: t.positionTitleUz || t.positionTitle || t.position?.name || t.position || "O'qituvchi",
        fullName: t.fullNameUz || t.fullName || "O'qituvchi",
        phone: t.phoneNumber || t.phone || "+998 90 123 45 67",
        email: t.email || "info@urspi.uz",
        image: t.photo || t.image || getFileUrl(t.photoLink || t.photo) || "",
        rawItem: t
      };
    });
    setTeachersList(formatted);
    setLoading(false);
  };

  const fetchFacultiesAndDepartments = async () => {
    try {
      const [facRes, deptRes] = await Promise.all([
        facultiesAPI.getAll(),
        departmentsAPI.getAll()
      ]);
      const rawFac = Array.isArray(facRes) ? facRes : (facRes?.data || []);
      const rawDept = Array.isArray(deptRes) ? deptRes : (deptRes?.data || []);
      
      let localFac = [];
      let localDept = [];
      try {
        localFac = JSON.parse(localStorage.getItem('urspi_custom_faculties') || '[]');
        localDept = JSON.parse(localStorage.getItem('urspi_custom_departments') || '[]');
      } catch(e) {}

      const facMap = new Map();
      localFac.forEach(f => facMap.set(String(f.id), f));
      rawFac.forEach(f => { if (!facMap.has(String(f.id))) facMap.set(String(f.id), f); });

      const deptMap = new Map();
      localDept.forEach(d => deptMap.set(String(d.id), d));
      rawDept.forEach(d => { if (!deptMap.has(String(d.id))) deptMap.set(String(d.id), d); });

      setFaculties(Array.from(facMap.values()));
      setDepartments(Array.from(deptMap.values()));
    } catch (e) {
      console.warn("Failed to fetch faculties and departments:", e.message);
    }
  };

  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
    fetchFacultiesAndDepartments();
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
    if (!fullNameUz) {
      showNotification("Iltimos, ism-sharifni kiriting");
      return;
    }
    try {
      let base64Photo = imagePreview;
      if (photoFile) {
        const b64 = await fileToBase64(photoFile);
        if (b64) base64Photo = b64;
      }

      const facObj = faculties.find(f => String(f.id) === String(facultyId));
      const deptObj = departments.find(d => String(d.id) === String(departmentId));

      const teacherObj = {
        id: editMode && selectedItem ? selectedItem.id : Date.now(),
        fullNameUz,
        fullName: fullNameUz,
        phoneNumber,
        phone: phoneNumber,
        email,
        positionTitle: positionTitle || "O'qituvchi",
        positionTitleUz: positionTitle || "O'qituvchi",
        position: positionTitle || "O'qituvchi",
        facultyId: facultyId || '',
        facultyName: facObj?.nameUz || facObj?.name || 'Fakultet',
        departmentId: departmentId || '',
        departmentName: deptObj?.nameUz || deptObj?.name || 'Kafedra',
        photo: base64Photo || "",
        image: base64Photo || "",
        photoLink: base64Photo || "",
        updatedAt: new Date().toISOString()
      };

      // Try API request
      try {
        const fd = new FormData();
        fd.append('fullNameUz', fullNameUz);
        fd.append('fullNameRu', fullNameUz);
        fd.append('fullNameEn', fullNameUz);
        fd.append('phoneNumber', phoneNumber);
        fd.append('email', email);
        fd.append('positionTitle', positionTitle);
        fd.append('positionTitleUz', positionTitle);
        fd.append('positionTitleRu', positionTitle);
        fd.append('positionTitleEn', positionTitle);
        if (facultyId) fd.append('facultyId', facultyId);
        if (departmentId) fd.append('departmentId', departmentId);
        if (photoFile) {
          fd.append('file', photoFile);
          fd.append('photo', photoFile);
        }

        if (editMode && selectedItem) {
          await teachersAPI.update(selectedItem.id, fd);
        } else {
          await teachersAPI.create(fd);
        }
      } catch (apiErr) {
        console.warn('Backend API save failed, saving to localStorage:', apiErr.message);
      }

      // Save to localStorage for offline/local persistence
      const localItems = getLocalTeachers();
      let updatedLocal;
      if (editMode && selectedItem) {
        updatedLocal = localItems.map(item => String(item.id) === String(selectedItem.id) ? { ...item, ...teacherObj } : item);
        if (!updatedLocal.some(item => String(item.id) === String(selectedItem.id))) {
          updatedLocal.push(teacherObj);
        }
      } else {
        updatedLocal = [teacherObj, ...localItems];
      }
      setLocalTeachers(updatedLocal);

      showNotification(editMode ? "Muvaffaqiyatli tahrirlandi" : "Muvaffaqiyatli qo'shildi");
      setIsModalOpen(false);
      fetchTeachers();
    } catch (e) {
      console.error(e);
      showNotification(e.message || "Xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await teachersAPI.delete(selectedItem.id);
    } catch (e) {
      console.warn("API delete failed, removing from local storage:", e.message);
    }
    const localItems = getLocalTeachers();
    const updatedLocal = localItems.filter(item => String(item.id) !== String(selectedItem.id));
    setLocalTeachers(updatedLocal);
    showNotification("Muvaffaqiyatli o'chirildi");
    setDeleteModalOpen(false);
    fetchTeachers();
  };

  const openEditModal = (item) => {
    setEditMode(true);
    setSelectedItem(item);
    setImagePreview(item.image || null);
    setPhotoFile(null);

    setFullNameUz(item.fullName || '');
    setPhoneNumber(item.phone || '+998 ');
    setEmail(item.email || '');
    setFacultyId(item.rawItem?.faculty?.id || item.rawItem?.facultyId || '');
    setDepartmentId(item.rawItem?.department?.id || item.rawItem?.departmentId || '');
    setPositionTitle(item.position || '');

    setActiveMenuId(null);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    setImagePreview(null);
    setPhotoFile(null);

    setFullNameUz('');
    setPhoneNumber('+998 ');
    setEmail('');
    setFacultyId('');
    setDepartmentId('');
    setPositionTitle('');

    setActiveMenuId(null);
    setIsModalOpen(true);
  };

  const filteredTeachers = teachersList.filter(t => {
    const matchesFaculty = !filterFaculty || 
      String(t.rawItem?.faculty?.id || t.rawItem?.facultyId) === String(filterFaculty);
    
    const matchesDepartment = !filterDepartment || 
      String(t.rawItem?.department?.id || t.rawItem?.departmentId) === String(filterDepartment);
    
    const matchesSearch = !searchQuery || 
      (t.fullName && t.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.position && t.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.phone && t.phone.includes(searchQuery));
      
    return matchesFaculty && matchesDepartment && matchesSearch;
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
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">O'qituvchilar</h2>
        
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

      {/* Filters section */}
      <div className="flex flex-wrap gap-4 items-center w-full">
        <div className="flex-1 min-w-[200px] relative">
          <select 
            value={filterFaculty}
            onChange={(e) => {
              setFilterFaculty(e.target.value);
              setFilterDepartment('');
            }}
            className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-[#0eb99c] transition-colors appearance-none cursor-pointer"
          >
            <option value="">Barcha fakultetlar</option>
            {faculties.map(f => (
              <option key={f.id} value={f.id}>
                {f.nameUz || f.name || "Fakultet"}
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        
        <div className="flex-1 min-w-[200px] relative">
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-[#0eb99c] transition-colors appearance-none cursor-pointer"
          >
            <option value="">Barcha kafedralar</option>
            {departments
              .filter(d => !filterFaculty || String(d.faculty?.id || d.facultyId) === String(filterFaculty))
              .map(d => (
                <option key={d.id} value={d.id}>
                  {d.nameUz || d.name || "Kafedra"}
                </option>
              ))
            }
          </select>
          <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O'qituvchini izlash" 
            className="w-full h-11 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-[#0eb99c] transition-colors placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-slate-200">
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold w-16 text-center">№</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold text-center w-20">Rasm</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Fakultet</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Kafedra</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Lavozim</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">F.I.O</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold text-center w-24">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTeachers.map((teacher, index) => (
                <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400 font-medium text-center">{index + 1}</td>
                  <td className="border border-slate-200 dark:border-slate-700 p-0 text-center w-20">
                    <div className="w-20 h-24 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto overflow-hidden">
                      {teacher.image ? (
                        <img src={teacher.image} alt={teacher.fullName} className="w-full h-full object-cover object-top" />
                      ) : (
                        <span className="text-sm font-semibold text-slate-400">
                          {teacher.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400">{teacher.faculty}</td>
                  <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400">{teacher.department}</td>
                  <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400">{teacher.position}</td>
                  <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-800 dark:text-slate-200 font-medium">{teacher.fullName}</td>
                  <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-center relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(teacher.id);
                      }}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === teacher.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-[80%] top-1/2 -translate-y-1/2 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in"
                        style={{ animationDuration: '0.2s' }}
                      >
                        <button 
                          onClick={() => { setSelectedItem(teacher); setActiveMenuId(null); setArticleModalOpen(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                          Ilmiy faoliyat
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(teacher); setActiveMenuId(null); setViewModalOpen(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ko'rish
                        </button>
                        <button 
                          onClick={() => openEditModal(teacher)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Tahrirlash
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(teacher); setActiveMenuId(null); setDeleteModalOpen(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
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
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Fakultet va Kafedra</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedItem.faculty}, {selectedItem.department}</p>
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
                {editMode ? "O'qituvchi ma'lumotlarini tahrirlash" : "Yangi o'qituvchi qo'shish"}
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
                      value={fullNameUz}
                      onChange={(e) => setFullNameUz(e.target.value)}
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
                      value={phoneNumber}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="misol@urspi.uz" 
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Fakultet</label>
                  <div className="relative">
                    <select 
                      value={facultyId}
                      onChange={(e) => {
                        setFacultyId(e.target.value);
                        setDepartmentId('');
                      }}
                      className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Fakultetni tanlang</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.nameUz || f.name || "Fakultet"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kafedra</label>
                  <div className="relative">
                    <select 
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-blue-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Kafedrani tanlang</option>
                      {departments
                        .filter(d => !facultyId || String(d.faculty?.id || d.facultyId) === String(facultyId))
                        .map(d => (
                          <option key={d.id} value={d.id}>
                            {d.nameUz || d.name || "Kafedra"}
                          </option>
                        ))
                      }
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Lavozimi</label>
                  <input 
                    type="text" 
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    placeholder="Masalan: O'qituvchi" 
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

      {/* Scientific Activity Modal */}
      {articleModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#0eb99c]" />
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Ilmiy faoliyat va maqolalar
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    O'qituvchi: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedItem.fullName}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setArticleModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: Two Columns */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col md:flex-row gap-6 min-h-0">
              {/* Left column: Article List */}
              <div className="flex-1 flex flex-col min-w-0">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  Yuklangan maqolalar
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {(articles[selectedItem.id] || []).length}
                  </span>
                </h4>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {(articles[selectedItem.id] || []).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Hozircha maqolalar yuklanmagan</p>
                    </div>
                  ) : (
                    (articles[selectedItem.id] || []).map((art) => (
                      <div key={art.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4 hover:shadow-sm transition-all">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                              {art.type}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                              {art.year}-yil
                            </span>
                          </div>
                          <h5 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug truncate">
                            {art.title}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            Jurnal: {art.journal}
                          </p>
                          {art.url && (
                            <a 
                              href={art.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[11px] text-blue-500 hover:text-blue-600 inline-flex items-center gap-1 font-medium"
                            >
                              <Globe className="w-3 h-3" />
                              Maqola havolasi
                            </a>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          {art.fileName && (
                            <button 
                              title="Faylni yuklab olish"
                              type="button"
                              className="p-1.5 text-slate-500 hover:text-[#0eb99c] hover:bg-[#0eb99c]/10 rounded-lg transition-colors"
                            >
                              <FileDown className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => { setSelectedArticle(art); setArticleDeleteModalOpen(true); }}
                            title="O'chirish"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right column: Add article form */}
              <div className="w-full md:w-[360px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-6 md:pt-0 md:pl-6 shrink-0 flex flex-col">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Yangi maqola qo'shish
                </h4>
                
                <form onSubmit={handleAddArticle} className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Maqola nomi</label>
                      <input 
                        type="text" 
                        required
                        value={newArticle.title}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Mavzuni kiriting" 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-[#0eb99c] outline-none text-sm transition-colors" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Turi</label>
                        <select 
                          value={newArticle.type}
                          onChange={(e) => setNewArticle(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full h-10 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-[#0eb99c] outline-none text-xs transition-colors appearance-none cursor-pointer"
                        >
                          <option value="Xalqaro maqola">Xalqaro</option>
                          <option value="OAK maqolasi">OAK</option>
                          <option value="Mahalliy maqola">Mahalliy</option>
                          <option value="Tezis">Tezis</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nashr yili</label>
                        <input 
                          type="number" 
                          required
                          value={newArticle.year}
                          onChange={(e) => setNewArticle(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="2024" 
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-[#0eb99c] outline-none text-sm transition-colors" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Jurnal / Konferensiya nomi</label>
                      <input 
                        type="text" 
                        required
                        value={newArticle.journal}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, journal: e.target.value }))}
                        placeholder="Science and Education jurnali" 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-[#0eb99c] outline-none text-sm transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Maqola havolasi (URL / DOI)</label>
                      <input 
                        type="url" 
                        value={newArticle.url}
                        onChange={(e) => setNewArticle(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://doi.org/10.123..." 
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:border-[#0eb99c] outline-none text-sm transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Fayl yuklash (PDF)</label>
                      <label className="h-20 w-full rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all p-2 text-center">
                        <input 
                          type="file" 
                          accept=".pdf"
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setNewArticle(prev => ({ ...prev, file: e.target.files[0] }));
                            }
                          }}
                        />
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[11px] text-slate-500 font-medium truncate max-w-full px-2">
                          {newArticle.file ? newArticle.file.name : "Faylni tanlang (.pdf)"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-10 mt-4 bg-[#0eb99c] hover:bg-[#0ba087] text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Maqola qo'shish
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0 text-right">
              <button
                onClick={() => setArticleModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Delete Confirmation Modal */}
      {articleDeleteModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => { setArticleDeleteModalOpen(false); setSelectedArticle(null); }} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 mt-2">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Tasdiqlash</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
              Siz rostdan ham <span className="text-red-500 font-semibold">"{selectedArticle.title}"</span> maqolasini o'chirmoqchimisiz?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => { setArticleDeleteModalOpen(false); setSelectedArticle(null); }} 
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-sm"
              >
                Yo'q
              </button>
              <button 
                onClick={handleConfirmDeleteArticle} 
                className="flex-1 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
