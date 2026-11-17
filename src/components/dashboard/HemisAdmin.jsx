import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Server,
  RefreshCw,
  Activity,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Radio
} from 'lucide-react';
import { hemisAPI } from '../../api';

export default function HemisAdmin() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Connection test state
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);

  // Sync state
  const [syncingDept, setSyncingDept] = useState(false);
  const [syncingEmp, setSyncingEmp] = useState(false);
  const [syncDeptResult, setSyncDeptResult] = useState(null);
  const [syncEmpResult, setSyncEmpResult] = useState(null);

  // Notification Toast
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Form State
  const [formData, setFormData] = useState({
    name: 'production',
    baseUrl: 'https://student.urspi.uz',
    token: '',
    defaultLang: 'uz-UZ',
    active: true,
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await hemisAPI.getAllConfigs();
      const rawData = Array.isArray(res) ? res : res?.data || [];
      setConfigs(Array.isArray(rawData) ? rawData : []);
    } catch (e) {
      console.warn('API error in fetchConfigs:', e.message);
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedConfig(null);
    setFormData({
      name: 'production',
      baseUrl: 'https://student.urspi.uz',
      token: '',
      defaultLang: 'uz-UZ',
      active: configs.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cfg) => {
    setIsEditing(true);
    setSelectedConfig(cfg);
    setFormData({
      name: cfg.name || '',
      baseUrl: cfg.baseUrl || '',
      token: '', // Bo'sh qoldirilsa backend eski tokenni saqlaydi
      defaultLang: cfg.defaultLang || 'uz-UZ',
      active: Boolean(cfg.active),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.baseUrl.trim()) {
      showNotification('Iltimos, nom va baseUrl maydonlarini to\'ldiring', 'error');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        baseUrl: formData.baseUrl.trim(),
        defaultLang: formData.defaultLang,
        active: formData.active,
      };

      if (formData.token.trim()) {
        payload.token = formData.token.trim();
      }

      if (isEditing && selectedConfig) {
        await hemisAPI.updateConfig(selectedConfig.id, payload);
        showNotification('HEMIS konfiguratsiyasi muvaffaqiyatli yangilandi');
      } else {
        if (!formData.token.trim()) {
          showNotification('Yangi konfiguratsiya uchun token kiritilishi shart', 'error');
          return;
        }
        await hemisAPI.createConfig(payload);
        showNotification('Yangi HEMIS konfiguratsiyasi yaratildi');
      }

      setIsModalOpen(false);
      fetchConfigs();
    } catch (err) {
      showNotification(err.message || 'Xatolik yuz berdi', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedConfig) return;
    try {
      await hemisAPI.deleteConfig(selectedConfig.id);
      showNotification('Konfiguratsiya o\'chirildi');
      fetchConfigs();
    } catch (err) {
      showNotification(err.message || 'O\'chirishda xatolik yuz berdi', 'error');
    } finally {
      setDeleteModalOpen(false);
      setSelectedConfig(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await hemisAPI.toggleConfigStatus(id);
      showNotification('Konfiguratsiya holati o\'zgartirildi');
      fetchConfigs();
    } catch (err) {
      showNotification(err.message || 'Holatni o\'zgartirib bo\'lmadi', 'error');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const res = await hemisAPI.testConnection();
      setConnectionResult({
        success: true,
        data: res,
        time: new Date().toLocaleTimeString(),
      });
      showNotification('HEMIS ulanishi muvaffaqiyatli tekshirildi!');
    } catch (err) {
      setConnectionResult({
        success: false,
        error: err.message || 'Ulanishda xatolik yuz berdi',
        time: new Date().toLocaleTimeString(),
      });
      showNotification(err.message || 'HEMIS bilan aloqa o\'rnatilmadi', 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSyncDepartments = async () => {
    setSyncingDept(true);
    try {
      const res = await hemisAPI.syncDepartments();
      const data = res?.data || res;
      setSyncDeptResult({
        success: Boolean(data?.success ?? true),
        fetchedCount: data?.fetchedCount ?? 0,
        upsertedCount: data?.upsertedCount ?? 0,
        message: data?.message || 'Kafedralar muvaffaqiyatli sinxronizatsiya qilindi',
        time: new Date().toLocaleTimeString(),
      });
      showNotification('Kafedralar sinxronizatsiyasi yakunlandi');
    } catch (err) {
      setSyncDeptResult({
        success: false,
        message: err.message || 'Kafedralarni sinxronizatsiya qilishda xatolik',
        time: new Date().toLocaleTimeString(),
      });
      showNotification(err.message || 'Sinxronizatsiyada xatolik', 'error');
    } finally {
      setSyncingDept(false);
    }
  };

  const handleSyncEmployees = async () => {
    setSyncingEmp(true);
    try {
      const res = await hemisAPI.syncEmployees();
      const data = res?.data || res;
      setSyncEmpResult({
        success: Boolean(data?.success ?? true),
        fetchedCount: data?.fetchedCount ?? 0,
        upsertedCount: data?.upsertedCount ?? 0,
        message: data?.message || 'Xodimlar muvaffaqiyatli sinxronizatsiya qilindi',
        time: new Date().toLocaleTimeString(),
      });
      showNotification('Xodimlar sinxronizatsiyasi yakunlandi');
    } catch (err) {
      setSyncEmpResult({
        success: false,
        message: err.message || 'Xodimlarni sinxronizatsiya qilishda xatolik',
        time: new Date().toLocaleTimeString(),
      });
      showNotification(err.message || 'Sinxronizatsiyada xatolik', 'error');
    } finally {
      setSyncingEmp(false);
    }
  };

  const activeConfig = configs.find((c) => c.active);

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      {/* Toast Notification */}
      {notification.show && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 shadow-xl border rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in z-[70] ${
            notification.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              notification.type === 'error'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </div>
          <span className="font-medium text-sm sm:text-base">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">
                HEMIS Integratsiya va Sozlamalari
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                HEMIS axborot tizimi bilan server orqali xavfsiz ulanish, aktiv config va ma'lumotlar sinxronizatsiyasi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Yangi Config
          </button>
        </div>
      </div>

      {/* Live Health & Actions Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Connection Status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base m-0">
                    Ulanish Holati (Connection Test)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                    HEMIS API bilan server o'rtasidagi aloqani sinovdan o'tkazish
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${
                  activeConfig
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                <Radio className="w-3 h-3 animate-pulse" />
                {activeConfig ? 'Aktiv config mavjud' : 'Aktiv config yo\'q'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3.5 mb-4 border border-slate-100 dark:border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Aktiv HEMIS Host:</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-200 truncate max-w-[220px]">
                  {activeConfig?.baseUrl || "Hali o'rnatilmagan"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Standart Til:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {activeConfig?.defaultLang || 'uz-UZ'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Token holati:</span>
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {activeConfig?.tokenMasked || (activeConfig ? 'O\'rnatilgan' : "Yo'q")}
                </span>
              </div>
            </div>

            {connectionResult && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs sm:text-sm flex items-start gap-2.5 ${
                  connectionResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {connectionResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold m-0">
                    {connectionResult.success
                      ? 'HEMIS serveri bilan muvaffaqiyatli bog\'lanildi!'
                      : 'Ulanishda xatolik yuz berdi'}
                  </p>
                  <p className="opacity-80 text-xs mt-1 m-0">
                    {connectionResult.error ||
                      (typeof connectionResult.data === 'string'
                        ? connectionResult.data
                        : JSON.stringify(connectionResult.data?.message || connectionResult.data))}
                    {' • '}
                    <span className="font-mono">{connectionResult.time}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testingConnection || !activeConfig}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer text-sm ${
              testingConnection || !activeConfig
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
            {testingConnection ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish'}
          </button>
        </div>

        {/* Card 2: Synchronization Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base m-0">
                    Ma'lumotlar Sinxronizatsiyasi (Sync)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                    Kafedralar va Xodimlarni HEMIS bazasidan yangilab olish
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Sinxronizatsiya orqali HEMIS dagi yangi kafedralar va xodimlar ma'lumotlari lokal bazaga keshlab
              saqlanadi va yangilanadi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Sync Departments */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 m-0">
                    Kafedralar (DEPARTMENT)
                  </p>
                  <p className="text-xs text-slate-400 mt-1 m-0">
                    {syncDeptResult
                      ? `${syncDeptResult.fetchedCount || 0} ta olindi / ${syncDeptResult.upsertedCount || 0} ta yangilandi`
                      : 'Hozircha yangilanmadi'}
                  </p>
                </div>
                <button
                  onClick={handleSyncDepartments}
                  disabled={syncingDept || !activeConfig}
                  className="mt-3 flex items-center justify-center gap-1.5 bg-[#0eb99c] hover:bg-[#0ba087] disabled:opacity-50 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingDept ? 'animate-spin' : ''}`} />
                  {syncingDept ? 'Sinxronlanmoqda...' : 'Kafedralarni sinxronlash'}
                </button>
              </div>

              {/* Sync Employees */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 m-0">
                    Xodimlar (EMPLOYEE)
                  </p>
                  <p className="text-xs text-slate-400 mt-1 m-0">
                    {syncEmpResult
                      ? `${syncEmpResult.fetchedCount || 0} ta olindi / ${syncEmpResult.upsertedCount || 0} ta yangilandi`
                      : 'Hozircha yangilanmadi'}
                  </p>
                </div>
                <button
                  onClick={handleSyncEmployees}
                  disabled={syncingEmp || !activeConfig}
                  className="mt-3 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingEmp ? 'animate-spin' : ''}`} />
                  {syncingEmp ? 'Sinxronlanmoqda...' : 'Xodimlarni sinxronlash'}
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Faqat HEMIS_CONFIG_EDIT huquqiga ega adminlar sinxronizatsiya qila oladi.</span>
          </div>
        </div>
      </div>

      {/* HEMIS Configs List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg m-0">
              HEMIS Konfiguratsiyalari
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">
              Tizimga ulangan barcha server konfiguratsiyalari. Bir vaqtning o'zida faqat bittasi aktiv bo'ladi.
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full font-medium">
            Jami: {configs.length}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0eb99c]" />
            Konfiguratsiyalar yuklanmoqda...
          </div>
        ) : configs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Server className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium text-slate-600 dark:text-slate-300 m-0">
              Hozircha hech qanday HEMIS konfiguratsiyasi yaratilmagan
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Public statistika va sinxronizatsiya ishlashi uchun kamida bitta aktiv konfiguratsiya kerak
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-[#0eb99c] hover:bg-[#0ba087] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ilk konfiguratsiyani yaratish
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Nomi</th>
                  <th className="py-3 px-4">Base URL</th>
                  <th className="py-3 px-4">Standart Til</th>
                  <th className="py-3 px-4">Token (Masked)</th>
                  <th className="py-3 px-4 text-center">Holati</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {configs.map((cfg) => (
                  <tr
                    key={cfg.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>{cfg.name}</span>
                        {cfg.active && (
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Aktiv
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                      <a
                        href={cfg.baseUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        {cfg.baseUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-mono">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {cfg.defaultLang || 'uz-UZ'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                        {cfg.tokenMasked || '••••••••'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(cfg.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                          cfg.active
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {cfg.active ? 'Aktiv (Faol)' : 'Noaktiv'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cfg)}
                          title="Tahrirlash"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedConfig(cfg);
                            setDeleteModalOpen(true);
                          }}
                          title="O'chirish"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create / Edit HEMIS Config */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[65] animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 m-0">
                {isEditing ? 'HEMIS Konfiguratsiyasini Tahrirlash' : 'Yangi HEMIS Konfiguratsiyasi'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Konfiguratsiya Nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="masalan: production yoki staging"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb99c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  HEMIS Base URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://student.urspi.uz"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb99c]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  HEMIS server manzili (masalan: https://student.urspi.uz)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  HEMIS API Token {isEditing ? "(O'zgartirmaslik uchun bo'sh qoldiring)" : '*'}
                </label>
                <input
                  type="text"
                  placeholder={
                    isEditing
                      ? `Amaldagi token saqlanadi (${selectedConfig?.tokenMasked || '••••'})`
                      : 'HEMIS admin dashboardidan olingan API token'
                  }
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0eb99c]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Token xavfsiz holda backendda saqlanadi va frontendga faqat maskalangan holda ko'rsatiladi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Standart Til (defaultLang)
                  </label>
                  <select
                    value={formData.defaultLang}
                    onChange={(e) => setFormData({ ...formData, defaultLang: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#0eb99c]"
                  >
                    <option value="uz-UZ">O'zbekcha (uz-UZ)</option>
                    <option value="oz-UZ">Ўзбекча (oz-UZ)</option>
                    <option value="ru-RU">Русский (ru-RU)</option>
                    <option value="en-US">English (en-US)</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-[#0eb99c] rounded border-slate-300 focus:ring-[#0eb99c]"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Aktiv konfiguratsiya qilish
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium bg-[#0eb99c] hover:bg-[#0ba087] text-white rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {isEditing ? 'Saqlash' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[65] animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
              Konfiguratsiyani o'chirish
            </h3>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
              Haqiqatan ham <strong className="text-slate-800 dark:text-slate-200">{selectedConfig?.name}</strong> nomli HEMIS konfiguratsiyasini o'chirmoqchimisiz?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
