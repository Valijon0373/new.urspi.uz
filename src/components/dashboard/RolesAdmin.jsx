import React, { useState, useEffect } from 'react';
import { Shield, Key, Plus, Trash2, Check, X } from 'lucide-react';
import { rolesAPI, permissionsAPI } from '../../api';

export default function RolesAdmin() {
  const [rolesList, setRolesList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '' });

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
    } catch (e) {
      console.warn('API error in RolesAdmin:', e.message);
      setRolesList([]);
      setPermissionsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Rollar va Ruxsatnomalar</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Foydalanuvchilar rollari va tizim ruxsatnomalari boshqaruvi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-violet-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tizim rollari</h3>
            </div>
          </div>

          <div className="space-y-3">
            {rolesList.map(role => (
              <div key={role.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{role.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{role.description || "Rol tavsifi"}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  ID: {role.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tizim ruxsatnomalari</h3>
            </div>
          </div>

          <div className="space-y-3">
            {permissionsList.map(perm => (
              <div key={perm.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{perm.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{perm.description || "Ruxsatnoma"}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  RUXSAT
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
