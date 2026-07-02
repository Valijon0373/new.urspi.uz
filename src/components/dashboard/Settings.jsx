import React, { useState } from 'react';

export default function Settings() {
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
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
      <span className="text-base font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-[#0eb99c]' : 'bg-slate-200 dark:bg-slate-600'
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Sozlamalar</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
          Tizim sozlamalari va fasllarni boshqarish
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <ToggleButton label="Bahor" checked={seasons.bahor} onChange={() => handleToggle('bahor')} />
        <ToggleButton label="Yoz" checked={seasons.yoz} onChange={() => handleToggle('yoz')} />
        <ToggleButton label="Kuz" checked={seasons.kuz} onChange={() => handleToggle('kuz')} />
        <ToggleButton label="Qish" checked={seasons.qish} onChange={() => handleToggle('qish')} />
      </div>
    </div>
  );
}
