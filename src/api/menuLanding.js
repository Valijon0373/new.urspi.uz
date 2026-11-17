import { request } from './client';
import {
  getStoredMenus,
  getStoredCategories,
  getStoredSubCategories,
  getStoredInfos,
  getStoredMaterials,
  getLocalizedField,
  toUzbekLatin
} from './menuStorage';

/**
 * Public Landing API for Menu hierarchy:
 * Menu -> Category -> SubCategory -> Info -> Material (year)
 * Synchronized with MenuAdmin and menuStorage with backend fallback.
 */

const normalizeLang = (lang = 'uz') => {
  if (!lang) return 'uz';
  const short = String(lang).split('-')[0].toLowerCase();
  return ['uz', 'ru', 'en'].includes(short) ? short : 'uz';
};

const localizeMenu = (m, l) => ({
  ...m,
  name: getLocalizedField(m, 'name', l) || m.name
});

const localizeCategory = (c, l) => ({
  ...c,
  name: getLocalizedField(c, 'name', l) || c.name,
  menuName: l === 'uz' ? toUzbekLatin(c.menuName) : c.menuName
});

const localizeSubCategory = (s, l) => ({
  ...s,
  name: getLocalizedField(s, 'name', l) || s.name,
  categoryName: l === 'uz' ? toUzbekLatin(s.categoryName) : s.categoryName,
  menuName: l === 'uz' ? toUzbekLatin(s.menuName) : s.menuName,
  tableColumns: l === 'uz' && s.tableColumns ? toUzbekLatin(s.tableColumns) : s.tableColumns
});

const localizeInfo = (i, l) => ({
  ...i,
  title: getLocalizedField(i, 'title', l) || i.title,
  content: getLocalizedField(i, 'content', l) || i.content || null
});

