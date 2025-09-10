import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import LeaveManagement from './components/LeaveManagement';
import TrainingManagement from './components/TrainingManagement';
import AttendanceManagement from './components/AttendanceManagement';
import PayrollManagement from './components/PayrollManagement';
import PerformanceManagement from './components/PerformanceManagement';
import RecruitmentManagement from './components/RecruitmentManagement';
import BenefitsManagement from './components/BenefitsManagement';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'recruitment':
        return <RecruitmentManagement />;
      case 'performance':
        return <PerformanceManagement />;
      case 'payroll':
        return <PayrollManagement />;
      case 'leave':
        return <LeaveManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'training':
        return <TrainingManagement />;
      case 'benefits':
        return <BenefitsManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
