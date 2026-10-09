import { getAuthToken } from './client';
import { usersAPI } from './users';
import { rolesAPI, permissionsAPI } from './roles';

/**
 * Decode JWT token payload safely in browser
 */
export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Retrieve currently logged in user info from token & local storage
 */
export function getStoredUserInfo() {
  const token = getAuthToken();
  const decoded = parseJwt(token) || {};
  
  let storedUser = null;
  try {
    const raw = localStorage.getItem('urspi_current_user');
    if (raw) storedUser = JSON.parse(raw);
  } catch (e) {
    // ignore
  }

  const username = (
    storedUser?.username ||
    decoded.sub ||
    decoded.username ||
    localStorage.getItem('urspi_current_username') ||
    ''
  ).trim();

  // Extract roles
  const rolesList = [];
  if (Array.isArray(storedUser?.roles)) rolesList.push(...storedUser.roles);
  if (storedUser?.role) rolesList.push(storedUser.role);
  if (Array.isArray(decoded.roles)) rolesList.push(...decoded.roles);
  if (Array.isArray(decoded.authorities)) rolesList.push(...decoded.authorities);
  if (decoded.role) rolesList.push(decoded.role);
  
  try {
    const rawRoles = localStorage.getItem('urspi_current_roles');
    if (rawRoles) {
      const parsed = JSON.parse(rawRoles);
      if (Array.isArray(parsed)) rolesList.push(...parsed);
    }
  } catch (e) {
    // ignore
  }

  const normalizedRoles = rolesList
    .map(r => (typeof r === 'object' && r !== null ? (r.name || r.roleName || r.authority || '') : String(r)))
    .filter(Boolean);

  return {
    username,
    user: storedUser,
    roles: normalizedRoles,
    decoded
  };
}

/**
 * Check if the user is a super admin with unrestricted access
 */
export function isSuperAdmin(userInfo) {
  if (!userInfo) return false;
  const username = (userInfo.username || '').toLowerCase();
  if (username === 'admin' || username === 'superadmin') return true;

  const roles = userInfo.roles || [];
  return roles.some((r) => {
    const upper = String(r).toUpperCase();
    return (
      upper === 'ADMIN' ||
      upper === 'ROLE_ADMIN' ||
      upper === 'SUPER_ADMIN' ||
      upper === 'ROLE_SUPER_ADMIN' ||
      upper.includes('ADMINISTRATOR')
    );
  });
}

/**
 * Mapping of Dashboard Tabs to Backend Permission Codes
 */
