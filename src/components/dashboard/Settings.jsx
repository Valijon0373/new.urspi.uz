import React, { useState } from 'react';
import { Shield, Activity, Sliders, Moon, Sun } from 'lucide-react';
import RolesAdmin from './RolesAdmin';
import AuditAdmin from './AuditAdmin';

export default function Settings({ activeSubTab }) {
  const [currentTab, setCurrentTab] = useState(activeSubTab || 'fasllar');
  const [seasons, setSeasons] = useState(() => {
    const saved = localStorage.getItem('app-season');
    const initialState = { bahor: false, yoz: false, kuz: false, qish: false };
    if (saved) initialState[saved] = true;
    return initialState;
  });

  const handleToggle = (season) => {
    setSeasons(prev => {
      const isCurrentlyOn = prev[season];
      const newState = { bahor: false, yoz: false, kuz: false, qish: false };
      if (!isCurrentlyOn) {
        newState[season] = true;
        localStorage.setItem('app-season', season);
      } else {
        localStorage.removeItem('app-season');
      }
      window.dispatchEvent(new Event('season-change'));
      return newState;
    });
  };

  const ToggleButton = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <span className="text-base font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#0eb99c]' : 'bg-slate-200 dark:bg-slate-700'
        }`}
        onClick={onChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Sozlamalar va Tizim Boshqaruvi</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
          Tizim fasllari, rollar, ruxsatnomalar hamda audit loglarini boshqarish
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setCurrentTab('fasllar')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            currentTab === 'fasllar'
              ? 'bg-[#0eb99c] text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Tizim Fasllari
        </button>

        <button
          onClick={() => setCurrentTab('roles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            currentTab === 'roles'
              ? 'bg-[#0eb99c] text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Rollar va Ruxsatlar
        </button>

        <button
          onClick={() => setCurrentTab('audit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            currentTab === 'audit'
              ? 'bg-[#0eb99c] text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Audit Loglar
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {currentTab === 'fasllar' && (
          <div className="max-w-3xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sayt Fasllari Effekti</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sayt vizual fasl effektini tanlang</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <ToggleButton label="Bahor" checked={seasons.bahor} onChange={() => handleToggle('bahor')} />
              <ToggleButton label="Yoz" checked={seasons.yoz} onChange={() => handleToggle('yoz')} />
              <ToggleButton label="Kuz" checked={seasons.kuz} onChange={() => handleToggle('kuz')} />
              <ToggleButton label="Qish" checked={seasons.qish} onChange={() => handleToggle('qish')} />
            </div>
          </div>
        )}

        {currentTab === 'roles' && (
          <RolesAdmin />
        )}

        {currentTab === 'audit' && (
          <AuditAdmin />
        )}
      </div>
    </div>
  );
}
