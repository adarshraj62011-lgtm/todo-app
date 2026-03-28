import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiList, FiCalendar, FiSettings, FiLogOut, FiMenu, FiX, FiMoon, FiSun, FiSearch } from 'react-icons/fi';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, toggleTheme } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome className="text-xl" /> },
    { name: 'Tasks', path: '/tasks', icon: <FiList className="text-xl" /> },
    { name: 'Calendar', path: '/calendar', icon: <FiCalendar className="text-xl" /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings className="text-xl" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background decorations for dashboard */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 glass-card border-l-0 border-y-0 border-r border-slate-200 dark:border-slate-800 rounded-none rounded-r-3xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiSettings className="text-white text-xl animate-[spin_10s_linear_infinite]" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              GoDo
            </span>
          </div>
          <button className="lg:hidden text-slate-500 p-2" onClick={() => setSidebarOpen(false)}>
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm border border-blue-100 dark:border-blue-800/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800/50">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200 w-full"
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
        {/* Topbar */}
        <header className="h-20 px-4 sm:px-10 flex items-center justify-between glass-card border-x-0 border-t-0 border-b border-slate-200 dark:border-slate-800/50 rounded-none z-10 transition-all">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="text-2xl" />
            </button>
            <div className="hidden lg:flex items-center bg-white/60 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 w-64 xl:w-96 focus-within:ring-2 ring-blue-500/30 transition-shadow">
              <FiSearch className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="bg-transparent border-none outline-none w-full text-sm text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 bg-white/60 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
              title="Toggle Theme"
            >
              {document.documentElement.classList.contains('dark') ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[100px]">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[100px]">{user?.email}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white dark:border-slate-800 overflow-hidden shrink-0">
                {user?.profilePhoto ? (
                  <img src={`http://localhost:5000${user.profilePhoto}`} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
