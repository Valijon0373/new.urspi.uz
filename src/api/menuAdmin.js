import { request } from './client';

/**
 * Admin API for Menus, Categories, SubCategories, Infos, and Materials
 * Requires authentication token and relevant permissions:
 * MENU_*, MENU_CATEGORY_*, MENU_SUBCATEGORY_*, MENU_INFO_*, MENU_MATERIAL_*
 */

export const menuAdminAPI = {
  // ── Menus ──
  getMenus: () => request('/api/menus'),
  getMenuById: (id) => request(`/api/menus/${id}`),
  createMenu: (data) => request('/api/menus', { method: 'POST', body: data }),
  updateMenu: (id, data) => request(`/api/menus/${id}`, { method: 'PUT', body: data }),
  deleteMenu: (id) => request(`/api/menus/${id}`, { method: 'DELETE' }),

  // ── Menu Categories ──
  getCategories: (menuId) => {
    const hasId = menuId !== undefined && menuId !== null && String(menuId).trim() !== '';
    return request(hasId ? `/api/menu-categories?menuId=${encodeURIComponent(menuId)}` : '/api/menu-categories');
  },
  getCategoryById: (id) => request(`/api/menu-categories/${id}`),
  createCategory: (data) => request('/api/menu-categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => request(`/api/menu-categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id) => request(`/api/menu-categories/${id}`, { method: 'DELETE' }),

  // ── Menu SubCategories ──
  getSubCategories: (categoryId) => {
    const hasId = categoryId !== undefined && categoryId !== null && String(categoryId).trim() !== '';
    return request(hasId ? `/api/menu-subcategories?categoryId=${encodeURIComponent(categoryId)}` : '/api/menu-subcategories');
  },
  getSubCategoryById: (id) => request(`/api/menu-subcategories/${id}`),
  createSubCategory: (data) => request('/api/menu-subcategories', { method: 'POST', body: data }),
  updateSubCategory: (id, data) => request(`/api/menu-subcategories/${id}`, { method: 'PUT', body: data }),
  deleteSubCategory: (id) => request(`/api/menu-subcategories/${id}`, { method: 'DELETE' }),

  // ── Menu Infos (supports multipart/form-data with photo) ──
  getInfos: (subCategoryId) => {
    const hasId = subCategoryId !== undefined && subCategoryId !== null && String(subCategoryId).trim() !== '';
    return request(hasId ? `/api/menu-infos?subCategoryId=${encodeURIComponent(subCategoryId)}` : '/api/menu-infos');
  },
  getInfoById: (id) => request(`/api/menu-infos/${id}`),
  createInfo: (dataOrFormData) => request('/api/menu-infos', { method: 'POST', body: dataOrFormData }),
  updateInfo: (id, dataOrFormData) => request(`/api/menu-infos/${id}`, { method: 'PUT', body: dataOrFormData }),
  deleteInfo: (id) => request(`/api/menu-infos/${id}`, { method: 'DELETE' }),

  // ── Menu Materials (supports multipart/form-data with file and cover) ──
  getMaterials: (infoId, year) => {
    const params = [];
    if (infoId !== undefined && infoId !== null && String(infoId).trim() !== '') {
      params.push(`infoId=${encodeURIComponent(infoId)}`);
    }
    if (year !== undefined && year !== null && String(year).trim() !== '') {
      params.push(`year=${encodeURIComponent(year)}`);
    }
    const q = params.length > 0 ? `?${params.join('&')}` : '';
    return request(`/api/menu-materials${q}`);
  },
  getMaterialById: (id) => request(`/api/menu-materials/${id}`),
  createMaterial: (dataOrFormData) => request('/api/menu-materials', { method: 'POST', body: dataOrFormData }),
  updateMaterial: (id, dataOrFormData) => request(`/api/menu-materials/${id}`, { method: 'PUT', body: dataOrFormData }),
  deleteMaterial: (id) => request(`/api/menu-materials/${id}`, { method: 'DELETE' }),
};

