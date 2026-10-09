import React, { useState, useEffect } from 'react';
import { Shield, Key, Plus, Trash2, Check, X, Loader2, ShieldCheck, Search, SlidersHorizontal, CheckSquare, Square } from 'lucide-react';
import { rolesAPI, permissionsAPI, saveRolePermissionsToRegistry } from '../../api';

// Helper: Translate permission code and entity into friendly Uzbek
export const getPermissionUzbekInfo = (permission) => {
  if (!permission) return { title: "Noma'lum ruxsat", desc: "", code: "" };
  
  const rawName = (typeof permission === 'string' ? permission : permission.name || '').trim();
  const rawDesc = typeof permission === 'object' ? (permission.description || '') : '';
  const upper = rawName.toUpperCase();

  const dictionary = {
    // Roles
    'ROLE_CREATE': { title: "Yangi rol qo'shish", desc: "Tizimda yangi foydalanuvchi rollarini yaratish" },
    'ROLE_READ': { title: "Rollarni ko'rish", desc: "Tizim rollari ro'yxatini ko'rish" },
    'ROLE_VIEW': { title: "Rollarni ko'rish", desc: "Tizim rollari ro'yxatini ko'rish" },
    'ROLE_UPDATE': { title: "Rollarni tahrirlash", desc: "Mavjud rollar ma'lumotlarini o'zgartirish" },
    'ROLE_EDIT': { title: "Rollarni tahrirlash", desc: "Mavjud rollar ma'lumotlarini o'zgartirish" },
    'ROLE_DELETE': { title: "Rollarni o'chirish", desc: "Tizimdan rollarni o'chirib tashlash" },

    // Permissions
    'PERMISSION_READ': { title: "Ruxsatnomalarni ko'rish", desc: "Tizimdagi barcha ruxsatnomalar ro'yxatini ko'rish" },
    'PERMISSION_VIEW': { title: "Ruxsatnomalarni ko'rish", desc: "Tizimdagi barcha ruxsatnomalar ro'yxatini ko'rish" },
    'PERMISSION_ASSIGN': { title: "Ruxsatnoma biriktirish", desc: "Rollar yoki foydalanuvchilarga ruxsat berish" },
    'PERMISSION_REMOVE': { title: "Ruxsatnomani bekor qilish", desc: "Ruxsatnomalarni olib tashlash" },

    // Users
    'USER_CREATE': { title: "Foydalanuvchi qo'shish", desc: "Yangi foydalanuvchi profillarini yaratish" },
    'USER_READ': { title: "Foydalanuvchilarni ko'rish", desc: "Foydalanuvchilar ro'yxati va ma'lumotlarini ko'rish" },
    'USER_VIEW': { title: "Foydalanuvchilarni ko'rish", desc: "Foydalanuvchilar ro'yxati va ma'lumotlarini ko'rish" },
    'USER_UPDATE': { title: "Foydalanuvchini tahrirlash", desc: "Foydalanuvchilar ma'lumotlari va parollarini yangilash" },
    'USER_EDIT': { title: "Foydalanuvchini tahrirlash", desc: "Foydalanuvchilar ma'lumotlarini yangilash" },
    'USER_DELETE': { title: "Foydalanuvchini o'chirish", desc: "Foydalanuvchi profilini tizimdan o'chirish" },

    // News
    'NEWS_CREATE': { title: "Yangilik qo'shish", desc: "Yangi yangiliklar va maqolalar chop etish" },
    'NEWS_READ': { title: "Yangiliklarni ko'rish", desc: "Yangiliklar ro'yxatini ko'rish" },
    'NEWS_VIEW': { title: "Yangiliklarni ko'rish", desc: "Yangiliklar ro'yxatini ko'rish" },
    'NEWS_UPDATE': { title: "Yangiliklarni tahrirlash", desc: "Yangiliklar matni va rasmlarini o'zgartirish" },
    'NEWS_EDIT': { title: "Yangiliklarni tahrirlash", desc: "Yangiliklar matni va rasmlarini o'zgartirish" },
    'NEWS_DELETE': { title: "Yangiliklarni o'chirish", desc: "Yangiliklarni tizimdan o'chirish" },

    // Announcements
    'ANNOUNCEMENT_CREATE': { title: "E'lon qo'shish", desc: "Yangi e'lonlar yaratish" },
    'ANNOUNCEMENT_READ': { title: "E'lonlarni ko'rish", desc: "E'lonlar ro'yxatini ko'rish" },
    'ANNOUNCEMENT_VIEW': { title: "E'lonlarni ko'rish", desc: "E'lonlar ro'yxatini ko'rish" },
    'ANNOUNCEMENT_UPDATE': { title: "E'lonlarni tahrirlash", desc: "E'lonlar ma'lumotlarini tahrirlash" },
    'ANNOUNCEMENT_DELETE': { title: "E'lonlarni o'chirish", desc: "E'lonlarni o'chirib tashlash" },

    // Departments
    'DEPARTMENT_CREATE': { title: "Kafedra qo'shish", desc: "Yangi kafedralar yaratish" },
    'DEPARTMENT_READ': { title: "Kafedralarni ko'rish", desc: "Kafedralar ro'yxatini ko'rish" },
    'DEPARTMENT_VIEW': { title: "Kafedralarni ko'rish", desc: "Kafedralar ro'yxatini ko'rish" },
    'DEPARTMENT_UPDATE': { title: "Kafedrani tahrirlash", desc: "Kafedra ma'lumotlarini o'zgartirish" },
    'DEPARTMENT_EDIT': { title: "Kafedrani tahrirlash", desc: "Kafedra ma'lumotlarini o'zgartirish" },
    'DEPARTMENT_DELETE': { title: "Kafedrani o'chirish", desc: "Kafedrani tizimdan o'chirish" },

    // Faculties
    'FACULTY_CREATE': { title: "Fakultet qo'shish", desc: "Yangi fakultetlar yaratish" },
    'FACULTY_READ': { title: "Fakultetlarni ko'rish", desc: "Fakultetlar ro'yxatini ko'rish" },
    'FACULTY_VIEW': { title: "Fakultetlarni ko'rish", desc: "Fakultetlar ro'yxatini ko'rish" },
    'FACULTY_UPDATE': { title: "Fakultetni tahrirlash", desc: "Fakultet ma'lumotlarini yangilash" },
    'FACULTY_EDIT': { title: "Fakultetni tahrirlash", desc: "Fakultet ma'lumotlarini yangilash" },
    'FACULTY_DELETE': { title: "Fakultetni o'chirish", desc: "Fakultetni tizimdan o'chirish" },

    // Teachers
    'TEACHER_CREATE': { title: "O'qituvchi qo'shish", desc: "Professor-o'qituvchi ma'lumotlarini kiritish" },
    'TEACHER_READ': { title: "O'qituvchilarni ko'rish", desc: "O'qituvchilar ro'yxatini ko'rish" },
    'TEACHER_VIEW': { title: "O'qituvchilarni ko'rish", desc: "O'qituvchilar ro'yxatini ko'rish" },
    'TEACHER_UPDATE': { title: "O'qituvchini tahrirlash", desc: "O'qituvchi ma'lumotlarini o'zgartirish" },
    'TEACHER_EDIT': { title: "O'qituvchini tahrirlash", desc: "O'qituvchi ma'lumotlarini o'zgartirish" },
    'TEACHER_DELETE': { title: "O'qituvchini o'chirish", desc: "O'qituvchini tizimdan o'chirish" },

    // Employees
    'EMPLOYEE_CREATE': { title: "Xodim qo'shish", desc: "Yangi xodim ma'lumotlarini kiritish" },
    'EMPLOYEE_READ': { title: "Xodimlarni ko'rish", desc: "Xodimlar ro'yxatini ko'rish" },
    'EMPLOYEE_VIEW': { title: "Xodimlarni ko'rish", desc: "Xodimlar ro'yxatini ko'rish" },
    'EMPLOYEE_UPDATE': { title: "Xodimni tahrirlash", desc: "Xodim ma'lumotlarini yangilash" },
    'EMPLOYEE_EDIT': { title: "Xodimni tahrirlash", desc: "Xodim ma'lumotlarini yangilash" },
    'EMPLOYEE_DELETE': { title: "Xodimni o'chirish", desc: "Xodimni tizimdan o'chirish" },

    // Leaders
    'LEADER_CREATE': { title: "Rahbariyatga a'zo qo'shish", desc: "Rektorat va rahbariyat tarkibiga a'zo qo'shish" },
    'LEADER_READ': { title: "Rahbariyatni ko'rish", desc: "Rahbariyat ro'yxatini ko'rish" },
    'LEADER_VIEW': { title: "Rahbariyatni ko'rish", desc: "Rahbariyat ro'yxatini ko'rish" },
    'LEADER_UPDATE': { title: "Rahbariyat a'zosini tahrirlash", desc: "Rahbariyat ma'lumotlarini o'zgartirish" },
    'LEADER_DELETE': { title: "Rahbariyat a'zosini o'chirish", desc: "Rahbariyat a'zosini tizimdan o'chirish" },

    // Dormitories (TTJ)
    'DORMITORY_CREATE': { title: "TTJ arizasini qo'shish", desc: "Yotoqxona ma'lumotlarini qo'shish" },
    'DORMITORY_READ': { title: "TTJ ma'lumotlarini ko'rish", desc: "Talabalar turar joyi va arizalarni ko'rish" },
    'DORMITORY_VIEW': { title: "TTJ ma'lumotlarini ko'rish", desc: "Talabalar turar joyi va arizalarni ko'rish" },
    'DORMITORY_UPDATE': { title: "TTJ ni tahrirlash", desc: "Yotoqxona arizalari va xonalarini tahrirlash" },
    'DORMITORY_DELETE': { title: "TTJ ni o'chirish", desc: "Yotoqxona ma'lumotlarini o'chirish" },

    // Documents
    'DOCUMENT_CREATE': { title: "Me'yoriy hujjat yuklash", desc: "Me'yoriy hujjatlar va qarorlarni yuklash" },
    'DOCUMENT_READ': { title: "Hujjatlarni ko'rish", desc: "Me'yoriy hujjatlar ro'yxatini ko'rish" },
    'DOCUMENT_VIEW': { title: "Hujjatlarni ko'rish", desc: "Me'yoriy hujjatlar ro'yxatini ko'rish" },
    'DOCUMENT_UPDATE': { title: "Hujjatni tahrirlash", desc: "Hujjat ma'lumotlarini o'zgartirish" },
    'DOCUMENT_DELETE': { title: "Hujjatni o'chirish", desc: "Hujjatni tizimdan o'chirish" },

    // Gallery
    'GALLERY_CREATE': { title: "Fotogalereyaga rasm qo'shish", desc: "Fotogalereyaga yangi rasmlar yuklash" },
    'GALLERY_READ': { title: "Galereyani ko'rish", desc: "Fotogalereya ro'yxatini ko'rish" },
    'GALLERY_VIEW': { title: "Galereyani ko'rish", desc: "Fotogalereya ro'yxatini ko'rish" },
    'GALLERY_UPDATE': { title: "Galereyani tahrirlash", desc: "Galereya rasmlarini o'zgartirish" },
    'GALLERY_DELETE': { title: "Galereyani o'chirish", desc: "Galereya rasmlarini o'chirish" },

    // Green Institute
    'GREEN_INSTITUTE_CREATE': { title: "Yashil institutga qo'shish", desc: "Ekologik loyihalarni kiritish" },
    'GREEN_INSTITUTE_READ': { title: "Yashil institutni ko'rish", desc: "Yashil institut ma'lumotlarini ko'rish" },
    'GREEN_INSTITUTE_VIEW': { title: "Yashil institutni ko'rish", desc: "Yashil institut ma'lumotlarini ko'rish" },
    'GREEN_INSTITUTE_UPDATE': { title: "Yashil institutni tahrirlash", desc: "Ekologik loyihalarni tahrirlash" },
    'GREEN_INSTITUTE_DELETE': { title: "Yashil institutni o'chirish", desc: "Yashil institut loyihalarini o'chirish" },

    // Academic Degrees
    'ACADEMIC_DEGREE_CREATE': { title: "Ilmiy daraja qo'shish", desc: "Yangi ilmiy daraja kiritish" },
    'ACADEMIC_DEGREE_READ': { title: "Ilmiy darajalarni ko'rish", desc: "Ilmiy darajalar ro'yxatini ko'rish" },
    'ACADEMIC_DEGREE_UPDATE': { title: "Ilmiy darajani tahrirlash", desc: "Ilmiy daraja ma'lumotlarini o'zgartirish" },
    'ACADEMIC_DEGREE_DELETE': { title: "Ilmiy darajani o'chirish", desc: "Ilmiy darajani tizimdan o'chirish" },

    // Positions
    'POSITION_CREATE': { title: "Lavozim qo'shish", desc: "Yangi lavozim yaratish" },
    'POSITION_READ': { title: "Lavozimlarni ko'rish", desc: "Lavozimlar ro'yxatini ko'rish" },
    'POSITION_UPDATE': { title: "Lavozimni tahrirlash", desc: "Lavozim ma'lumotlarini yangilash" },
    'POSITION_DELETE': { title: "Lavozimni o'chirish", desc: "Lavozimni o'chirib tashlash" },

    // Centers
    'CENTER_CREATE': { title: "Markaz/Bo'lim qo'shish", desc: "Yangi markaz yoki bo'lim kiritish" },
    'CENTER_READ': { title: "Markazlarni ko'rish", desc: "Markaz va bo'limlarni ko'rish" },
    'CENTER_UPDATE': { title: "Markazni tahrirlash", desc: "Markaz yoki bo'lim ma'lumotlarini o'zgartirish" },
    'CENTER_DELETE': { title: "Markazni o'chirish", desc: "Markaz yoki bo'limni o'chirish" },

    // Lowercase items
    'teachers': { title: "O'qituvchilar va Dekanat", desc: "O'qituvchilar hamda dekanat ma'lumotlarini boshqarish" },
    'departments': { title: "Kafedralar va Markazlar", desc: "Kafedra va markazlar tarkibini tahrirlash" },
    'news': { title: "Yangiliklar va E'lonlar", desc: "Yangilik hamda e'lonlarni joylash va tahrirlash" },
    'faculties': { title: "Fakultetlar", desc: "Fakultetlar ma'lumotlarini o'zgartirish" },
    'leadership': { title: "Rektorat va Rahbariyat", desc: "Rahbariyat tarkibini boshqarish" },
    'documents': { title: "Me'yoriy Hujjatlar", desc: "Hujjatlar hamda nizomlarni yuklash" },
    'dormitory': { title: "Talabalar Turar Joyi (TTJ)", desc: "Yotoqxona arizalari va xonalari boshqaruvi" },
    'admission': { title: "Qabul Komissiyasi", desc: "Qabul va abituriyentlar bo'limi" },
    'greenInstitute': { title: "Yashil Institut", desc: "Ekologik loyihalar boshqaruvi" },
    'gallery': { title: "Fotogalereya va Infografika", desc: "Rasmlar hamda infografikalarni yuklash" }
  };

  if (dictionary[rawName] || dictionary[upper]) {
    const item = dictionary[rawName] || dictionary[upper];
    return {
      title: item.title,
      desc: rawDesc || item.desc,
      code: rawName
    };
  }

  // Dynamic parser for any OTHER_CODE_CREATE / ACTION
  const actionTranslations = {
    'CREATE': "qo'shish",
    'ADD': "qo'shish",
    'UPDATE': "tahrirlash",
    'EDIT': "tahrirlash",
    'DELETE': "o'chirish",
    'REMOVE': "o'chirish",
    'READ': "ko'rish",
    'VIEW': "ko'rish",
    'GET': "ko'rish",
    'ASSIGN': "biriktirish",
    'MANAGE': "boshqarish"
  };

  const entityTranslations = {
    'ROLE': "Rol",
    'ROLES': "Rollar",
    'USER': "Foydalanuvchi",
    'USERS': "Foydalanuvchilar",
    'PERMISSION': "Ruxsatnoma",
    'PERMISSIONS': "Ruxsatnomalar",
    'DEPARTMENT': "Kafedra",
    'DEPARTMENTS': "Kafedralar",
    'FACULTY': "Fakultet",
    'FACULTIES': "Fakultetlar",
    'TEACHER': "O'qituvchi",
    'TEACHERS': "O'qituvchilar",
    'EMPLOYEE': "Xodim",
    'EMPLOYEES': "Xodimlar",
    'NEWS': "Yangiliklar",
    'ANNOUNCEMENT': "E'lon",
    'ANNOUNCEMENTS': "E'lonlar",
    'DOCUMENT': "Hujjat",
    'DOCUMENTS': "Hujjatlar",
    'GALLERY': "Galereya",
    'LEADER': "Rahbariyat",
    'DORMITORY': "Talabalar turar joyi",
    'FILE': "Fayllar",
    'AUDIT': "Audit"
  };

  const parts = upper.split('_');
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const entityParts = parts.slice(0, parts.length - 1).join('_');
    const actionUz = actionTranslations[lastPart];
    const entityUz = entityTranslations[entityParts] || parts.slice(0, parts.length - 1).join(' ').toLowerCase();

    if (actionUz) {
      return {
        title: `${entityUz} ${actionUz}`,
        desc: rawDesc || `${entityUz} bo'yicha tizim ruxsati`,
        code: rawName
      };
    }
  }

  return {
    title: rawName,
    desc: rawDesc || "Tizim ruxsatnomasi",
    code: rawName
  };
};

