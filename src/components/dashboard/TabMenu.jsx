import React, { useState } from 'react';

export default function TabMenu() {
  const [activeTab, setActiveTab] = useState('turlar');

  return (
    <div className="inline-flex rounded-md bg-blue-50 dark:bg-blue-950/40 p-1">
      <button
        type="button"
        onClick={() => setActiveTab('turlar')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'turlar'
            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
        }`}
      >
        TURLAR BO'YICHA
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('media')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === 'media'
            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
        }`}
      >
        MEDIA/HUJJAT
      </button>
    </div>
  );
}
