import React, { useState } from 'react';
import { User, Bell, Building, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    email: { leave: true, performance: true, candidates: false },
    inApp: { leave: true, performance: true, candidates: true },
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationToggle = (type: 'email' | 'inApp', key: string) => {
    setNotifications(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: !prev[type][key as keyof typeof prev.email] }
    }));
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('profileUpdated'));
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match!");
      return;
    }
    alert(t('passwordUpdated'));
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'company', label: t('company'), icon: Building },
    { id: 'appearance', label: t('appearance'), icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-lg font-medium">{t('profile')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} placeholder={t('firstName')} className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600" />
                <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} placeholder={t('lastName')} className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600" />
              </div>
              <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} placeholder={t('email')} className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600" />
              <div className="text-right">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('saveChanges')}</button>
              </div>
            </form>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <h3 className="text-lg font-medium">{t('changePassword')}</h3>
              <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange} placeholder={t('currentPassword')} className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600" />
              <input type="password" name="new" value={passwordData.new} onChange={handlePasswordChange} placeholder={t('newPassword')} className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600" />
              <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} placeholder={t('confirmPassword')} className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-700 dark:border-slate-600" />
              <div className="text-right">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('changePassword')}</button>
              </div>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t('notificationPreferences')}</h3>
            <div className="space-y-4">
              <h4 className="font-medium">{t('emailNotifications')}</h4>
              <div className="flex justify-between items-center"><p>{t('leaveRequests')}</p><label className="switch"><input type="checkbox" checked={notifications.email.leave} onChange={() => handleNotificationToggle('email', 'leave')} /><span className="slider"></span></label></div>
              <div className="flex justify-between items-center"><p>{t('performanceReviews')}</p><label className="switch"><input type="checkbox" checked={notifications.email.performance} onChange={() => handleNotificationToggle('email', 'performance')} /><span className="slider"></span></label></div>
              <div className="flex justify-between items-center"><p>{t('newCandidates')}</p><label className="switch"><input type="checkbox" checked={notifications.email.candidates} onChange={() => handleNotificationToggle('email', 'candidates')} /><span className="slider"></span></label></div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">{t('inAppNotifications')}</h4>
              <div className="flex justify-between items-center"><p>{t('leaveRequests')}</p><label className="switch"><input type="checkbox" checked={notifications.inApp.leave} onChange={() => handleNotificationToggle('inApp', 'leave')} /><span className="slider"></span></label></div>
              <div className="flex justify-between items-center"><p>{t('performanceReviews')}</p><label className="switch"><input type="checkbox" checked={notifications.inApp.performance} onChange={() => handleNotificationToggle('inApp', 'performance')} /><span className="slider"></span></label></div>
              <div className="flex justify-between items-center"><p>{t('newCandidates')}</p><label className="switch"><input type="checkbox" checked={notifications.inApp.candidates} onChange={() => handleNotificationToggle('inApp', 'candidates')} /><span className="slider"></span></label></div>
            </div>
          </div>
        );
      case 'company':
        return (
            <div className="space-y-8">
                <h3 className="text-lg font-medium">{t('companySettings')}</h3>
                <div>
                    <h4 className="font-medium mb-2">{t('manageDepartments')}</h4>
                    <div className="flex flex-wrap gap-2">
                        {['Engineering', 'Manufacturing', 'HR', 'Finance'].map(d => <span key={d} className="px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded-full text-sm">{d}</span>)}
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:underline">{t('addNew')}</button>
                </div>
                <div>
                    <h4 className="font-medium mb-2">{t('manageJobTitles')}</h4>
                     <div className="flex flex-wrap gap-2">
                        {['Engineer', 'Manager', 'Technician', 'Analyst'].map(d => <span key={d} className="px-3 py-1 bg-gray-200 dark:bg-slate-700 rounded-full text-sm">{d}</span>)}
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:underline">{t('addNew')}</button>
                </div>
            </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{t('appearance')}</h3>
            <div>
              <h4 className="font-medium mb-2">{t('theme')}</h4>
              <div className="flex space-x-2">
                {(['light', 'dark'] as const).map(th => (
                  <button key={th} onClick={() => setTheme(th)} className={`px-4 py-2 rounded-lg border-2 ${theme === th ? 'border-blue-500' : 'border-transparent'}`}>
                    <div className="flex items-center space-x-2">
                      {th === 'light' ? <Sun /> : <Moon />}
                      <span>{t(th)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <style>{`
        .switch { position: relative; display: inline-block; width: 40px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #2563eb; }
        input:checked + .slider:before { transform: translateX(16px); }
      `}</style>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('settings')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('manageSettings')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-700 p-4">
            <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="w-full md:w-3/4 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