export const TAB_PERMISSIONS = {
  'Dashboard': [], // Always visible
  
  // Tuzilma sub-items
  'Fakultetlar': ['FACULTY_READ', 'FACULTY_VIEW', 'FACULTY_CREATE', 'FACULTY_UPDATE', 'FACULTIES', 'FACULTY'],
  'Kafedralar': ['DEPARTMENT_READ', 'DEPARTMENT_VIEW', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENTS', 'DEPARTMENT', 'KAFEDRA'],
  "Markaz va Bo'limlar": ['CENTER_READ', 'CENTER_VIEW', 'CENTER_CREATE', 'CENTER_UPDATE', 'CENTERS', 'CENTER', 'DEPARTMENT'],
  'Lavozimlar': ['POSITION_READ', 'POSITION_VIEW', 'POSITION_CREATE', 'POSITION_UPDATE', 'POSITIONS', 'POSITION', 'LAVOZIM'],
  'Ilmiy darajalar': ['ACADEMIC_DEGREE_READ', 'ACADEMIC_DEGREE_VIEW', 'ACADEMIC_DEGREE_CREATE', 'ACADEMIC_DEGREE_UPDATE', 'ACADEMIC_DEGREES', 'DEGREE', 'ILMIY'],
  "O'quv yillari": ['STUDY_YEAR_READ', 'STUDY_YEARS_READ', 'STUDY_YEAR', 'STUDY_YEARS', 'FACULTY_READ', 'DEPARTMENT_READ'],
  
  // Leadership
  'Rahbariyat': ['LEADER_READ', 'LEADER_VIEW', 'LEADER_CREATE', 'LEADER_UPDATE', 'LEADERSHIP', 'LEADERS', 'LEADER', 'RAHBAR'],
  
  // Staff sub-items
  "O'qituvchilar": ['TEACHER_READ', 'TEACHER_VIEW', 'TEACHER_CREATE', 'TEACHER_UPDATE', 'TEACHERS', 'TEACHER', 'O\'QITUVCHI'],
  'Xodimlar': ['EMPLOYEE_READ', 'EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEES', 'EMPLOYEE', 'XODIM'],
  
  // Students sub-items
  'Talabalar turar joyi': ['DORMITORY_READ', 'DORMITORY_VIEW', 'DORMITORY_CREATE', 'DORMITORY_UPDATE', 'DORMITORIES', 'DORMITORY', 'TTJ', 'YOTOQXONA'],
  'Talabalarga ijara': ['RENTAL_READ', 'RENT_READ', 'RENT_CREATE', 'RENTALS', 'RENT', 'DORMITORY', 'IJARA'],
  
  // News & Media
  'Yangiliklar': ['NEWS_READ', 'NEWS_VIEW', 'NEWS_CREATE', 'NEWS_UPDATE', 'NEWS_DELETE', 'NEWS', 'YANGILIK'],
  "E'lonlar": ['ANNOUNCEMENT_READ', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENTS', 'ANNOUNCEMENT', 'ELON', "E'LON"],
  'Fotogalereya': ['GALLERY_READ', 'GALLERY_VIEW', 'GALLERY_CREATE', 'GALLERY_UPDATE', 'GALLERY', 'GALLERIES', 'FOTO'],
  
  // Settings sub-items
  'Foydalanuvchilar': ['USER_READ', 'USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USERS', 'USER', 'FOYDALANUVCHI'],
  'Tizim Fasllari': ['SETTINGS_READ', 'ROLE_READ', 'ADMIN', 'SETTINGS', 'FASL'],
  'Rollar va Ruxsatlar': ['ROLE_READ', 'ROLE_VIEW', 'ROLE_CREATE', 'ROLE_UPDATE', 'PERMISSION_READ', 'PERMISSION_ASSIGN', 'ROLES', 'ROLE', 'RUXSAT'],
  'Audit Loglar': ['AUDIT_READ', 'AUDIT_VIEW', 'AUDIT', 'AUDIT_LOGS'],
  
  // Other Pages
  'Qabul (Abituriyent)': ['ADMISSION_READ', 'ADMISSION_VIEW', 'ADMISSION_CREATE', 'ADMISSION', 'ADMISSIONS', 'QABUL'],
  'Yashil institut': ['GREEN_INSTITUTE_READ', 'GREEN_INSTITUTE_VIEW', 'GREEN_INSTITUTE_CREATE', 'GREEN_INSTITUTE', 'GREEN', 'YASHIL'],
  'Biz haqimizda': ['DOCUMENT_READ', 'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENTS', 'DOCUMENT', 'ABOUT_READ', 'HUJJAT'],
  'Korporativ pochta': ['ROLE_ADMIN', 'ADMIN', 'SETTINGS_READ']
};

/**
 * Module flag mapping for direct user profile permissions
 */
export const MODULE_FLAGS = {
  'Fakultetlar': 'faculties',
  'Kafedralar': 'departments',
  "Markaz va Bo'limlar": 'departments',
  'Lavozimlar': 'departments',
  'Ilmiy darajalar': 'faculties',
  "O'quv yillari": 'faculties',
  "O'qituvchilar": 'teachers',
  'Xodimlar': 'teachers',
  'Yangiliklar': 'news',
  "E'lonlar": 'news',
  'Rahbariyat': 'leadership',
  'Biz haqimizda': 'documents',
  'Talabalar turar joyi': 'dormitory',
  'Talabalarga ijara': 'dormitory',
  'Fotogalereya': 'gallery',
  'Yashil institut': 'greenInstitute',
  'Qabul (Abituriyent)': 'admission'
};

/**
 * Check if a tab is accessible to the user
 */
export function canAccessTab(tabLabel, permissionsSet = new Set(), userProfile = null, isAdmin = false) {
  if (isAdmin) return true;
  if (tabLabel === 'Dashboard') return true;

  // Wildcard check
  if (
    permissionsSet.has('*') ||
    permissionsSet.has('ALL') ||
    permissionsSet.has('ROLE_ADMIN') ||
    permissionsSet.has('SUPER_ADMIN')
  ) {
    return true;
  }

  // Check direct module boolean flag on user profile
  const flagKey = MODULE_FLAGS[tabLabel];
  if (flagKey && userProfile?.permissions && userProfile.permissions[flagKey] === true) {
    return true;
  }

  // Check required codes
  const requiredCodes = TAB_PERMISSIONS[tabLabel];
  if (!requiredCodes || requiredCodes.length === 0) {
    return true;
  }

  return requiredCodes.some(code => {
    const upper = code.toUpperCase();
    if (permissionsSet.has(upper)) return true;
    for (const p of permissionsSet) {
      const pUpper = String(p).toUpperCase();
      if (pUpper === upper) return true;
      if (pUpper.includes(upper) || upper.includes(pUpper)) return true;
    }
    return false;
  });
}

/**
 * Filter NAV_ITEMS to only permitted ones
 */
export function getPermittedNavItems(navItems, permissionsSet, userProfile, isAdmin) {
  return navItems
    .map(item => {
      if (item.subItems) {
        const allowedSubItems = item.subItems.filter(sub =>
          canAccessTab(sub.label, permissionsSet, userProfile, isAdmin)
        );
        if (allowedSubItems.length === 0) return null;
        return { ...item, subItems: allowedSubItems };
      }

      if (canAccessTab(item.label, permissionsSet, userProfile, isAdmin)) {
        return item;
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Async loader to resolve current user's profile and active permissions
 */
export async function loadCurrentUserPermissions() {
  const userInfo = getStoredUserInfo();
  const isAdmin = isSuperAdmin(userInfo);

  const permissionsSet = new Set();
  if (isAdmin) {
    permissionsSet.add('*');
    permissionsSet.add('ROLE_ADMIN');
    return {
      isAdmin: true,
      permissionsSet,
      userInfo,
      userProfile: userInfo.user || { username: userInfo.username, role: 'Administrator' }
    };
  }

  // 1. Check cached permissions in localStorage
  try {
    const cached = localStorage.getItem('urspi_user_permissions');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        parsed.forEach(p => permissionsSet.add(String(p).toUpperCase()));
      }
    }
  } catch (e) {
    // ignore
  }

  // 2. Add JWT authorities / roles
  userInfo.roles.forEach(r => permissionsSet.add(r.toUpperCase()));
  if (Array.isArray(userInfo.decoded?.permissions)) {
    userInfo.decoded.permissions.forEach(p => permissionsSet.add(String(p).toUpperCase()));
  }

  // 3. Resolve userProfile from local storage and fallback cache first
  let userProfile = userInfo.user;
  try {
    const localUsers = JSON.parse(localStorage.getItem('urspi_department_users') || '[]');
    const localMatch = localUsers.find(
      u => (u.username || '').toLowerCase() === userInfo.username.toLowerCase()
    );
    if (localMatch) {
      userProfile = { ...localMatch, ...(userProfile || {}) };
    }
  } catch (e) {
    // ignore
  }

  // 4. Try fetching latest user data from backend API with timeout
  try {
    const usersPromise = usersAPI.getAll();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
    const usersRes = await Promise.race([usersPromise, timeoutPromise]);
    const usersList = Array.isArray(usersRes) ? usersRes : (usersRes?.data || []);
    
    const matched = usersList.find(
      u => (u.username || '').toLowerCase() === userInfo.username.toLowerCase()
    );

    if (matched) {
      userProfile = { ...(userProfile || {}), ...matched };
      localStorage.setItem('urspi_current_user', JSON.stringify(userProfile));
    }
  } catch (err) {
    // ignore network/auth errors, proceed with cached userProfile
  }

  // 5. Gather all assigned role IDs and role names
  const roleIdsToFetch = [];
  const roleNames = [];

  if (userProfile) {
    if (Array.isArray(userProfile.roleIds)) {
      userProfile.roleIds.forEach(id => roleIdsToFetch.push(id));
    }
    if (userProfile.roleId) {
      roleIdsToFetch.push(userProfile.roleId);
    }
    if (Array.isArray(userProfile.roles)) {
      userProfile.roles.forEach(r => {
        if (typeof r === 'object' && r !== null) {
          if (r.id) roleIdsToFetch.push(r.id);
          if (r.name) roleNames.push(r.name);
        } else if (r) {
          roleNames.push(String(r));
        }
      });
    }
    if (typeof userProfile.role === 'object' && userProfile.role !== null) {
      if (userProfile.role.id) roleIdsToFetch.push(userProfile.role.id);
      if (userProfile.role.name) roleNames.push(userProfile.role.name);
    } else if (userProfile.role) {
      roleNames.push(String(userProfile.role));
    }
  }

  // 6. Build catalog of system permissions (ID -> NAME)
  let allPermsMap = {};
  try {
    const cachedPerms = JSON.parse(localStorage.getItem('urspi_cached_system_permissions') || '[]');
    if (Array.isArray(cachedPerms)) {
      cachedPerms.forEach(p => {
        if (p.id) allPermsMap[p.id] = (p.name || '').toUpperCase();
      });
    }
  } catch (e) {}

  try {
    const allPermsPromise = permissionsAPI.getAll();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
    const allPermsRes = await Promise.race([allPermsPromise, timeoutPromise]);
    const allPermsList = Array.isArray(allPermsRes) ? allPermsRes : (allPermsRes?.data || allPermsRes?.content || []);
    if (allPermsList.length > 0) {
      localStorage.setItem('urspi_cached_system_permissions', JSON.stringify(allPermsList));
      allPermsList.forEach(p => {
        if (p.id) allPermsMap[p.id] = (p.name || '').toUpperCase();
      });
    }
  } catch (err) {
    // ignore
  }

  // 7. Resolve role permissions from cached role-permission map & API
  let cachedRoleMap = {};
  try {
    cachedRoleMap = JSON.parse(localStorage.getItem('urspi_cached_role_permissions_map') || '{}');
  } catch (e) {}

  const uniqueRoleIds = Array.from(new Set(roleIdsToFetch.filter(Boolean)));
  for (const rId of uniqueRoleIds) {
    // Check cached map first
    const cachedIds = cachedRoleMap[rId] || cachedRoleMap[String(rId)];
    if (Array.isArray(cachedIds)) {
      cachedIds.forEach(p => {
        if (typeof p === 'object' && p !== null) {
          if (p.name) permissionsSet.add(p.name.toUpperCase());
          else if (p.id && allPermsMap[p.id]) permissionsSet.add(allPermsMap[p.id]);
        } else if (typeof p === 'number' && allPermsMap[p]) {
          permissionsSet.add(allPermsMap[p]);
        } else if (typeof p === 'string') {
          permissionsSet.add(p.toUpperCase());
        }
      });
    }

    // Try fetching fresh permissions from API
    try {
      const rolePermsPromise = rolesAPI.getPermissionsByRole(rId);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000));
      const rolePermsRes = await Promise.race([rolePermsPromise, timeoutPromise]);
      const perms = Array.isArray(rolePermsRes) ? rolePermsRes : (rolePermsRes?.data || rolePermsRes?.permissions || []);
      
      perms.forEach(p => {
        if (typeof p === 'object' && p !== null) {
          if (p.name) permissionsSet.add(p.name.toUpperCase());
          else if (p.id && allPermsMap[p.id]) permissionsSet.add(allPermsMap[p.id]);
        } else if (typeof p === 'number' && allPermsMap[p]) {
          permissionsSet.add(allPermsMap[p]);
        } else if (typeof p === 'string') {
          permissionsSet.add(p.toUpperCase());
        }
      });
    } catch (err) {
      // ignore
    }
  }

  // 8. Add user direct module permissions (from UsersAdmin)
  if (userProfile?.permissions && typeof userProfile.permissions === 'object') {
    const p = userProfile.permissions;
    if (p.teachers) {
      permissionsSet.add('TEACHER_READ');
      permissionsSet.add('TEACHER_CREATE');
      permissionsSet.add('TEACHER_UPDATE');
      permissionsSet.add('TEACHER');
      permissionsSet.add('EMPLOYEE_READ');
      permissionsSet.add('EMPLOYEE');
    }
    if (p.departments) {
      permissionsSet.add('DEPARTMENT_READ');
      permissionsSet.add('DEPARTMENT_CREATE');
      permissionsSet.add('DEPARTMENT');
      permissionsSet.add('CENTER_READ');
      permissionsSet.add('CENTER');
      permissionsSet.add('POSITION_READ');
    }
    if (p.faculties) {
      permissionsSet.add('FACULTY_READ');
      permissionsSet.add('FACULTY_CREATE');
      permissionsSet.add('FACULTY');
      permissionsSet.add('STUDY_YEAR_READ');
      permissionsSet.add('ACADEMIC_DEGREE_READ');
    }
    if (p.news) {
      permissionsSet.add('NEWS_READ');
      permissionsSet.add('NEWS_CREATE');
      permissionsSet.add('NEWS');
      permissionsSet.add('ANNOUNCEMENT_READ');
      permissionsSet.add('ANNOUNCEMENT_CREATE');
      permissionsSet.add('ANNOUNCEMENT');
    }
    if (p.leadership) {
      permissionsSet.add('LEADER_READ');
      permissionsSet.add('LEADER_CREATE');
      permissionsSet.add('LEADER');
      permissionsSet.add('LEADERSHIP');
    }
    if (p.documents) {
      permissionsSet.add('DOCUMENT_READ');
      permissionsSet.add('DOCUMENT_CREATE');
      permissionsSet.add('DOCUMENT');
    }
    if (p.dormitory) {
      permissionsSet.add('DORMITORY_READ');
      permissionsSet.add('DORMITORY_CREATE');
      permissionsSet.add('DORMITORY');
      permissionsSet.add('RENTAL_READ');
    }
    if (p.admission) {
      permissionsSet.add('ADMISSION_READ');
      permissionsSet.add('ADMISSION_CREATE');
      permissionsSet.add('ADMISSION');
    }
    if (p.greenInstitute) {
      permissionsSet.add('GREEN_INSTITUTE_READ');
      permissionsSet.add('GREEN_INSTITUTE_CREATE');
      permissionsSet.add('GREEN_INSTITUTE');
    }
    if (p.gallery) {
      permissionsSet.add('GALLERY_READ');
      permissionsSet.add('GALLERY_CREATE');
      permissionsSet.add('GALLERY');
    }
  }

  // 9. Infer permissions from descriptive role names (e.g., "Kafedra mudiri", "Dekan", "Yangiliklar")
  roleNames.forEach(rn => {
    const lower = rn.toLowerCase();
    if (lower.includes('yangilik') || lower.includes('matbuot') || lower.includes('media') || lower.includes('press')) {
      permissionsSet.add('NEWS_READ');
      permissionsSet.add('NEWS');
      permissionsSet.add('ANNOUNCEMENT_READ');
    }
    if (lower.includes("o'qituvchi") || lower.includes('teacher') || lower.includes('dekan')) {
      permissionsSet.add('TEACHER_READ');
      permissionsSet.add('TEACHER');
      permissionsSet.add('FACULTY_READ');
    }
    if (lower.includes('kafedra') || lower.includes('department')) {
      permissionsSet.add('DEPARTMENT_READ');
      permissionsSet.add('DEPARTMENT');
    }
    if (lower.includes('fakultet') || lower.includes('faculty')) {
      permissionsSet.add('FACULTY_READ');
      permissionsSet.add('FACULTY');
    }
    if (lower.includes('ttj') || lower.includes('talaba') || lower.includes('yotoqxona')) {
      permissionsSet.add('DORMITORY_READ');
      permissionsSet.add('DORMITORY');
      permissionsSet.add('RENTAL_READ');
    }
    if (lower.includes('xodim') || lower.includes('hr') || lower.includes('kadr')) {
      permissionsSet.add('EMPLOYEE_READ');
      permissionsSet.add('EMPLOYEE');
    }
    if (lower.includes('rahbar') || lower.includes('rektor')) {
      permissionsSet.add('LEADER_READ');
      permissionsSet.add('LEADER');
    }
    if (lower.includes('qabul')) {
      permissionsSet.add('ADMISSION_READ');
      permissionsSet.add('ADMISSION');
    }
    if (lower.includes('yashil')) {
      permissionsSet.add('GREEN_INSTITUTE_READ');
      permissionsSet.add('GREEN_INSTITUTE');
    }
    if (lower.includes('galereya') || lower.includes('foto')) {
      permissionsSet.add('GALLERY_READ');
      permissionsSet.add('GALLERY');
    }
  });

  // 10. Cache resolved permissions in localStorage
  localStorage.setItem('urspi_user_permissions', JSON.stringify(Array.from(permissionsSet)));

  return {
    isAdmin: false,
    permissionsSet,
    userInfo,
    userProfile: userProfile || { username: userInfo.username }
  };
}
