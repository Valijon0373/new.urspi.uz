import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, UserPlus, Key, Eye, EyeOff, Edit2, Trash2, X, Check, Search, 
  Building2, ShieldCheck, Copy, RefreshCw, AlertCircle, Sparkles, CheckCircle2,
  SlidersHorizontal, ChevronDown, Plus, UserCheck, Calendar, Lock, ToggleLeft, ToggleRight,
  Shield, CheckSquare, Square, Phone, Upload, Image as ImageIcon, Camera, User
} from 'lucide-react';
import { usersAPI, departmentsAPI, centersAPI, facultiesAPI, rolesAPI, getFileUrl } from '../../api';

// Helper utilities to guarantee safe string rendering in React DOM
const getDepartmentName = (user) => {
  if (!user) return "Bo'lim ko'rsatilmagan";
  const dept = user.departmentName ?? user.department ?? user.dept;
  if (typeof dept === 'string') return dept || "Bo'lim ko'rsatilmagan";
  if (typeof dept === 'object' && dept !== null) {
    return dept.nameUz || dept.name || dept.titleUz || dept.title || "Bo'lim ko'rsatilmagan";
  }
  return "Bo'lim ko'rsatilmagan";
};

const getRoleName = (user) => {
  if (!user) return "Foydalanuvchi";
  if (typeof user.role === 'string') return user.role;
  if (typeof user.role === 'object' && user.role !== null) {
    return user.role.name || user.role.roleName || user.role.title || "Foydalanuvchi";
  }
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    const roleNames = user.roles
      .map(r => (typeof r === 'string' ? r : (r?.name || r?.roleName || '')))
      .filter(Boolean);
    if (roleNames.length > 0) return roleNames.join(', ');
  }
  if (typeof user.roles === 'object' && user.roles !== null) {
    return user.roles.name || user.roles.roleName || "Foydalanuvchi";
  }
  return "Foydalanuvchi";
};

const getFullName = (user) => {
  if (!user) return '—';
  if (typeof user.fullName === 'string') return user.fullName || '—';
  if (typeof user.name === 'string') return user.name || '—';
  if (typeof user.fullName === 'object' && user.fullName !== null) {
    return user.fullName.name || user.fullName.fullName || '—';
  }
  return '—';
};

const getUsername = (user) => {
  if (!user) return '—';
  if (typeof user.username === 'string') return user.username || '—';
  if (typeof user.login === 'string') return user.login || '—';
  if (typeof user.username === 'object' && user.username !== null) {
    return user.username.name || user.username.username || '—';
  }
  return '—';
};

const getPhone = (user) => {
  if (!user || !user.phone) return '—';
  return user.phone;
};

const getUserPhoto = (user) => {
  if (!user) return null;
  return user.photoLink || user.photo || user.imageUrl || user.image || null;
};

const getPasswordStr = (user) => {
  if (!user || !user.password) return '******';
  if (typeof user.password === 'string') return user.password;
  return '******';
};

// Available Permission Modules
const PERMISSION_ITEMS = [
  { key: 'teachers', title: "O'qituvchilar va Dekanat", desc: "O'qituvchilar hamda dekanat ma'lumotlarini boshqarish" },
  { key: 'departments', title: "Kafedralar va Markazlar", desc: "Kafedra va markazlar tarkibini tahrirlash" },
  { key: 'news', title: "Yangiliklar va E'lonlar", desc: "Yangilik hamda e'lonlarni joylash va tahrirlash" },
  { key: 'faculties', title: "Fakultetlar", desc: "Fakultetlar ma'lumotlarini o'zgartirish" },
  { key: 'leadership', title: "Rektorat va Rahbariyat", desc: "Rahbariyat tarkibini boshqarish" },
  { key: 'documents', title: "Meyoriy Hujjatlar", desc: "Hujjatlar hamda nizomlarni yuklash" },
  { key: 'dormitory', title: "Talabalar Turar Joyi (TTJ)", desc: "Yotoqxona arizalari va xonalari boshqaruvi" },
  { key: 'admission', title: "Qabul Komissiyasi", desc: "Qabul va abituriyentlar bo'limi" },
  { key: 'greenInstitute', title: "Yashil Institut", desc: "Ekologik loyihalar boshqaruvi" },
  { key: 'gallery', title: "Fotogalereya va Infografika", desc: "Rasmlar hamda infografikalarni yuklash" }
];