export default function RolesAdmin() {
  const [rolesList, setRolesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Add role state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete role state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Selected role for permissions
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(null);
  const [rolePermissionsMap, setRolePermissionsMap] = useState({});
  const [loadingRolePerms, setLoadingRolePerms] = useState(false);
  const [togglingPermId, setTogglingPermId] = useState(null);
  const [permSearch, setPermSearch] = useState('');

  // Permissions modal state
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [modalSelectedPermIds, setModalSelectedPermIds] = useState([]);
  const [modalSearch, setModalSearch] = useState('');
  const [savingPerms, setSavingPerms] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permRes] = await Promise.allSettled([
        rolesAPI.getAll(),
        permissionsAPI.getAll()
      ]);

      const rawRoles = rolesRes.status === 'fulfilled' ? (Array.isArray(rolesRes.value) ? rolesRes.value : rolesRes.value?.data || []) : [];
      const rawPerms = permRes.status === 'fulfilled' ? (Array.isArray(permRes.value) ? permRes.value : permRes.value?.data || []) : [];

      setRolesList(rawRoles);
      setPermissionsList(rawPerms);

      // Auto-select first role if available and not selected yet
      if (rawRoles.length > 0) {
        const firstRole = rawRoles[0];
        setSelectedRoleForPerms(prev => prev || firstRole);
        rawRoles.forEach(r => {
          if (r && r.id) fetchPermissionsForRole(r.id);
        });
      }
    } catch (e) {
      console.warn('API error in RolesAdmin:', e.message);
      setRolesList([]);
      setPermissionsList([]);
    } finally {
      setLoading(false);
    }
  };

  const syncRolePermissions = (roleId, roleName, permIds, perms = permissionsList) => {
    if (!roleId || !roleName || !Array.isArray(permIds)) return;
    const codes = permIds.map(id => {
      const found = perms.find(p => p.id === id);
      return found ? found.name : (typeof id === 'string' ? id : null);
    }).filter(Boolean);
    saveRolePermissionsToRegistry(roleId, roleName, codes);
  };

  const fetchPermissionsForRole = async (roleId) => {
    setLoadingRolePerms(true);
    try {
      const res = await rolesAPI.getPermissionsByRole(roleId);
      const perms = Array.isArray(res) ? res : (res?.data || res?.permissions || []);
      const ids = perms.map(p => (typeof p === 'object' && p !== null ? p.id : p));
      setRolePermissionsMap(prev => ({ ...prev, [roleId]: ids }));
      
      const roleObj = rolesList.find(r => r.id === roleId) || selectedRoleForPerms;
      if (roleObj) {
        syncRolePermissions(roleId, roleObj.name, ids, permissionsList);
      }
      return ids;
    } catch (err) {
      console.warn(`Failed to fetch permissions for role ${roleId}:`, err.message);
      return [];
    } finally {
      setLoadingRolePerms(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      setModalError("Rol nomini kiriting");
      return;
    }

    setSubmitting(true);
    setModalError('');
    try {
      const created = await rolesAPI.create({ name: newRoleName.trim() });
      showNotification("Yangi rol muvaffaqiyatli yaratildi", 'success');
      setIsAddModalOpen(false);
      setNewRoleName('');
      await fetchData();
      if (created && created.id) {
        setSelectedRoleForPerms(created);
        fetchPermissionsForRole(created.id);
      }
    } catch (err) {
      setModalError(err.message || "Rol yaratishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setSubmitting(true);
    try {
      await rolesAPI.delete(selectedRole.id);
      showNotification("Rol o'chirildi", 'success');
      setDeleteModalOpen(false);
      if (selectedRoleForPerms?.id === selectedRole.id) {
        setSelectedRoleForPerms(null);
      }
      setSelectedRole(null);
      await fetchData();
    } catch (err) {
      showNotification(err.message || "Rolni o'chirishda xatolik yuz berdi", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRoleForPerms(role);
    if (!rolePermissionsMap[role.id]) {
      fetchPermissionsForRole(role.id);
    }
  };

  // Inline toggle permission in right column for selected role
  const handleToggleInlinePermission = async (permId) => {
    if (!selectedRoleForPerms) {
      showNotification("Avval rolni tanlang", 'error');
      return;
    }

    const currentIds = rolePermissionsMap[selectedRoleForPerms.id] || [];
    const isAssigned = currentIds.includes(permId);

    setTogglingPermId(permId);
    try {
      if (isAssigned) {
        await rolesAPI.removePermission(selectedRoleForPerms.id, permId);
        const nextIds = (rolePermissionsMap[selectedRoleForPerms.id] || []).filter(id => id !== permId);
        setRolePermissionsMap(prev => ({
          ...prev,
          [selectedRoleForPerms.id]: nextIds
        }));
        syncRolePermissions(selectedRoleForPerms.id, selectedRoleForPerms.name, nextIds);
        showNotification("Ruxsatnoma roldan olib tashlandi", 'success');
      } else {
        await rolesAPI.assignPermission(selectedRoleForPerms.id, permId);
        const nextIds = [...(rolePermissionsMap[selectedRoleForPerms.id] || []), permId];
        setRolePermissionsMap(prev => ({
          ...prev,
          [selectedRoleForPerms.id]: nextIds
        }));
        syncRolePermissions(selectedRoleForPerms.id, selectedRoleForPerms.name, nextIds);
        showNotification("Ruxsatnoma rolga biriktirildi", 'success');
      }
    } catch (err) {
      showNotification(err.message || "Ruxsatnomani o'zgartirishda xatolik", 'error');
    } finally {
      setTogglingPermId(null);
    }
  };

  // Open full modal for role permissions
  const openPermissionsModal = async (role) => {
    setSelectedRoleForPerms(role);
    setModalSearch('');
    setIsPermModalOpen(true);
    const cachedIds = rolePermissionsMap[role.id];
    if (cachedIds) {
      setModalSelectedPermIds(cachedIds);
    }
    const freshIds = await fetchPermissionsForRole(role.id);
    setModalSelectedPermIds(freshIds);
  };

  // Save all permissions from modal
  const handleSaveModalPermissions = async () => {
    if (!selectedRoleForPerms) return;
    setSavingPerms(true);
    try {
      const initialIds = new Set(rolePermissionsMap[selectedRoleForPerms.id] || []);
      const currentIds = new Set(modalSelectedPermIds);

      const toAdd = [...currentIds].filter(id => !initialIds.has(id));
      const toRemove = [...initialIds].filter(id => !currentIds.has(id));

      if (toAdd.length === 0 && toRemove.length === 0) {
        setIsPermModalOpen(false);
        return;
      }

      const promises = [
        ...toAdd.map(id => rolesAPI.assignPermission(selectedRoleForPerms.id, id)),
        ...toRemove.map(id => rolesAPI.removePermission(selectedRoleForPerms.id, id))
      ];

      const results = await Promise.allSettled(promises);
      const failed = results.filter(r => r.status === 'rejected');

      const updatedIds = await fetchPermissionsForRole(selectedRoleForPerms.id);
      setModalSelectedPermIds(updatedIds);
      syncRolePermissions(selectedRoleForPerms.id, selectedRoleForPerms.name, updatedIds);

      if (failed.length > 0) {
        showNotification(`${promises.length - failed.length} ta o'zgarish saqlandi, ${failed.length} tasida xatolik yuz berdi`, 'error');
      } else {
        showNotification("Rol ruxsatnomalari muvaffaqiyatli saqlandi", 'success');
        setIsPermModalOpen(false);
      }
    } catch (err) {
      showNotification(err.message || "Ruxsatlarni saqlashda xatolik yuz berdi", 'error');
    } finally {
      setSavingPerms(false);
    }
  };

  const currentRolePermIds = selectedRoleForPerms ? (rolePermissionsMap[selectedRoleForPerms.id] || []) : [];

  const filteredPermissions = permissionsList.filter(p => {
    const q = permSearch.toLowerCase().trim();
    if (!q) return true;
    const uz = getPermissionUzbekInfo(p);
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      uz.title.toLowerCase().includes(q) ||
      uz.desc.toLowerCase().includes(q)
    );
  });

  const modalFilteredPermissions = permissionsList.filter(p => {
    const q = modalSearch.toLowerCase().trim();
    if (!q) return true;
    const uz = getPermissionUzbekInfo(p);
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      uz.title.toLowerCase().includes(q) ||
      uz.desc.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 shadow-xl border rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[70] ${
          notification.type === 'error'
            ? 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            notification.type === 'error'
              ? 'bg-red-100 text-red-500 dark:bg-red-900/50'
              : 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/50'
          }`}>
            {notification.type === 'error' ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          </div>
          <span className="text-slate-800 dark:text-slate-100 font-medium text-sm">{notification.message}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rollar va Ruxsatnomalar</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Foydalanuvchilar rollari va tizim ruxsatnomalari boshqaruvi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-violet-500" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">Tizim rollari</h3>
                <p className="text-xs text-slate-400 m-0">Rolni tanlab ruxsatlarini boshqaring</p>
              </div>
            </div>
            <button
              onClick={() => {
                setNewRoleName('');
                setModalError('');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Rol qo'shish</span>
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0eb99c]" />
                <p className="text-xs">Yuklanmoqda...</p>
              </div>
            ) : rolesList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-sm">
                Hech qanday rol topilmadi
              </div>
            ) : (
              rolesList.map(role => {
                const isSelected = selectedRoleForPerms?.id === role.id;
                const assignedCount = (rolePermissionsMap[role.id] || []).length;
                return (
                  <div
                    key={role.id}
                    onClick={() => handleSelectRole(role)}
                    className={`p-4 rounded-xl flex items-center justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-300 dark:border-teal-700 shadow-sm ring-2 ring-[#0eb99c]/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm m-0">{role.name}</h4>
                        {isSelected && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#0eb99c] text-white">
                            Faol
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 m-0">
                        {role.description || "Tizim foydalanuvchi roli"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          ID: {role.id}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                          {assignedCount} ta ruxsat
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openPermissionsModal(role)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-[#0eb99c] border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-colors shadow-2xs"
                        title="Ruxsatnomalarni tahrirlash"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Ruxsatlar</span>
                      </button>
                      <button
                        onClick={() => { setSelectedRole(role); setDeleteModalOpen(true); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Permissions List / Role Assignment */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                  {selectedRoleForPerms ? (
                    <span className="flex items-center gap-2">
                      <span>Ruxsatlar:</span>
                      <span className="text-[#0eb99c] font-black">{selectedRoleForPerms.name}</span>
                    </span>
                  ) : "Tizim ruxsatnomalari"}
                </h3>
                <p className="text-xs text-slate-400 m-0">
                  {selectedRoleForPerms
                    ? `${currentRolePermIds.length} / ${permissionsList.length} ta ruxsat berilgan`
                    : "Rolni tanlang yoki ruxsatlarni ko'ring"}
                </p>
              </div>
            </div>

            {selectedRoleForPerms && (
              <button
                onClick={() => openPermissionsModal(selectedRoleForPerms)}
                className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-[#0eb99c] text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Kengaytirilgan boshqaruv</span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={permSearch}
              onChange={e => setPermSearch(e.target.value)}
              placeholder="Ruxsatnomalarni qidirish..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c]"
            />
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[520px] pr-1">
            {loading || loadingRolePerms ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                <p className="text-xs">Ruxsatnomalar tekshirilmoqda...</p>
              </div>
            ) : filteredPermissions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-sm">
                Ruxsatnomalar topilmadi
              </div>
            ) : (
              filteredPermissions.map(perm => {
                const isAssigned = currentRolePermIds.includes(perm.id);
                const isToggling = togglingPermId === perm.id;
                const uzInfo = getPermissionUzbekInfo(perm);

                return (
                  <div
                    key={perm.id}
                    onClick={() => selectedRoleForPerms && handleToggleInlinePermission(perm.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      selectedRoleForPerms ? 'cursor-pointer' : ''
                    } ${
                      isAssigned
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="pr-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs m-0">
                          {uzInfo.title}
                        </h4>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {perm.name}
                        </span>
                        {isAssigned && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                            BERILGAN
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 m-0">
                        {uzInfo.desc}
                      </p>
                    </div>

                    {selectedRoleForPerms ? (
                      <div className="shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggleInlinePermission(perm.id)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isAssigned ? 'bg-[#0eb99c]' : 'bg-slate-300 dark:bg-slate-700'
                          } ${isToggling ? 'opacity-50' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isAssigned ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        RUXSAT
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Permissions Management Modal */}
      {isPermModalOpen && selectedRoleForPerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-950/60 text-[#0eb99c] rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0 flex items-center gap-2">
                    <span>Rol Huquqlari:</span>
                    <span className="text-[#0eb99c]">{selectedRoleForPerms.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                    Ushbu rolga tizim ruxsatnomalarini biriktiring yoki olib tashlang
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPermModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions & Search Bar */}
            <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Belgilangan: <strong className="text-[#0eb99c]">{modalSelectedPermIds.length}</strong> / {permissionsList.length} ta
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = permissionsList.map(p => p.id);
                      setModalSelectedPermIds(allIds);
                    }}
                    className="text-[#0eb99c] hover:underline font-medium cursor-pointer flex items-center gap-1"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Barchasiga ruxsat berish</span>
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => setModalSelectedPermIds([])}
                    className="text-slate-500 hover:underline font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Barchasini tozalash</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  placeholder="Ruxsatnomalarni qidirish..."
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c]"
                />
              </div>
            </div>

            {/* Permissions List */}
            <div className="p-6 overflow-y-auto space-y-2.5 flex-1 max-h-[480px]">
              {loadingRolePerms ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2 text-[#0eb99c]" />
                  <p className="text-sm">Ruxsatnomalar yuklanmoqda...</p>
                </div>
              ) : modalFilteredPermissions.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-sm">
                  Ruxsatnomalar topilmadi
                </div>
              ) : (
                modalFilteredPermissions.map(perm => {
                  const isChecked = modalSelectedPermIds.includes(perm.id);
                  const uzInfo = getPermissionUzbekInfo(perm);

                  return (
                    <div
                      key={perm.id}
                      onClick={() => {
                        setModalSelectedPermIds(prev =>
                          isChecked ? prev.filter(id => id !== perm.id) : [...prev, perm.id]
                        );
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800/80 shadow-xs'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="pr-4 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 m-0">
                            {uzInfo.title}
                          </h4>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {perm.name}
                          </span>
                          {isChecked && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
                              FAOL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                          {uzInfo.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalSelectedPermIds(prev =>
                            isChecked ? prev.filter(id => id !== perm.id) : [...prev, perm.id]
                          );
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isChecked ? 'bg-[#0eb99c]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setIsPermModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={savingPerms}
                onClick={handleSaveModalPermissions}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {savingPerms ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <span>Saqlash</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0 flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-500" />
                <span>Yangi rol qo'shish</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateRole} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Rol nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Masalan: ROLE_ADMIN, ROLE_MODERATOR..."
                  className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0eb99c] focus:border-[#0eb99c] transition-colors"
                  autoFocus
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  API endpoint: <code className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-violet-600 dark:text-violet-400">POST /api/roles/create</code>
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0eb99c] hover:bg-[#0ba087] rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <span>Saqlash</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Role Confirmation Modal */}
      {deleteModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Rolni o'chirish</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Haqiqatan ham <strong className="text-slate-700 dark:text-slate-200">"{selectedRole.name}"</strong> rolini o'chirib tashlamoqchimisiz?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => { setDeleteModalOpen(false); setSelectedRole(null); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteRole}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>O'chirilmoqda...</span>
                  </>
                ) : (
                  <span>O'chirish</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


