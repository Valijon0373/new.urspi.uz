import { request } from './client';

/**
 * Maps application language code ('uz', 'ru', 'en', 'oz') to HEMIS language format
 */
export const mapAppLangToHemisLang = (lang) => {
  if (!lang) return 'uz-UZ';
  const l = String(lang).trim().toLowerCase();
  if (l === 'uz' || l === 'uz-uz') return 'uz-UZ';
  if (l === 'oz' || l === 'oz-uz') return 'oz-UZ';
  if (l === 'ru' || l === 'ru-ru') return 'ru-RU';
  if (l === 'en' || l === 'en-us') return 'en-US';
  if (l.startsWith('uz')) return 'uz-UZ';
  if (l.startsWith('ru')) return 'ru-RU';
  if (l.startsWith('en')) return 'en-US';
  return 'uz-UZ';
};

export const hemisAPI = {
  // Public - Talabalar statistikasi (Landing)
  getPublicStudentStats: (lang = 'uz-UZ') => {
    const hemisLang = mapAppLangToHemisLang(lang);
    return request(`/api/hemis/public/stat-student?l=${encodeURIComponent(hemisLang)}`);
  },

  // Admin - HEMIS Configs CRUD
  getAllConfigs: () => request('/api/hemis-configs'),
  getConfigById: (id) => request(`/api/hemis-configs/${id}`),
  createConfig: (dto) =>
    request('/api/hemis-configs', {
      method: 'POST',
      body: dto,
    }),
  updateConfig: (id, dto) =>
    request(`/api/hemis-configs/${id}`, {
      method: 'PUT',
      body: dto,
    }),
  deleteConfig: (id) =>
    request(`/api/hemis-configs/${id}`, {
      method: 'DELETE',
    }),
  toggleConfigStatus: (id) =>
    request(`/api/hemis-configs/change/status/${id}`, {
      method: 'PUT',
    }),

  // Admin - Connection Test & Sync
  testConnection: () => request('/api/hemis/connection-test'),
  syncResource: (resource) =>
    request(`/api/hemis/sync/${resource}`, {
      method: 'POST',
    }),
  syncDepartments: () =>
    request('/api/hemis/sync/DEPARTMENT', {
      method: 'POST',
    }),
  syncEmployees: () =>
    request('/api/hemis/sync/EMPLOYEE', {
      method: 'POST',
    }),
};
