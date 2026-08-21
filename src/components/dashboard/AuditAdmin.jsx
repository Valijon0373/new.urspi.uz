import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { auditAPI } from '../../api';

export default function AuditAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditAPI.getLogs();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      setLogs(rawData);
    } catch (e) {
      console.warn('Audit logs API error:', e.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Audit va Tizim Jurnali</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administratorlar va foydalanuvchilarning barcha faoliyat tarixi loglari</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">№</th>
                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Foydalanuvchi</th>
                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Amal</th>
                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Tafsilot</th>
                <th className="py-4 px-6 border-b border-slate-200 dark:border-slate-800">Vaqt</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">{log.username || "admin"}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {log.action || "LOG"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{log.details || log.message || "Tizim harakati"}</td>
                  <td className="py-4 px-6 text-slate-400 text-xs">{log.timestamp || log.createdAt || "2026-08-21"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