const DEFAULT_PERMISSIONS = {
  teachers: true,
  departments: true,
  news: true,
  faculties: true,
  leadership: false,
  documents: false,
  dormitory: false,
  admission: false,
  greenInstitute: false,
  gallery: false
};

export default function UsersAdmin() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  
  // Action menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Form State
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [departmentSuggestions, setDepartmentSuggestions] = useState([
    "Axborot texnologiyalari markazi",
    "Raqamli ta'lim texnologiyalari markazi",
    "Xalqaro aloqalar bo'limi",
    "Kadrlar bo'limi (HR)",
    "Moliya va rejalashtirish bo'limi",
    "Ilmiy tadqiqotlar bo'limi",
    "Matematika kafedrasi",
    "Fizika va texnika kafedrasi",
    "Pedagogika fakulteti",
    "Tabiiy fanlar fakulteti"
  ]);

  const [availableRoles, setAvailableRoles] = useState([]);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    phone: '',
    roleId: '',
    roleIds: [],
    role: '',
    photo: null,
    photoPreview: '',
    status: 'ACTIVE'
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleRemovePhoto = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: ''
    }));
  };

  const toggleRoleId = (id) => {
    const numId = Number(id);
    setFormData(prev => {
      const exists = prev.roleIds.includes(numId);
      const updated = exists ? prev.roleIds.filter(i => i !== numId) : [...prev.roleIds, numId];
      const primary = updated[0] ? String(updated[0]) : '';
      const matched = availableRoles.find(r => r.id === (updated[0] || null));
      return {
        ...prev,
        roleIds: updated,
        roleId: primary,
        role: matched ? matched.name : prev.role
      };
    });
  };

  const [userPermissions, setUserPermissions] = useState({ ...DEFAULT_PERMISSIONS });

  const INITIAL_DEMO_USERS = [
    {
      id: 1,
      departmentName: "Axborot texnologiyalari markazi",
      fullName: "Alimov Jasur Karimovich",
      username: "it_center_admin",
      password: "UrSPI_IT2026!",
      role: "Bo'lim Mas'uli",
      status: "ACTIVE",
      createdAt: "2026-01-15",
      permissions: { ...DEFAULT_PERMISSIONS, leadership: true, documents: true }
    },
    {
      id: 2,
      departmentName: "Xalqaro aloqalar bo'limi",
      fullName: "Ismoilova Nilufar Erkinovna",
      username: "intl_relations",
      password: "UrSPI_Intl99#",
      role: "Bo'lim Mas'uli",
      status: "ACTIVE",
      createdAt: "2026-02-10",
      permissions: { ...DEFAULT_PERMISSIONS, news: true, documents: true }
    },
    {
      id: 3,
      departmentName: "Matematika kafedrasi",
      fullName: "Rustamov Sardor Bekzodovich",
      username: "math_dept_user",
      password: "MathPass2026$",
      role: "Operator",
      status: "ACTIVE",
      createdAt: "2026-03-01",
      permissions: { ...DEFAULT_PERMISSIONS }
    },
    {
      id: 4,
      departmentName: "Kadrlar bo'limi (HR)",
      fullName: "Zokirova Malika Otabekovna",
      username: "hr_urspi_admin",
      password: "HrSecure_8472",
      role: "Bo'lim Mas'uli",
      status: "ACTIVE",
      createdAt: "2026-03-12",
      permissions: { ...DEFAULT_PERMISSIONS, teachers: true }
    }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    let loadedUsers = [];
    try {
      const res = await usersAPI.getAll();
      const raw = Array.isArray(res) ? res : (res?.data || []);
      if (raw && raw.length > 0) {
        loadedUsers = raw;
      }
    } catch (e) {
      console.warn('API fetchUsers error, falling back to local storage:', e.message);
    }

    if (loadedUsers.length === 0) {
      const saved = localStorage.getItem('urspi_department_users');
      if (saved) {
        try {
          loadedUsers = JSON.parse(saved);
        } catch (e) {
          loadedUsers = INITIAL_DEMO_USERS;
        }
      } else {
        loadedUsers = INITIAL_DEMO_USERS;
        localStorage.setItem('urspi_department_users', JSON.stringify(INITIAL_DEMO_USERS));
      }
    }

    setUsersList(loadedUsers);

    // Also fetch real departments and roles from API
    try {
      const [deptRes, centerRes, facRes, rolesRes] = await Promise.allSettled([
        departmentsAPI.getAll(),
        centersAPI.getAll(),
        facultiesAPI.getAll(),
        rolesAPI.getAll()
      ]);
      const depts = deptRes.status === 'fulfilled' ? (Array.isArray(deptRes.value) ? deptRes.value : deptRes.value?.data || []) : [];
      const centers = centerRes.status === 'fulfilled' ? (Array.isArray(centerRes.value) ? centerRes.value : centerRes.value?.data || []) : [];
      const facs = facRes.status === 'fulfilled' ? (Array.isArray(facRes.value) ? facRes.value : facRes.value?.data || []) : [];
      const roles = rolesRes.status === 'fulfilled' ? (Array.isArray(rolesRes.value) ? rolesRes.value : rolesRes.value?.data || []) : [];

      if (roles.length > 0) {
        setAvailableRoles(roles);
      }

      const names = [
        ...depts.map(d => d.nameUz || d.name || d.titleUz),
        ...centers.map(c => c.nameUz || c.name || c.titleUz),
        ...facs.map(f => f.nameUz || f.name || f.titleUz)
      ].filter(Boolean);

      if (names.length > 0) {
        setDepartmentSuggestions(prev => Array.from(new Set([...prev, ...names])));
      }
    } catch (err) {
      // Keep initial suggestions
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const saveUsersToStorage = (updated) => {
    setUsersList(updated);
    localStorage.setItem('urspi_department_users', JSON.stringify(updated));
  };

  const showToast = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let pass = 'UrSPI_';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!';
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const generateAutoUsername = (fullName) => {
    if (!fullName) return;
    const clean = fullName
      .toLowerCase()
      .replace(/o['`’]/g, 'o')
      .replace(/g['`’]/g, 'g')
      .replace(/sh/g, 'sh')
      .replace(/ch/g, 'ch')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join('_');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generated = clean ? `${clean}_${randomSuffix}` : `user_${randomSuffix}`;
    setFormData(prev => ({ ...prev, username: generated }));
  };

  const fetchRoles = async () => {
    try {
      const res = await rolesAPI.getAll();
      const raw = Array.isArray(res) ? res : (res?.data || res?.roles || res?.content || []);
      if (raw && raw.length > 0) {
        setAvailableRoles(raw);
        return raw;
      }
    } catch (e) {
      console.warn("API error fetching roles:", e.message);
    }
    return [];
  };

  const openAddModal = async () => {
    setEditMode(false);
    setSelectedUser(null);
    setShowPassword(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    let roles = availableRoles;
    if (roles.length === 0) {
      roles = await fetchRoles();
    } else {
      fetchRoles();
    }

    const firstRole = roles.length > 0 ? roles[0] : null;
    setFormData({
      fullName: '',
      username: '',
      password: '',
      phone: '+998',
      roleId: firstRole ? String(firstRole.id) : '',
      roleIds: firstRole ? [firstRole.id] : [],
      role: firstRole ? firstRole.name : '',
      photo: null,
      photoPreview: '',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    setShowPassword(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    let initialRoleIds = [];
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      initialRoleIds = user.roles
        .map(r => (typeof r === 'object' && r !== null ? r.id : Number(r)))
        .filter(id => !isNaN(id) && id != null);
    } else if (Array.isArray(user.roleIds) && user.roleIds.length > 0) {
      initialRoleIds = user.roleIds.map(Number).filter(id => !isNaN(id));
    } else if (user.role && typeof user.role === 'object' && user.role.id) {
      initialRoleIds = [Number(user.role.id)];
    }

    const currentRoleName = getRoleName(user);
    if (initialRoleIds.length === 0 && availableRoles.length > 0) {
      const matched = availableRoles.find(r => r.name === currentRoleName);
      if (matched) initialRoleIds = [matched.id];
    }

    const rawPhoto = getUserPhoto(user);

    setFormData({
      fullName: getFullName(user) !== '—' ? getFullName(user) : '',
      username: getUsername(user) !== '—' ? getUsername(user) : '',
      password: '',
      phone: user.phone || '',
      roleId: initialRoleIds[0] ? String(initialRoleIds[0]) : '',
      roleIds: initialRoleIds,
      role: currentRoleName,
      photo: null,
      photoPreview: rawPhoto ? getFileUrl(rawPhoto) : '',
      status: typeof user.status === 'string' ? user.status : 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openPermissionsModal = (user) => {
    setSelectedUser(user);
    setUserPermissions(user.permissions || { ...DEFAULT_PERMISSIONS });
    setPermissionsModalOpen(true);
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    const updatedUser = {
      ...selectedUser,
      permissions: userPermissions
    };

    try {
      await usersAPI.update(selectedUser.id, updatedUser);
    } catch (e) {
      console.warn('API save error:', e.message);
    }

    const newList = usersList.map(u => u.id === selectedUser.id ? updatedUser : u);
    saveUsersToStorage(newList);
    showToast("Foydalanuvchi huquqlari muvaffaqiyatli saqlandi!");
    setPermissionsModalOpen(false);
  };

  const handleSaveUser = async () => {
    if (!formData.fullName.trim()) {
      showToast("Iltimos, F.I.Sh. (To'liq ism)ni kiriting!", "error");
      return;
    }
    if (!formData.username.trim()) {
      showToast("Iltimos, login kiriting!", "error");
      return;
    }
    if (!editMode && !formData.password.trim()) {
      showToast("Iltimos, parol kiriting!", "error");
      return;
    }
    if (!formData.phone.trim()) {
      showToast("Iltimos, telefon raqamini kiriting!", "error");
      return;
    }

    let roleIds = formData.roleIds;
    if ((!roleIds || roleIds.length === 0) && formData.roleId) {
      roleIds = [Number(formData.roleId)];
    }
    if (!roleIds || roleIds.length === 0) {
      showToast("Iltimos, kamida bitta tizim rolini tanlang!", "error");
      return;
    }

    const matchedRoles = availableRoles.filter(r => roleIds.includes(r.id));
    const resolvedRoleName = matchedRoles.map(r => r.name).join(', ') || formData.role || "Foydalanuvchi";

    const apiDto = {
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      phone: formData.phone.trim(),
      roleIds: roleIds
    };
    if (formData.password.trim()) {
      apiDto.password = formData.password.trim();
    }
    if (formData.photo instanceof File) {
      apiDto.photo = formData.photo;
    }

    let savedData = null;
    try {
      if (editMode && selectedUser) {
        const res = await usersAPI.update(selectedUser.id, apiDto);
        savedData = res?.data || res;
        showToast("Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi!");
      } else {
        const res = await usersAPI.create(apiDto);
        savedData = res?.data || res;
        showToast("Yangi foydalanuvchi yaratildi va rol biriktirildi!");
      }
    } catch (e) {
      console.warn('API save error, persisting in local storage:', e.message);
      showToast(e.message || "Xatolik yuz berdi", "error");
    }

    const summaryUser = {
      id: savedData?.id || (editMode && selectedUser ? selectedUser.id : Date.now()),
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      password: formData.password.trim() || (selectedUser ? getPasswordStr(selectedUser) : '******'),
      phone: formData.phone.trim(),
      roleIds: roleIds,
      roles: matchedRoles.length > 0 ? matchedRoles : [{ name: resolvedRoleName }],
      role: resolvedRoleName,
      status: formData.status,
      permissions: selectedUser?.permissions || { ...DEFAULT_PERMISSIONS },
      photo: formData.photoPreview || (selectedUser ? getUserPhoto(selectedUser) : null)
    };

    let newList = [];
    if (editMode && selectedUser) {
      newList = usersList.map(u => u.id === selectedUser.id ? { ...u, ...summaryUser } : u);
    } else {
      newList = [summaryUser, ...usersList];
    }
    saveUsersToStorage(newList);

    // Refresh from backend to sync
    fetchUsers();

    setSelectedUser(summaryUser);
    setIsModalOpen(false);
    if (!editMode) {
      setCredentialsModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await usersAPI.delete(selectedUser.id);
    } catch (e) {
      console.warn('API delete error, removing from local storage:', e.message);
    }

    const updated = usersList.filter(u => u.id !== selectedUser.id);
    saveUsersToStorage(updated);
    showToast("Foydalanuvchi muvaffaqiyatli o'chirildi");
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const copyCredentialsToClipboard = () => {
    if (!selectedUser) return;
    const text = `UrSPI Tizim Kirish Ma'lumotlari:
👤 F.I.Sh: ${getFullName(selectedUser)}
🔑 Login: ${getUsername(selectedUser)}
🔒 Parol: ${getPasswordStr(selectedUser)}
📞 Telefon: ${selectedUser.phone || '—'}
🔰 Rol: ${getRoleName(selectedUser)}
🌐 Kirish manzili: https://new.urspi.uz/admin`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Department options for filter
  const departmentList = Array.from(new Set([
    ...departmentSuggestions,
    ...usersList.map(u => getDepartmentName(u))
  ])).filter(Boolean);

  // Filtered list
  const filteredUsers = usersList.filter(user => {
    if (!user) return false;
    const query = searchQuery.toLowerCase();
    const deptStr = getDepartmentName(user);
    const nameStr = getFullName(user).toLowerCase();
    const userStr = getUsername(user).toLowerCase();
    const phoneStr = (user.phone || '').toLowerCase();
    const roleStr = getRoleName(user);

    const matchesDepartment = departmentFilter === 'ALL' || deptStr === departmentFilter;
    const matchesRole = roleFilter === 'ALL' || roleStr.toLowerCase() === roleFilter.toLowerCase() || roleStr === roleFilter;
    const matchesSearch = !query || 
      deptStr.toLowerCase().includes(query) ||
      nameStr.includes(query) ||
      userStr.includes(query) ||
      phoneStr.includes(query) ||
      roleStr.toLowerCase().includes(query);

    return matchesDepartment && matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 shadow-xl border rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[80] ${
          notification.type === 'error' 
            ? 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200' 
            : 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-100'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            notification.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-500'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          </div>
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Foydalanuvchilar</h2>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            Foydalanuvchi qo'shish
          </button>
        </div>
      </div>

      {/* Filters section matching Teachers table filters */}
      <div className="flex flex-wrap gap-4 items-center w-full">
        {/* Role Filter */}
        <div className="flex-1 min-w-[200px] relative">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full h-11 px-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-[#0eb99c] transition-colors appearance-none cursor-pointer"
          >
            <option value="ALL">Barcha Rollar</option>
            {availableRoles.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Foydalanuvchi ismi, login yoki telefon raqami..." 
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
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Foydalanuvchi</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Login</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Telefon</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold">Tizim Roli</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold text-center">Holat</th>
                <th className="border border-slate-200 dark:border-slate-700 py-4 px-6 font-semibold text-center w-24">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="border border-slate-200 dark:border-slate-700 py-8 text-center text-slate-400">
                    Ma'lumotlar yuklanmoqda...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border border-slate-200 dark:border-slate-700 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-10 h-10 text-slate-300" />
                      <p className="font-medium text-slate-500">Hech qanday foydalanuvchi topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const photoUrl = getUserPhoto(user);
                  return (
                    <tr key={user.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-600 dark:text-slate-400 font-medium text-center">
                        {index + 1}
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-800 dark:text-slate-100 font-semibold">
                        <div className="flex items-center gap-3">
                          {photoUrl ? (
                            <img 
                              src={getFileUrl(photoUrl)} 
                              alt={getFullName(user)} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#0eb99c] font-bold flex items-center justify-center text-sm border border-teal-200 dark:border-teal-800 shrink-0">
                              {getFullName(user) !== '—' ? getFullName(user).charAt(0).toUpperCase() : <User className="w-5 h-5 text-slate-400" />}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-100">{getFullName(user)}</div>
                            {user.departmentName && (
                              <div className="text-xs text-slate-400 font-normal">{getDepartmentName(user)}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6">
                        <span className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-violet-600 dark:text-violet-400 rounded-md border border-slate-200 dark:border-slate-700 inline-block">
                          {getUsername(user)}
                        </span>
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{getPhone(user)}</span>
                        </div>
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-50 text-[#0eb99c] dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
                          <ShieldCheck className="w-3 h-3" />
                          {getRoleName(user)}
                        </span>
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-center">
                        {user.status === 'ACTIVE' || user.status === true || user.status === 'faol' ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Faol
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                            Nofaol
                          </span>
                        )}
                      </td>
                      <td className="border border-slate-200 dark:border-slate-700 py-4 px-6 text-center relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(user.id);
                          }}
                          className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === user.id && (
                          <div 
                            ref={menuRef}
                            className="absolute right-[80%] top-1/2 -translate-y-1/2 mt-1 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 z-50 animate-fade-in text-left"
                            style={{ animationDuration: '0.2s' }}
                          >
                            <button 
                              onClick={() => { setSelectedUser(user); setActiveMenuId(null); setCredentialsModalOpen(true); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                              <Key className="w-4 h-4" />
                              Login va Parol
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setActiveMenuId(null); setViewModalOpen(true); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                              Ko'rish
                            </button>
                            <button 
                              onClick={() => { openEditModal(user); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                              Tahrirlash
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setActiveMenuId(null); setDeleteModalOpen(true); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              O'chirish
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Foydalanuvchi qo'shish va Tahrirlash (Swagger /api/users/create mosligi) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0eb99c]/10 text-[#0eb99c] rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                    {editMode ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi yaratish"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                    Foydalanuvchi ma'lumotlarini kiriting va tizim rolini biriktiring
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto space-y-4.5 flex-1 custom-scrollbar">
              
              {/* Surat yuklash (photo - multipart/form-data) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Foydalanuvchi surati (ixtiyoriy)
                </label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="relative">
                    {formData.photoPreview ? (
                      <img
                        src={formData.photoPreview}
                        alt="Tanlangan surat"
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#0eb99c] shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#0eb99c] hover:bg-[#0ba087] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Surat tanlash
                      </button>
                      {formData.photoPreview && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-rose-200 dark:border-rose-900"
                        >
                          O'chirish
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 m-0">PNG, JPG yoki WEBP formatidagi fayl</p>
                  </div>
                </div>
              </div>

              {/* F.I.Sh. (fullName) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  F.I.Sh. (To'liq ism) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Masalan: Alimov Jasur Karimovich"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors text-sm font-medium"
                  required
                />
              </div>

              {/* Login (username) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Login (Foydalanuvchi nomi) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => generateAutoUsername(formData.fullName)}
                    className="text-xs font-semibold text-[#0eb99c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Avto Login
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="jasur_karimovich"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors text-sm"
                  required
                />
              </div>

              {/* Parol (password) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Parol {editMode ? <span className="text-xs font-normal text-slate-400">(ixtiyoriy)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-xs font-semibold text-[#0eb99c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Tasodifiy parol
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editMode ? "Yangi parol (o'zgartirish uchun)" : "Parol kiriting..."}
                    className="w-full pl-4 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Telefon raqami (phone) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#0eb99c]" />
                  <span>Telefon raqami <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998901234567"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors text-sm font-medium font-mono"
                  required
                />
              </div>

              {/* Tizim Roli (roleIds - array<integer>) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-violet-500" />
                    <span>Tizim Roli <span className="text-red-500">*</span></span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {formData.roleIds.length > 0 ? `${formData.roleIds.length} ta rol tanlangan` : 'Rol tanlanmagan'}
                  </span>
                </div>
                
                <select
                  value={formData.roleId || (formData.roleIds[0] ? String(formData.roleIds[0]) : '')}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const numId = Number(selectedId);
                    const found = availableRoles.find(r => r.id === numId);
                    setFormData({
                      ...formData,
                      roleId: selectedId,
                      roleIds: selectedId ? [numId] : [],
                      role: found ? found.name : ''
                    });
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors text-sm font-medium cursor-pointer"
                >
                  <option value="">Rolni tanlang...</option>
                  {availableRoles.length > 0 ? (
                    availableRoles.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} {r.description ? `(${r.description})` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Rollarni yuklanmoqda...</option>
                  )}
                </select>

                {/* Quick toggle chips for multiple roles */}
                {availableRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {availableRoles.map(r => {
                      const isSelected = formData.roleIds.includes(r.id) || String(formData.roleId) === String(r.id);
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => toggleRoleId(r.id)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-[#0eb99c] dark:text-teal-300 border-[#0eb99c] font-semibold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{r.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">Tizim rollari bo'limida yaratilgan rollardan biriktiriladi</p>
              </div>

              {/* Holati */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Holati
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#0eb99c] focus:outline-none transition-colors text-sm font-medium cursor-pointer"
                >
                  <option value="ACTIVE">Faol</option>
                  <option value="INACTIVE">Nofaol</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveUser}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {editMode ? "Saqlash" : "Foydalanuvchi yaratish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Permissions Manager Modal (Huquqlar Modali) */}
      {permissionsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                    Foydalanuvchi Huquqlari
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                    {getDepartmentName(selectedUser)} ({getUsername(selectedUser)})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPermissionsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-3 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                Ruxsat berilgan: {Object.values(userPermissions).filter(Boolean).length} / {PERMISSION_ITEMS.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allTrue = {};
                    PERMISSION_ITEMS.forEach(p => allTrue[p.key] = true);
                    setUserPermissions(allTrue);
                  }}
                  className="text-[#0eb99c] hover:underline font-medium cursor-pointer"
                >
                  Barchasiga ruxsat berish
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const allFalse = {};
                    PERMISSION_ITEMS.forEach(p => allFalse[p.key] = false);
                    setUserPermissions(allFalse);
                  }}
                  className="text-slate-500 hover:underline font-medium cursor-pointer"
                >
                  Barchasini o'chirish
                </button>
              </div>
            </div>

            {/* List of Permissions */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
              {PERMISSION_ITEMS.map((perm) => {
                const isEnabled = !!userPermissions[perm.key];
                return (
                  <div 
                    key={perm.key}
                    onClick={() => {
                      setUserPermissions(prev => ({ ...prev, [perm.key]: !isEnabled }));
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isEnabled 
                        ? 'bg-teal-50/60 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/80 shadow-sm' 
                        : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="pr-4 space-y-0.5">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 m-0">
                        {perm.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                        {perm.desc}
                      </p>
                    </div>

                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserPermissions(prev => ({ ...prev, [perm.key]: !isEnabled }));
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isEnabled ? 'bg-[#0eb99c]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setPermissionsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View User Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[20px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col p-6 md:p-8 gap-6">
            <button 
              onClick={() => setViewModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              {getUserPhoto(selectedUser) ? (
                <img 
                  src={getFileUrl(getUserPhoto(selectedUser))} 
                  alt={getFullName(selectedUser)} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0eb99c] shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/60 text-[#0eb99c] rounded-2xl flex items-center justify-center shrink-0 border border-teal-100 dark:border-teal-900 text-xl font-bold">
                  {getFullName(selectedUser) !== '—' ? getFullName(selectedUser).charAt(0).toUpperCase() : <User className="w-8 h-8 text-slate-400" />}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{getFullName(selectedUser)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{getRoleName(selectedUser)} — {getDepartmentName(selectedUser)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">F.I.Sh.</span>
                <span className="text-slate-800 dark:text-slate-100 font-medium text-base">{getFullName(selectedUser)}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Rol</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-teal-50 text-[#0eb99c] dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-900 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {getRoleName(selectedUser)}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Tizim Logini</span>
                <span className="font-mono font-bold text-violet-600 dark:text-violet-400 text-base">{getUsername(selectedUser)}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Telefon raqami</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Phone className="w-4 h-4 text-[#0eb99c]" />
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-100 text-base">{getPhone(selectedUser)}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 md:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Holat</span>
                {selectedUser.status === 'ACTIVE' || selectedUser.status === true || selectedUser.status === 'faol' ? (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 mt-0.5">
                    Faol
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 mt-0.5">
                    Nofaol
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  openEditModal(selectedUser);
                }}
                className="px-4 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Tahrirlash
              </button>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setCredentialsModalOpen(true);
                }}
                className="px-4 py-2.5 text-sm font-semibold text-[#0eb99c] bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                Login & Parol ko'rish
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Credentials Summary Modal with Copy Button */}
      {credentialsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden">
            <button
              onClick={() => setCredentialsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Kirish Ma'lumotlari
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ushbu ma'lumotlarni foydalanuvchiga yuborishingiz mumkin
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 space-y-3 font-mono text-sm border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex justify-between items-center text-xs text-slate-500 font-sans">
                <span>F.I.SH.:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{getFullName(selectedUser)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-sans">
                <span>TELEFON:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{getPhone(selectedUser)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-sans">
                <span>TIZIM ROLI:</span>
                <span className="font-semibold text-[#0eb99c]">{getRoleName(selectedUser)}</span>
              </div>
              <hr className="border-slate-200 dark:border-slate-700" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans text-xs">LOGIN:</span>
                <span className="font-bold text-violet-600 dark:text-violet-400">{getUsername(selectedUser)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans text-xs">PAROL:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{getPasswordStr(selectedUser)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={copyCredentialsToClipboard}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#0eb99c] hover:bg-[#0ba087] text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Nusxalandi!" : "Nusxalash"}</span>
              </button>

              <button
                onClick={() => setCredentialsModalOpen(false)}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-14 h-14 mx-auto bg-rose-100 dark:bg-rose-950/50 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Foydalanuvchini o'chirish</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              <span className="font-bold text-slate-800 dark:text-slate-200">{getFullName(selectedUser)}</span> (<span className="text-rose-600 font-mono font-bold">{getUsername(selectedUser)}</span>) ni tizimdan o'chirishni tasdiqlaysizmi?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Yo'q
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md cursor-pointer"
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
