import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, GraduationCap, FileText,
  User, Users, CheckSquare, Info, Moon, Sun, ChevronDown,
  Trophy, File, ClipboardList, Menu, LogOut, ArrowLeft
} from 'lucide-react';
import { LuLandmark } from 'react-icons/lu';
import TabMenu from './TabMenu';
import logo from '../../assets/images/logo1.jpg';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: LuLandmark, label: 'Fakultetlar' },
  { icon: GraduationCap, label: 'Kafedralar' },
  { icon: FileText, label: 'Lavozim' },
  { icon: User, label: 'Foydalanuvchilar' },
  { icon: Users, label: "O'qituvchilar" },
  { icon: CheckSquare, label: 'Mezonlar' },
  { icon: Info, label: 'Biz haqimizda' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('dashboard-dark') === 'true'
  );
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dashboard-dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAdminOpen(false);
    navigate('/');
  };

  const navLinkClass = (active) =>
    `flex items-center gap-3 py-2.5 rounded-xl transition-colors ${
      sidebarCollapsed ? 'justify-center px-2.5' : 'px-4'
    } ${
      active
        ? 'bg-[#0eb99c] text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-left ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        <div>
          {/* Logo area */}
          <div
            className={`h-[72px] flex items-center border-b border-slate-100 dark:border-slate-800 ${
              sidebarCollapsed ? 'justify-center px-2' : 'px-5'
            }`}
          >
            <div className={`flex items-center ${sidebarCollapsed ? '' : 'gap-3'}`}>
              <img
                src={logo}
                alt="UrSPI"
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-100 dark:ring-slate-700"
              />
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight m-0 truncate">
                    UrSPI Admin
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Dashboard</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className={`py-5 space-y-1 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
            {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
              <a
                key={label}
                href="#"
                title={sidebarCollapsed ? label : undefined}
                className={navLinkClass(active)}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                )}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Button */}
        <div className={`mb-2 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
          <Link
            to="/"
            title={sidebarCollapsed ? 'Platformaga qaytish' : undefined}
            className={`flex items-center justify-center border border-red-300 dark:border-red-500/50 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium ${
              sidebarCollapsed ? 'p-2.5' : 'py-2.5 px-4 w-full gap-2'
            }`}
          >
            {sidebarCollapsed ? (
              <ArrowLeft className="w-[18px] h-[18px]" />
            ) : (
              'Platformaga qaytish'
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menyuni yig'ish"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100 m-0">Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label={darkMode ? 'Kunduzgi rejim' : 'Tungi rejim'}
            >
              {darkMode ? (
                <Sun className="w-[18px] h-[18px]" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>

            {/* Admin dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setAdminOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-[11px]">
                  AD
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">admin</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${adminOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {adminOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-50">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-[1280px] mx-auto space-y-6">

            {/* Title Section */}
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Umumiy natija</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 m-0">
                Mezonlar bo'yicha yig'ilgan ball va holat
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">110 / 110</p>
                  <p className="text-sm text-slate-400 mt-1 m-0">Jami maksimal ball</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 rounded-xl flex items-center justify-center text-[#0eb99c] shrink-0">
                  <File className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">0</p>
                  <p className="text-sm text-slate-400 mt-1 m-0">Jami yuklangan fayllar</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/40 rounded-xl flex items-center justify-center text-violet-500 shrink-0">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">20</p>
                  <p className="text-sm text-slate-400 mt-1 m-0">Mezonlar soni</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                  <LuLandmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5 m-0">Fakultetlar</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 m-0">5</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5 m-0">Kafedralar</p>
                  <p className="text-2xl font-bold text-emerald-500 m-0">15</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/40 rounded-xl flex items-center justify-center text-violet-500 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-0.5 m-0">O'qituvchilar</p>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 m-0">144</p>
                </div>
              </div>
            </div>

            {/* Bottom Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[380px] flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                      Yuklangan fayllar taqsimoti
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 m-0">
                      File • Video • Link • Rasm
                    </p>
                  </div>
                  <TabMenu />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div
                    className="relative w-52 h-52 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        'conic-gradient(#3B82F6 0% 15%, #EF4444 15% 40%, #F59E0B 40% 65%, #10B981 65% 100%)',
                    }}
                  >
                    <div className="absolute w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Turlar</span>
                    </div>
                    <span className="absolute top-10 right-6 text-white text-[10px] font-medium">File (15%)</span>
                    <span className="absolute bottom-10 right-6 text-white text-[10px] font-medium">Video (25%)</span>
                    <span className="absolute bottom-10 left-6 text-white text-[10px] font-medium">Link (25%)</span>
                    <span className="absolute top-10 left-6 text-white text-[10px] font-medium">Rasm (25%)</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                      <span className="text-slate-600 dark:text-slate-400">File (0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                      <span className="text-slate-600 dark:text-slate-400">Video (0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                      <span className="text-slate-600 dark:text-slate-400">Link (0)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-400">Rasm (0)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 min-h-[380px] flex flex-col">
                <div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100 m-0">
                    Fakultet o'qituvchilari yuklagan fayllar
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 m-0">
                    Har bir fakultet bo'yicha jami yuklangan fayllar soni
                  </p>
                </div>

                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                  Hozircha ma'lumot yo'q
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