export const menuLandingAPI = {
  /**
   * 2.1 Menular ro'yxati
   */
  getMenus: async (lang = 'uz') => {
    const l = normalizeLang(lang);
    const stored = getStoredMenus();
    if (stored.length > 0) {
      return stored.map(m => localizeMenu(m, l));
    }
    try {
      const res = await request(`/api/landing/menus?lang=${l}`);
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (list.length > 0) return list;
    } catch (e) {
      // ignore
    }
    return [];
  },

  getMenuById: async (menuId, lang = 'uz') => {
    const l = normalizeLang(lang);
    const stored = getStoredMenus();
    const found = stored.find(m => String(m.id) === String(menuId));
    if (found) return localizeMenu(found, l);
    return null;
  },

  /**
   * 2.2 Category lar ro'yxati
   */
  getCategories: async (menuId, lang = 'uz') => {
    const l = normalizeLang(lang);
    const stored = getStoredCategories(menuId);
    if (stored.length > 0) {
      return stored.map(c => localizeCategory(c, l));
    }
    try {
      const res = await request(`/api/landing/menus/${menuId}/categories?lang=${l}`);
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (list.length > 0) return list;
    } catch (e) {
      // ignore
    }
    return [];
  },

  getCategoryById: async (categoryId, lang = 'uz') => {
    const l = normalizeLang(lang);
    const allCats = getStoredCategories();
    const found = allCats.find(c => String(c.id) === String(categoryId));
    if (found) return localizeCategory(found, l);
    return null;
  },

  /**
   * 2.3 SubCategory lar ro'yxati
   */
  getSubCategories: async (categoryId, lang = 'uz') => {
    const l = normalizeLang(lang);
    const stored = getStoredSubCategories(categoryId);
    if (stored.length > 0) {
      return stored.map(s => localizeSubCategory(s, l));
    }
    try {
      const res = await request(`/api/landing/categories/${categoryId}/subcategories?lang=${l}`);
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (list.length > 0) return list;
    } catch (e) {
      // ignore
    }
    return [];
  },

  /**
   * 2.3 SubCategory detail
   */
  getSubCategoryById: async (id, lang = 'uz') => {
    const l = normalizeLang(lang);
    const all = getStoredSubCategories();
    const found = all.find(s => String(s.id) === String(id));
    if (found) return localizeSubCategory(found, l);

    try {
      const res = await request(`/api/landing/subcategories/${id}?lang=${l}`);
      if (res?.data || res?.id) return res.data || res;
    } catch (e) {
      // ignore
    }
    return null;
  },

  /**
   * 2.4 Infos (jadval yoki yangilik feed)
   */
  getSubCategoryInfos: async (subCategoryId, { page = 0, size = 20, lang = 'uz' } = {}) => {
    const l = normalizeLang(lang);
    const subRaw = getStoredSubCategories().find(s => String(s.id) === String(subCategoryId));
    if (subRaw) {
      const sub = localizeSubCategory(subRaw, l);
      const allInfos = getStoredInfos(subCategoryId).map(i => localizeInfo(i, l));
      const start = page * size;
      const pagedInfos = allInfos.slice(start, start + size);
      return {
        subCategory: sub,
        contentType: sub.contentType || 'TABLE',
        linkPath: sub.linkPath || null,
        linkTargetType: sub.linkTargetType || null,
        tableColumns: sub.tableColumns || '["№", "Sahifa nomi", "Ko\'rish"]',
        infos: pagedInfos,
        totalElements: allInfos.length,
        totalPages: Math.max(1, Math.ceil(allInfos.length / size)),
        number: page,
        size
      };
    }

    try {
      const res = await request(`/api/landing/subcategories/${subCategoryId}/infos?lang=${l}&page=${page}&size=${size}`);
      const data = res?.data || res || {};
      const infos = Array.isArray(data.infos) ? data.infos : (Array.isArray(data) ? data : []);
      return {
        subCategory: data.subCategory || null,
        contentType: data.contentType || (data.subCategory && data.subCategory.contentType) || 'TABLE',
        linkPath: data.linkPath || (data.subCategory && data.subCategory.linkPath) || null,
        linkTargetType: data.linkTargetType || (data.subCategory && data.subCategory.linkTargetType) || null,
        tableColumns: data.subCategory?.tableColumns || data.tableColumns || '["№", "Sahifa nomi", "Ko\'rish"]',
        infos,
        totalElements: data.totalElements ?? infos.length,
        totalPages: data.totalPages ?? 1,
        number: data.number ?? page,
        size: data.size ?? size
      };
    } catch (e) {
      return {
        subCategory: null,
        contentType: 'TABLE',
        linkPath: null,
        linkTargetType: null,
        tableColumns: '["№", "Sahifa nomi", "Ko\'rish"]',
        infos: [],
        totalElements: 0,
        totalPages: 1,
        number: page,
        size
      };
    }
  },

  /**
   * 2.5 Info detail + yillar
   */
  getInfoDetail: async (id, lang = 'uz') => {
    const l = normalizeLang(lang);
    const allInfos = getStoredInfos();
    const found = allInfos.find(i => String(i.id) === String(id));
    if (found) {
      const loc = localizeInfo(found, l);
      const mats = getStoredMaterials(found.id);
      const computedYears = Array.from(
        new Set([
          ...(Array.isArray(found.years) ? found.years : []),
          ...mats.map(m => Number(m.year)).filter(Boolean)
        ])
      ).sort((a, b) => b - a);

      return {
        id: found.id,
        subCategoryId: found.subCategoryId,
        subCategoryName: found.subCategoryName,
        categoryId: found.categoryId,
        categoryName: found.categoryName,
        menuId: found.menuId,
        menuName: found.menuName,
        title: loc.title,
        content: loc.content,
        photoLink: found.photoLink || null,
        fileLink: found.fileLink || null,
        fileName: found.fileName || null,
        createdAt: found.createdAt || found.publishedAt || null,
        years: computedYears
      };
    }

    try {
      const res = await request(`/api/landing/infos/${id}?lang=${l}`);
      const data = res?.data || res;
      if (data && (data.id || data.title)) {
        return {
          id: data.id,
          subCategoryId: data.subCategoryId,
          title: data.title || '',
          content: data.content || null,
          photoLink: data.photoLink || null,
          fileLink: data.fileLink || data.file || null,
          fileName: data.fileName || null,
          years: Array.isArray(data.years) ? data.years : []
        };
      }
    } catch (e) {
      // ignore
    }
    return null;
  },

  /**
   * 2.6 Materiallar (yil kesimi)
   */
  getInfoMaterials: async (infoId, { year, page = 0, size = 20, lang = 'uz' } = {}) => {
    const l = normalizeLang(lang);
    const storedMats = getStoredMaterials(infoId, year);
    if (storedMats.length > 0 || getStoredInfos().some(i => String(i.id) === String(infoId))) {
      const start = page * size;
      const paged = storedMats.slice(start, start + size);
      return {
        content: paged,
        page,
        size,
        totalElements: storedMats.length,
        totalPages: Math.max(1, Math.ceil(storedMats.length / size)),
        first: page === 0,
        last: start + size >= storedMats.length
      };
    }

    try {
      let url = `/api/landing/infos/${infoId}/materials?lang=${l}&page=${page}&size=${size}`;
      if (year !== undefined && year !== null && year !== '') {
        url += `&year=${encodeURIComponent(year)}`;
      }
      const res = await request(url);
      const data = res?.data || res || {};
      const content = Array.isArray(data.content) ? data.content : (Array.isArray(data) ? data : []);
      return {
        content,
        page: data.page ?? data.number ?? page,
        size: data.size ?? size,
        totalElements: data.totalElements ?? content.length,
        totalPages: data.totalPages ?? 1,
        first: data.first ?? (page === 0),
        last: data.last ?? true
      };
    } catch (e) {
      return {
        content: [],
        page,
        size,
        totalElements: 0,
        totalPages: 1,
        first: true,
        last: true
      };
    }
  }
};
