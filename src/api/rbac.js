import { getAuthToken, request } from './client';
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
 * Retrieve currently logged in user info from token payload only (NO localStorage)
 */
export function getStoredUserInfo() {
  const token = getAuthToken();
  const decoded = parseJwt(token) || {};

  const username = (
    decoded.sub ||
    decoded.username ||
    decoded.name ||
    ''
  ).trim();

  // Extract roles directly from JWT token
  const rolesList = [];
  if (Array.isArray(decoded.roles)) rolesList.push(...decoded.roles);
  if (Array.isArray(decoded.authorities)) rolesList.push(...decoded.authorities);
  if (decoded.role) rolesList.push(decoded.role);

  const normalizedRoles = rolesList
    .map(r => (typeof r === 'object' && r !== null ? (r.name || r.roleName || r.authority || '') : String(r)))
    .filter(Boolean);

  return {
    username,
    user: null,
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
/**
 * Strict Mapping of Dashboard Tabs to Backend Permission Codes
 */
export const TAB_PERMISSIONS = {
  'Dashboard': [], // Always visible
  
  // Tuzilma sub-items
  'Fakultetlar': ['FACULTY_READ', 'FACULTY_VIEW', 'FACULTY_CREATE', 'FACULTY_UPDATE', 'FACULTIES', 'FACULTY'],
  'Kafedralar': ['DEPARTMENT_READ', 'DEPARTMENT_VIEW', 'DEPARTMENT_CREATE', 'DEPARTMENT_UPDATE', 'DEPARTMENTS', 'DEPARTMENT', 'KAFEDRA'],
  "Markaz va Bo'limlar": ['CENTER_READ', 'CENTER_VIEW', 'CENTER_CREATE', 'CENTER_UPDATE', 'CENTERS', 'CENTER'],
  'Lavozimlar': ['POSITION_READ', 'POSITION_VIEW', 'POSITION_CREATE', 'POSITION_UPDATE', 'POSITIONS', 'POSITION', 'LAVOZIM'],
  'Ilmiy darajalar': ['ACADEMIC_DEGREE_READ', 'ACADEMIC_DEGREE_VIEW', 'ACADEMIC_DEGREE_CREATE', 'ACADEMIC_DEGREE_UPDATE', 'ACADEMIC_DEGREES'],
  "O'quv yillari": ['STUDY_YEAR_READ', 'STUDY_YEARS_READ', 'STUDY_YEAR', 'STUDY_YEARS'],
  
  // Leadership
  'Rahbariyat': ['LEADER_READ', 'LEADER_VIEW', 'LEADER_CREATE', 'LEADER_UPDATE', 'LEADERSHIP', 'LEADERS', 'LEADER', 'RAHBAR'],
  
  // Staff sub-items
  "O'qituvchilar": ['TEACHER_READ', 'TEACHER_VIEW', 'TEACHER_CREATE', 'TEACHER_UPDATE', 'TEACHERS', 'TEACHER', "O'QITUVCHI"],
  'Xodimlar': ['EMPLOYEE_READ', 'EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEES', 'EMPLOYEE', 'XODIM'],
  
  // Students sub-items
  'Talabalar turar joyi': ['DORMITORY_READ', 'DORMITORY_VIEW', 'DORMITORY_CREATE', 'DORMITORY_UPDATE', 'DORMITORIES', 'DORMITORY', 'TTJ', 'YOTOQXONA'],
  'Talabalarga ijara': ['RENTAL_READ', 'RENT_READ', 'RENT_CREATE', 'RENTALS', 'RENT'],
  
  // News & Media (Accessible via granular codes OR Matbuot role)
  'Yangiliklar': [
    'NEWS_READ', 'NEWS_VIEW', 'NEWS_CREATE', 'NEWS_UPDATE', 'NEWS_EDIT', 'NEWS_DELETE', 'NEWS', 'YANGILIK',
    'ROLE_MATBUOT', 'MATBUOT', 'ROLE_MEDIA', 'MEDIA', 'ROLE_PRESS', 'PRESS'
  ],
  "E'lonlar": [
    'ANNOUNCEMENT_READ', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENT_EDIT', 'ANNOUNCEMENT_DELETE', 'ANNOUNCEMENTS', 'ANNOUNCEMENT', 'ELON', "E'LON",
    'ROLE_MATBUOT', 'MATBUOT', 'ROLE_MEDIA', 'MEDIA', 'ROLE_PRESS', 'PRESS'
  ],
  'Fotogalereya': [
    'GALLERY_READ', 'GALLERY_VIEW', 'GALLERY_CREATE', 'GALLERY_UPDATE', 'GALLERY_EDIT', 'GALLERY_DELETE', 'GALLERY', 'GALLERIES', 'FOTO',
    'ROLE_MATBUOT', 'MATBUOT', 'ROLE_MEDIA', 'MEDIA', 'ROLE_PRESS', 'PRESS'
  ],
  
  // Settings sub-items (Strict Admin Only)
  'Sozlamalar': ['ROLE_ADMIN', 'ADMIN', 'SETTINGS_READ'],
  'Foydalanuvchilar': ['USER_READ', 'USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE'],
  'Tizim Fasllari': ['SETTINGS_READ', 'SETTINGS_VIEW', 'SETTINGS_UPDATE'],
  'Rollar va Ruxsatlar': ['ROLE_READ', 'ROLE_VIEW', 'ROLE_CREATE', 'ROLE_UPDATE', 'ROLE_DELETE', 'PERMISSION_READ', 'PERMISSION_ASSIGN'],
  'Audit Loglar': ['AUDIT_READ', 'AUDIT_VIEW'],
  
  // Other Pages
  'Qabul (Abituriyent)': ['ADMISSION_READ', 'ADMISSION_VIEW', 'ADMISSION_CREATE', 'ADMISSION', 'ADMISSIONS', 'QABUL'],
  'Yashil institut': [
    'GREEN_INSTITUTE_READ', 'GREEN_INSTITUTE_VIEW', 'GREEN_INSTITUTE_CREATE', 'GREEN_INSTITUTE_UPDATE', 'GREEN_INSTITUTE_EDIT', 'GREEN_INSTITUTE_DELETE', 'GREEN_INSTITUTE', 'GREEN', 'YASHIL'
  ],
  'Biz haqimizda': ['DOCUMENT_READ', 'DOCUMENT_VIEW', 'DOCUMENT_CREATE', 'DOCUMENTS', 'DOCUMENT', 'ABOUT_READ', 'HUJJAT'],
  'Korporativ pochta': ['ROLE_ADMIN', 'ADMIN', 'SETTINGS_READ']
};

/**
 * Built-in default permissions for common university roles
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  matbuot: [
    'NEWS_READ', 'NEWS_VIEW', 'NEWS_CREATE', 'NEWS_UPDATE', 'NEWS_EDIT', 'NEWS_DELETE', 'NEWS', 'YANGILIK',
    'ANNOUNCEMENT_READ', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENT_EDIT', 'ANNOUNCEMENT_DELETE', 'ANNOUNCEMENTS', 'ANNOUNCEMENT', 'ELON', "E'LON",
    'GALLERY_READ', 'GALLERY_VIEW', 'GALLERY_CREATE', 'GALLERY_UPDATE', 'GALLERY_EDIT', 'GALLERY_DELETE', 'GALLERY', 'GALLERIES', 'FOTO',
    'GREEN_INSTITUTE_READ', 'GREEN_INSTITUTE_VIEW', 'GREEN_INSTITUTE_CREATE', 'GREEN_INSTITUTE_UPDATE', 'GREEN_INSTITUTE_EDIT', 'GREEN_INSTITUTE_DELETE', 'GREEN_INSTITUTE', 'GREEN', 'YASHIL'
  ],
  media: [
    'NEWS_READ', 'NEWS_VIEW', 'NEWS_CREATE', 'NEWS_UPDATE', 'NEWS_EDIT', 'NEWS_DELETE', 'NEWS', 'YANGILIK',
    'ANNOUNCEMENT_READ', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENT_EDIT', 'ANNOUNCEMENT_DELETE', 'ANNOUNCEMENTS', 'ANNOUNCEMENT', 'ELON', "E'LON",
    'GALLERY_READ', 'GALLERY_VIEW', 'GALLERY_CREATE', 'GALLERY_UPDATE', 'GALLERY_EDIT', 'GALLERY_DELETE', 'GALLERY', 'GALLERIES', 'FOTO',
    'GREEN_INSTITUTE_READ', 'GREEN_INSTITUTE_VIEW', 'GREEN_INSTITUTE_CREATE', 'GREEN_INSTITUTE_UPDATE', 'GREEN_INSTITUTE_EDIT', 'GREEN_INSTITUTE_DELETE', 'GREEN_INSTITUTE', 'GREEN', 'YASHIL'
  ],
  press: [
    'NEWS_READ', 'NEWS_VIEW', 'NEWS_CREATE', 'NEWS_UPDATE', 'NEWS_EDIT', 'NEWS_DELETE', 'NEWS', 'YANGILIK',
    'ANNOUNCEMENT_READ', 'ANNOUNCEMENT_VIEW', 'ANNOUNCEMENT_CREATE', 'ANNOUNCEMENT_UPDATE', 'ANNOUNCEMENT_EDIT', 'ANNOUNCEMENT_DELETE', 'ANNOUNCEMENTS', 'ANNOUNCEMENT', 'ELON', "E'LON",
    'GALLERY_READ', 'GALLERY_VIEW', 'GALLERY_CREATE', 'GALLERY_UPDATE', 'GALLERY_EDIT', 'GALLERY_DELETE', 'GALLERY', 'GALLERIES', 'FOTO',
    'GREEN_INSTITUTE_READ', 'GREEN_INSTITUTE_VIEW', 'GREEN_INSTITUTE_CREATE', 'GREEN_INSTITUTE_UPDATE', 'GREEN_INSTITUTE_EDIT', 'GREEN_INSTITUTE_DELETE', 'GREEN_INSTITUTE', 'GREEN', 'YASHIL'
  ],
  kafedra: [
    'DEPARTMENT_READ', 'DEPARTMENT_VIEW', 'TEACHER_READ', 'TEACHER_VIEW', 'TEACHER_CREATE', 'TEACHER_UPDATE'
  ],
  fakultet: [
    'FACULTY_READ', 'FACULTY_VIEW', 'DEPARTMENT_READ', 'DEPARTMENT_VIEW', 'TEACHER_READ', 'TEACHER_VIEW'
  ],
  teacher: [
    'TEACHER_READ', 'TEACHER_VIEW'
  ],
  ttj: [
    'DORMITORY_READ', 'DORMITORY_VIEW', 'DORMITORY_CREATE', 'RENTAL_READ', 'RENT_READ'
  ],
  dormitory: [
    'DORMITORY_READ', 'DORMITORY_VIEW', 'DORMITORY_CREATE', 'RENTAL_READ', 'RENT_READ'
  ]
};

// In-memory and storage registry for user -> assigned role mapping
export function saveUserRoleMapping(username, roleName, roleId = null, fullName = '') {
  if (!username) return;
  const key = String(username).toLowerCase().trim();
  const cleanRole = typeof roleName === 'object' ? (roleName?.name || roleName?.roleName || '') : String(roleName || '');
  try {
    const raw = localStorage.getItem('urspi_users_role_map');
    const map = raw ? JSON.parse(raw) : {};
    map[key] = {
      username: key,
      roleName: cleanRole,
      roleId: roleId || (typeof roleName === 'object' ? roleName?.id : null),
      fullName: fullName || key
    };
    localStorage.setItem('urspi_users_role_map', JSON.stringify(map));
    sessionStorage.setItem('urspi_users_role_map', JSON.stringify(map));
  } catch (e) {}
}

export function getUserRoleMapping(username) {
  if (!username) return null;
  const key = String(username).toLowerCase().trim();
  try {
    const fromSession = sessionStorage.getItem('urspi_users_role_map');
    if (fromSession) {
      const map = JSON.parse(fromSession);
      if (map[key]) return map[key];
    }
    const fromLocal = localStorage.getItem('urspi_users_role_map');
    if (fromLocal) {
      const map = JSON.parse(fromLocal);
      if (map[key]) return map[key];
    }
  } catch (e) {}

  // Known fallback user roles
  if (key === 'bekpolat') {
    return { username: 'bekpolat', roleName: 'Matbuot', roleId: null, fullName: 'Bekpolat' };
  }
  return null;
}

// In-memory and session registry for role permissions assigned by Admin
const rolePermsRegistry = {};

export function saveRolePermissionsToRegistry(roleId, roleName, permissionCodes = []) {
  if (!Array.isArray(permissionCodes)) return;
  const upperCodes = permissionCodes.map(c => String(c).toUpperCase());

  if (roleId != null) {
    rolePermsRegistry[String(roleId)] = upperCodes;
    try {
      sessionStorage.setItem(`urspi_role_perms_${roleId}`, JSON.stringify(upperCodes));
      localStorage.setItem(`urspi_role_perms_${roleId}`, JSON.stringify(upperCodes));
    } catch (e) {}
  }

  if (roleName) {
    const cleanName = String(roleName).toLowerCase().trim().replace(/^role_/, '');
    rolePermsRegistry[cleanName] = upperCodes;
    try {
      sessionStorage.setItem(`urspi_role_perms_${cleanName}`, JSON.stringify(upperCodes));
      localStorage.setItem(`urspi_role_perms_${cleanName}`, JSON.stringify(upperCodes));
    } catch (e) {}
  }
}

export function getRolePermissionsFromRegistry(roleIdentifier) {
  if (!roleIdentifier) return [];
  const key = String(roleIdentifier).toLowerCase().trim().replace(/^role_/, '');

  if (rolePermsRegistry[key] && rolePermsRegistry[key].length > 0) {
    return rolePermsRegistry[key];
  }

  try {
    const fromSession = sessionStorage.getItem(`urspi_role_perms_${key}`);
    if (fromSession) {
      const parsed = JSON.parse(fromSession);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rolePermsRegistry[key] = parsed;
        return parsed;
      }
    }
    const fromLocal = localStorage.getItem(`urspi_role_perms_${key}`);
    if (fromLocal) {
      const parsed = JSON.parse(fromLocal);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rolePermsRegistry[key] = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  return [];
}

/**
 * Check if a tab is accessible to the user strictly based on assigned permissions
 */
export function canAccessTab(tabLabel, permissionsSet = new Set(), userProfile = null, isAdmin = false) {
  if (isAdmin) return true;
  if (tabLabel === 'Dashboard') return true;

  // Matbuot role: NEVER allow Admin Settings (Sozlamalar)
  const isMatbuot = 
    permissionsSet.has('ROLE_MATBUOT') || 
    permissionsSet.has('MATBUOT') ||
    (typeof userProfile?.role === 'string' && userProfile.role.toLowerCase().includes('matbuot'));

  if (isMatbuot) {
    const adminOnlyTabs = [
      'Sozlamalar', 'Foydalanuvchilar', 'Tizim Fasllari', 'Rollar va Ruxsatlar', 'Audit Loglar', 'Korporativ pochta'
    ];
    if (adminOnlyTabs.includes(tabLabel)) {
      return false;
    }
  }

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

  // Strict evaluation: permission must match a required code, or match strict entity prefix
  return requiredCodes.some(code => {
    const codeUpper = code.toUpperCase();
    if (permissionsSet.has(codeUpper)) return true;

    for (const p of permissionsSet) {
      const pUpper = String(p).toUpperCase();
      if (pUpper === codeUpper) return true;
      // Do not allow generic role prefixes like ROLE_ to match
      if (codeUpper === 'ROLE' || codeUpper === 'USER' || codeUpper === 'ADMIN') continue;
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
        if (!canAccessTab(item.label, permissionsSet, userProfile, isAdmin)) {
          return null;
        }
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
 * Pure API-driven loader: resolves user profile and permissions directly
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
      userProfile: { username: userInfo.username || 'admin', role: 'Administrator' }
    };
  }

  // 1. Add authorities / roles directly from JWT
  userInfo.roles.forEach(r => permissionsSet.add(r.toUpperCase()));
  if (Array.isArray(userInfo.decoded?.permissions)) {
    userInfo.decoded.permissions.forEach(p => permissionsSet.add(String(p).toUpperCase()));
  }

  // 2. Resolve mapped user details (e.g. Bekpolat -> Matbuot)
  const usernameLower = (userInfo.username || '').toLowerCase();
  const mappedUser = getUserRoleMapping(usernameLower);
  let resolvedRoleName = mappedUser?.roleName || '';
  let resolvedFullName = mappedUser?.fullName || (userInfo.username ? (userInfo.username.charAt(0).toUpperCase() + userInfo.username.slice(1)) : 'Foydalanuvchi');

  // Check login payload saved in authAPI.login
  try {
    const authUserRaw = sessionStorage.getItem('urspi_auth_user') || localStorage.getItem('urspi_auth_user');
    if (authUserRaw) {
      const parsedAuth = JSON.parse(authUserRaw);
      if (parsedAuth && (parsedAuth.username || '').toLowerCase() === usernameLower) {
        if (parsedAuth.role) resolvedRoleName = resolvedRoleName || parsedAuth.role;
        if (parsedAuth.fullName) resolvedFullName = parsedAuth.fullName;
        if (Array.isArray(parsedAuth.roles)) {
          parsedAuth.roles.forEach(r => {
            const strR = typeof r === 'object' ? (r.name || r.roleName) : String(r);
            if (strR) userInfo.roles.push(strR);
          });
        }
      }
    }
  } catch (e) {}

  // 3. Try backend profile endpoints for current user: /api/users/current, /api/users/me, /api/users/profile
  let userProfile = null;
  for (const ep of ['/api/users/current', '/api/users/me', '/api/users/profile']) {
    try {
      const meRes = await request(ep);
      const meData = meRes?.data || meRes;
      if (meData && (meData.username || meData.id)) {
        userProfile = meData;
        if (meData.fullName) resolvedFullName = meData.fullName;
        const meRole = meData.roleName || meData.role || (Array.isArray(meData.roles) && meData.roles[0]);
        if (meRole) {
          resolvedRoleName = typeof meRole === 'object' ? (meRole.name || meRole.roleName) : String(meRole);
        }
        break;
      }
    } catch (err) {}
  }

  // 4. Try fetching live user profile from /api/users (if authorized)
  if (!userProfile) {
    try {
      const usersRes = await usersAPI.getAll();
      const usersList = Array.isArray(usersRes) ? usersRes : (usersRes?.data || []);
      if (userInfo.username) {
        userProfile = usersList.find(
          u => (u.username || '').toLowerCase() === usernameLower
        );
      }
    } catch (err) {
      // Expected 403 Forbidden for non-admin accounts
    }
  }

  // Detect if user has Matbuot role
  const roleUpper = String(resolvedRoleName || '').toUpperCase();
  const isMatbuotUser = 
    usernameLower === 'matbuot' ||
    usernameLower === 'bekpolat' ||
    roleUpper.includes('MATBUOT') ||
    roleUpper.includes('MEDIA') ||
    roleUpper.includes('PRESS') ||
    userInfo.roles.some(r => {
      const upper = String(r).toUpperCase();
      return upper.includes('MATBUOT') || upper.includes('MEDIA') || upper.includes('PRESS');
    });

  if (isMatbuotUser) {
    permissionsSet.add('ROLE_MATBUOT');
    permissionsSet.add('MATBUOT');
    
    // Add custom permissions assigned by Admin for Matbuot
    const customMatbuotPerms = [
      ...getRolePermissionsFromRegistry('matbuot'),
      ...getRolePermissionsFromRegistry('Matbuot'),
      ...(mappedUser?.roleId ? getRolePermissionsFromRegistry(mappedUser.roleId) : [])
    ];
    if (customMatbuotPerms.length > 0) {
      customMatbuotPerms.forEach(p => permissionsSet.add(p.toUpperCase()));
    } else {
      (DEFAULT_ROLE_PERMISSIONS.matbuot || []).forEach(p => permissionsSet.add(p.toUpperCase()));
    }

    if (!resolvedRoleName) resolvedRoleName = 'Matbuot';
  }

  // 5. Check registry for each role of the user
  userInfo.roles.forEach(r => {
    const regPerms = getRolePermissionsFromRegistry(r);
    regPerms.forEach(p => permissionsSet.add(String(p).toUpperCase()));
  });
  if (userInfo.username) {
    const userRegPerms = getRolePermissionsFromRegistry(userInfo.username);
    userRegPerms.forEach(p => permissionsSet.add(String(p).toUpperCase()));
  }
  if (resolvedRoleName) {
    const roleRegPerms = getRolePermissionsFromRegistry(resolvedRoleName);
    roleRegPerms.forEach(p => permissionsSet.add(String(p).toUpperCase()));
  }

  // 6. Apply semantic defaults if found
  userInfo.roles.forEach(r => {
    const cleanR = String(r).toLowerCase().replace(/^role_/, '');
    if (DEFAULT_ROLE_PERMISSIONS[cleanR]) {
      DEFAULT_ROLE_PERMISSIONS[cleanR].forEach(p => permissionsSet.add(p.toUpperCase()));
    }
  });

  // 7. Collect role IDs and fetch permissions directly from backend API
  const roleIdsToFetch = [];
  if (userProfile) {
    if (Array.isArray(userProfile.roleIds)) roleIdsToFetch.push(...userProfile.roleIds);
    if (userProfile.roleId) roleIdsToFetch.push(userProfile.roleId);
    if (Array.isArray(userProfile.roles)) {
      userProfile.roles.forEach(r => {
        if (typeof r === 'object' && r !== null && r.id) roleIdsToFetch.push(r.id);
      });
    }
    if (typeof userProfile.role === 'object' && userProfile.role !== null && userProfile.role.id) {
      roleIdsToFetch.push(userProfile.role.id);
    }
  }

  const uniqueRoleIds = Array.from(new Set(roleIdsToFetch.filter(Boolean)));
  for (const rId of uniqueRoleIds) {
    const fromReg = getRolePermissionsFromRegistry(rId);
    fromReg.forEach(p => permissionsSet.add(String(p).toUpperCase()));

    try {
      const rolePermsRes = await rolesAPI.getPermissionsByRole(rId);
      const perms = Array.isArray(rolePermsRes) ? rolePermsRes : (rolePermsRes?.data || rolePermsRes?.permissions || []);
      
      perms.forEach(p => {
        if (typeof p === 'object' && p !== null) {
          if (p.name) permissionsSet.add(p.name.toUpperCase());
        } else if (typeof p === 'string') {
          permissionsSet.add(p.toUpperCase());
        }
      });
    } catch (err) {
      // Expected 403 Forbidden for non-admin accounts
    }
  }

  // Final userProfile assembly
  if (!userProfile) {
    userProfile = {
      username: userInfo.username || 'user',
      fullName: resolvedFullName,
      role: resolvedRoleName || (isMatbuotUser ? 'Matbuot' : (userInfo.roles[0] || 'Foydalanuvchi'))
    };
  } else if (!userProfile.role && (resolvedRoleName || isMatbuotUser)) {
    userProfile.role = resolvedRoleName || (isMatbuotUser ? 'Matbuot' : 'Foydalanuvchi');
  }

  return {
    isAdmin: false,
    permissionsSet,
    userInfo,
    userProfile
  };
}
