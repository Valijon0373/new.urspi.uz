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
 * Strict Mapping of Dashboard Tabs to Backend Permission Codes
 */
export const TAB_PERMISSIONS = {
  'Dashboard': [], // Always visible
  
  // Tuzilma sub-items (strictly isolated)
  'Fakultetlar': ['FACULTY_READ', 'FACULTY_VIEW', 'FACULTY_CREATE', 'FACULTY_UPDATE', 'FACULTIES', 'FACULTY'],
  'Kafedralar': ['DEPARTMENT_READ', 'DEPARTMENT_VIEW', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENTS', 'DEPARTMENT', 'KAFEDRA'],
  "Markaz va Bo'limlar": ['CENTER_READ', 'CENTER_VIEW', 'CENTER_CREATE', 'CENTER_UPDATE', 'CENTERS', 'CENTER'],
  'Lavozimlar': ['POSITION_READ', 'POSITION_VIEW', 'POSITION_CREATE', 'POSITION_UPDATE', 'POSITIONS', 'POSITION', 'LAVOZIM'],
  'Ilmiy darajalar': ['ACADEMIC_DEGREE_READ', 'ACADEMIC_DEGREE_VIEW', 'ACADEMIC_DEGREE_CREATE', 'ACADEMIC_DEGREE_UPDATE', 'ACADEMIC_DEGREES'],
  "O'quv yillari": ['STUDY_YEAR_READ', 'STUDY_YEARS_READ', 'STUDY_YEAR', 'STUDY_YEARS'],
  
  // Leadership
  'Rahbariyat': ['LEADER_READ', 'LEADER_VIEW', 'LEADER_CREATE', 'LEADER_UPDATE', 'LEADERSHIP', 'LEADERS', 'LEADER', 'RAHBAR'],
  
  // Staff sub-items
  "O'qituvchilar": ['TEACHER_READ', 'TEACHER_VIEW', 'TEACHER_CREATE', 'TEACHER_UPDATE', 'TEACHERS', 'TEACHER', 'O\'QITUVCHI'],
  'Xodimlar': ['EMPLOYEE_READ', 'EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEES', 'EMPLOYEE', 'XODIM'],
  
  // Students sub-items
  'Talabalar turar joyi': ['DORMITORY_READ', 'DORMITORY_VIEW', 'DORMITORY_CREATE', 'DORMITORY_UPDATE', 'DORMITORIES', 'DORMITORY', 'TTJ', 'YOTOQXONA'],
  'Talabalarga ijara': ['RENTAL_READ', 'RENT_READ', 'RENT_CREATE', 'RENTALS', 'RENT'],
  
  // News & Media (Matbuot)
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
 * Check if a tab is accessible to the user strictly based on assigned permissions
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

  // Check required codes
  const requiredCodes = TAB_PERMISSIONS[tabLabel];
  if (!requiredCodes || requiredCodes.length === 0) {
    return false;
  }

  // Strict evaluation: permission must exactly equal a required code, or match strict entity prefix
  return requiredCodes.some(code => {
    const codeUpper = code.toUpperCase();
    if (permissionsSet.has(codeUpper)) return true;

    for (const p of permissionsSet) {
      const pUpper = String(p).toUpperCase();
      if (pUpper === codeUpper) return true;
      // Strict prefix check e.g. permission is 'NEWS_READ' and required code is 'NEWS'
      if (pUpper.startsWith(codeUpper + '_') || codeUpper.startsWith(pUpper + '_')) {
        return true;
      }
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

  // 1. Resolve user profile
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

  // 2. Try fetching latest user data from backend API with timeout
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
    // ignore
  }

  // 3. Clean up stale default permissions for Matbuot/Media roles from local storage
  const userRoleStr = (typeof userProfile?.role === 'string' ? userProfile.role : userProfile?.role?.name || '').toLowerCase();
  const usernameStr = (userProfile?.username || userInfo.username || '').toLowerCase();
  const isMatbuotUser = userRoleStr.includes('matbuot') || usernameStr.includes('matbuot') || userRoleStr.includes('press') || userRoleStr.includes('media');

  // 4. Gather assigned role IDs and role names
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

  // 5. Build catalog of system permissions (ID -> NAME)
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

  // 6. Resolve role permissions from cached role-permission map & API
  let cachedRoleMap = {};
  try {
    cachedRoleMap = JSON.parse(localStorage.getItem('urspi_cached_role_permissions_map') || '{}');
  } catch (e) {}

  const uniqueRoleIds = Array.from(new Set(roleIdsToFetch.filter(Boolean)));
  for (const rId of uniqueRoleIds) {
    // Check cached map
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

  // 7. If role has explicit permissions assigned, role permissions are authoritative.
  // Only add userProfile module permissions if NOT Matbuot and not already covered by role
  if (!isMatbuotUser && userProfile?.permissions && typeof userProfile.permissions === 'object') {
    const p = userProfile.permissions;
    if (p.teachers) {
      permissionsSet.add('TEACHER_READ');
      permissionsSet.add('EMPLOYEE_READ');
    }
    if (p.departments) {
      permissionsSet.add('DEPARTMENT_READ');
      permissionsSet.add('CENTER_READ');
    }
    if (p.faculties) {
      permissionsSet.add('FACULTY_READ');
    }
    if (p.news) {
      permissionsSet.add('NEWS_READ');
      permissionsSet.add('ANNOUNCEMENT_READ');
    }
    if (p.leadership) {
      permissionsSet.add('LEADER_READ');
    }
    if (p.documents) {
      permissionsSet.add('DOCUMENT_READ');
    }
    if (p.dormitory) {
      permissionsSet.add('DORMITORY_READ');
    }
    if (p.admission) {
      permissionsSet.add('ADMISSION_READ');
    }
    if (p.greenInstitute) {
      permissionsSet.add('GREEN_INSTITUTE_READ');
    }
    if (p.gallery) {
      permissionsSet.add('GALLERY_READ');
    }
  }

  // 8. If Matbuot, ensure News, Announcements and Gallery are always available
  if (isMatbuotUser) {
    permissionsSet.add('NEWS_READ');
    permissionsSet.add('NEWS_CREATE');
    permissionsSet.add('NEWS_UPDATE');
    permissionsSet.add('NEWS');
    permissionsSet.add('ANNOUNCEMENT_READ');
    permissionsSet.add('ANNOUNCEMENT_CREATE');
    permissionsSet.add('ANNOUNCEMENT');
    permissionsSet.add('GALLERY_READ');
    permissionsSet.add('GALLERY_CREATE');
    permissionsSet.add('GALLERY');

    // STRICTLY REMOVE any Tuzilma permissions that might have leaked from old defaults
    const tuzilmaCodes = [
      'FACULTY_READ', 'FACULTY_VIEW', 'FACULTY_CREATE', 'FACULTY_UPDATE', 'FACULTIES', 'FACULTY',
      'DEPARTMENT_READ', 'DEPARTMENT_VIEW', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENTS', 'DEPARTMENT', 'KAFEDRA',
      'CENTER_READ', 'CENTER_VIEW', 'CENTER_CREATE', 'CENTER_UPDATE', 'CENTERS', 'CENTER',
      'POSITION_READ', 'POSITION_VIEW', 'POSITION_CREATE', 'POSITION_UPDATE', 'POSITIONS', 'POSITION', 'LAVOZIM',
      'ACADEMIC_DEGREE_READ', 'ACADEMIC_DEGREE_VIEW', 'ACADEMIC_DEGREE_CREATE', 'ACADEMIC_DEGREE_UPDATE', 'ACADEMIC_DEGREES',
      'STUDY_YEAR_READ', 'STUDY_YEARS_READ', 'STUDY_YEAR', 'STUDY_YEARS'
    ];
    tuzilmaCodes.forEach(code => permissionsSet.delete(code));
  }

  // 9. Cache resolved permissions in localStorage
  localStorage.setItem('urspi_user_permissions', JSON.stringify(Array.from(permissionsSet)));

  return {
    isAdmin: false,
    permissionsSet,
    userInfo,
    userProfile: userProfile || { username: userInfo.username }
  };
}
