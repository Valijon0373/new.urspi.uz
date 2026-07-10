import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, GraduationCap, FileText,
  User, Users, CheckSquare, Info, Moon, Sun, ChevronDown,
  Trophy, File, ClipboardList, Menu, LogOut, ArrowLeft
} from 'lucide-react';
import { LuLandmark } from 'react-icons/lu';
import { IoMegaphoneOutline, IoSettingsOutline } from 'react-icons/io5';
import { LiaBlackTie } from 'react-icons/lia';
import { FaLandmarkFlag } from 'react-icons/fa6';
import { FaNetworkWired } from 'react-icons/fa';
import { PiUsersThree, PiUserSquare } from 'react-icons/pi';
import { HiOutlineMailOpen } from 'react-icons/hi';
import logo from '../../assets/images/logo1.jpg';
import Settings from './Settings';
import NewsAdmin from './NewsAdmin';
import AnnouncementsAdmin from './AnnouncementsAdmin';
import AboutUsAdmin from './AboutUsAdmin';
import TeachersAdmin from './TeachersAdmin';
import EmployeesAdmin from './EmployeesAdmin';
import PositionsAdmin from './PositionsAdmin';
import FacultiesAdmin from './FacultiesAdmin';
import DepartmentsAdmin from './DepartmentsAdmin';
import RahbariyatAdmin from './RahbariyatAdmin';
import CentersAdmin from './CentersAdmin';
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  {
    icon: LuLandmark,
    label: 'Tuzilma',
    subItems: [
      { label: 'Fakultetlar', icon: FaLandmarkFlag },
      { label: 'Kafedralar', icon: GraduationCap },
      { label: "Markaz va Bo'limlar", icon: FaNetworkWired },
      { label: 'Lavozimlar', icon: LiaBlackTie }
    ]
  },
  { icon: User, label: 'Rahbariyat' },
  {
    icon: Users,
    label: 'Hodimlar',
    subItems: [
      { label: "O'qituvchilar", icon: PiUsersThree },
      { label: 'Xodimlar', icon: PiUserSquare }
    ]
  },
  { icon: CheckSquare, label: 'Yangiliklar' },
  { icon: IoMegaphoneOutline, label: "E'lonlar" },
  { icon: IoSettingsOutline, label: 'Sozlamalar' },
  { icon: HiOutlineMailOpen, label: 'Korporativ pochta', href: 'http://webmail.urspi.uz:4040/admin' },
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
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [activeTab, setActiveTab] = useState('Dashboard');

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
    `flex items-center gap-3 py-2.5 rounded-xl transition-colors ${sidebarCollapsed ? 'justify-center px-2.5' : 'px-4'
    } ${active
      ? 'bg-[#0eb99c] text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-left ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside
        className={`shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 overflow-hidden ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
          }`}
      >
        <div>
          {/* Logo area */}
          <div
            className={`h-[72px] flex items-center border-b border-slate-100 dark:border-slate-800 ${sidebarCollapsed ? 'justify-center px-2' : 'px-5'
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
            {NAV_ITEMS.map(({ icon: Icon, label, subItems, href }) => {
              const isActive = activeTab === label;
              return (
                <div key={label}>
                  {subItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (!sidebarCollapsed) toggleDropdown(label);
                          setActiveTab(label);
                        }}
                        title={sidebarCollapsed ? label : undefined}
                        className={`w-full ${navLinkClass(isActive)} ${!sidebarCollapsed ? 'justify-between' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-[22px] h-[22px] shrink-0" />
                          {!sidebarCollapsed && (
                            <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                          )}
                        </div>
                        {!sidebarCollapsed && (
                          <ChevronDown className={`w-5 h-5 transition-transform ${openDropdowns[label] ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      {!sidebarCollapsed && openDropdowns[label] && (
                        <div className="mt-1 space-y-1 pl-11 pr-2">
                          {subItems.map(({ label: subLabel, icon: SubIcon }) => (
                            <button
                              key={subLabel}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(subLabel);
                              }}
                              className={`w-full flex items-center gap-2 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${activeTab === subLabel
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100'
                                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800'
                                }`}
                            >
                              {SubIcon && <SubIcon className="w-[18px] h-[18px] shrink-0" />}
                              <span>{subLabel}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={sidebarCollapsed ? label : undefined}
                      className={`w-full block ${navLinkClass(isActive)}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-[22px] h-[22px] shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                        )}
                      </div>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab(label)}
                      title={sidebarCollapsed ? label : undefined}
                      className={`w-full ${navLinkClass(isActive)}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-[22px] h-[22px] shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom Button */}
        <div className={`mb-2 ${sidebarCollapsed ? 'p-2' : 'p-3'}`}>
          <Link
            to="/"
            title={sidebarCollapsed ? 'Platformaga qaytish' : undefined}
            className={`flex items-center justify-center border border-red-300 dark:border-red-500/50 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium ${sidebarCollapsed ? 'p-2.5' : 'py-2.5 px-4 w-full gap-2'
              }`}
          >
            {sidebarCollapsed ? (
              <ArrowLeft className="w-[22px] h-[22px]" />
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
          {activeTab === 'Dashboard' && (
            <div className="max-w-[1280px] mx-auto space-y-6">
              {/* Title Section */}
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 m-0">Umumiy Statistika</p>

              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                    <LuLandmark className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">5</p>
                    <p className="text-sm text-slate-400 mt-1 m-0">Fakultetlar soni</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">15</p>
                    <p className="text-sm text-slate-400 mt-1 m-0">Kafedralar soni</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-50 dark:bg-violet-950/40 rounded-xl flex items-center justify-center text-violet-500 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">124</p>
                    <p className="text-sm text-slate-400 mt-1 m-0">Xodimlar soni</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 rounded-xl flex items-center justify-center text-[#0eb99c] shrink-0">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">20</p>
                    <p className="text-sm text-slate-400 mt-1 m-0">Yangiliklar soni</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                    <IoMegaphoneOutline className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 m-0">12</p>
                    <p className="text-sm text-slate-400 mt-1 m-0">E'lonlar soni</p>
                  </div>
                </div>
              </div>



            </div>
          )}
          {activeTab === 'Rahbariyat' && (
            <RahbariyatAdmin />
          )}
          {activeTab === 'Yangiliklar' && (
            <NewsAdmin />
          )}
          {activeTab === 'Lavozimlar' && (
            <PositionsAdmin />
          )}
          {activeTab === 'Fakultetlar' && (
            <FacultiesAdmin />
          )}
          {activeTab === 'Kafedralar' && (
            <DepartmentsAdmin />
          )}
          {activeTab === "Markaz va Bo'limlar" && (
            <CentersAdmin />
          )}
          {activeTab === "O'qituvchilar" && (
            <TeachersAdmin />
          )}
          {activeTab === 'Xodimlar' && (
            <EmployeesAdmin />
          )}
          {activeTab === "E'lonlar" && (
            <AnnouncementsAdmin />
          )}
          {activeTab === 'Biz haqimizda' && (
            <AboutUsAdmin />
          )}
          {activeTab === 'Sozlamalar' && (
            <Settings />
          )}
        </div>
      </main>
    </div>
  );
}
