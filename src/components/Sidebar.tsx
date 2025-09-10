import React from 'react';
import { 
  LayoutDashboard, Users, UserPlus, TrendingUp, DollarSign, 
  Calendar, Clock, BookOpen, BarChart3, Settings, 
  ChevronLeft, ChevronRight, HandHeart, X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { id: 'employees', icon: Users, label: t('employees') },
    { id: 'recruitment', icon: UserPlus, label: t('recruitment') },
    { id: 'performance', icon: TrendingUp, label: t('performance') },
    { id: 'payroll', icon: DollarSign, label: t('payroll') },
    { id: 'leave', icon: Calendar, label: t('leave') },
    { id: 'attendance', icon: Clock, label: t('attendance') },
    { id: 'training', icon: BookOpen, label: t('training') },
    { id: 'benefits', icon: HandHeart, label: t('benefits') },
    { id: 'analytics', icon: BarChart3, label: t('analytics') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const desktopSidebarClasses = `hidden md:flex flex-col bg-slate-900 text-white transition-all duration-300 ${
    isCollapsed ? 'w-16' : 'w-64'
  } min-h-screen relative`;

  const mobileSidebarClasses = `fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 flex flex-col bg-slate-900 text-white w-64
    transition-transform duration-300 ease-in-out md:hidden ${
      isMobileMenuOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
    }`;

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className={`p-4 border-b border-slate-700 flex ${isMobile ? 'justify-between items-center' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <h1 className="text-lg font-bold">IndustryHR</h1>
              <p className="text-sm text-slate-400">Management System</p>
            </div>
          )}
        </div>
        {isMobile && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-6 ${isRTL ? 'left-2' : 'right-2'} w-6 h-6 bg-slate-800 
            rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors`}
        >
          {isCollapsed ? 
            (isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : 
            (isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
          }
        </button>
      )}

      <nav className="mt-8 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => isMobile ? handleTabClick(item.id) : setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white' + (!isMobile ? ' border-r-4 border-blue-400' : '')
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className={`${isRTL ? 'mr-3' : 'ml-3'} font-medium`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={desktopSidebarClasses}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={mobileSidebarClasses}>
        <SidebarContent isMobile={true} />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
