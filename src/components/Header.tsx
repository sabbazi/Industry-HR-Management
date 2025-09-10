import React from 'react';
import { Bell, User, Globe, Search, LogOut, Menu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { user, logout } = useAuth();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={onMenuClick} className="p-2 text-gray-600 dark:text-slate-300 md:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('search')}
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-slate-600 
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
              <Globe className="w-4 h-4 text-gray-600 dark:text-slate-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                {languages.find(lang => lang.code === language)?.flag}
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center space-x-3
                    ${language === lang.code ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'}`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile with Logout */}
          <div className="relative group">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user?.role} {t('manager')}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <div className="px-4 py-2 sm:hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user?.role} {t('manager')}</p>
                </div>
                <hr className="my-1 border-gray-200 dark:border-slate-700 sm:hidden" />
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{t('profile')}</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>{t('notifications')}</span>
                </button>
                <hr className="my-1 border-gray-200 dark:border-slate-700" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
