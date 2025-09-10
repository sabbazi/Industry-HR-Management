import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Edit, Eye, Trash2, Download, Upload, Phone, Mail, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockEmployees } from '../data/mockData';
import { Employee } from '../types';
import { faker } from '@faker-js/faker';

const EmployeeManagement: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const departments = Array.from(new Set(mockEmployees.map(emp => emp.department)));

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('edit');
    setShowModal(true);
  };

  const handleViewClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalType('view');
    setShowModal(true);
  };

  const handleDeleteClick = (employeeId: string) => {
    if (window.confirm(t('confirmDeleteEmployee'))) {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted for", modalType);
    setShowModal(false);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const handleExport = () => {
    const headers = [
        'id', 'firstName', 'lastName', 'email', 'phone', 'department', 
        'position', 'hireDate', 'salary', 'status', 'address', 
        'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship',
        'skills', 'certifications'
    ];

    const csvRows = [
        headers.join(','),
        ...filteredEmployees.map(emp => [
            `"${emp.id}"`, `"${emp.firstName}"`, `"${emp.lastName}"`, `"${emp.email}"`,
            `"${emp.phone}"`, `"${emp.department}"`, `"${emp.position}"`, `"${emp.hireDate}"`,
            emp.salary, `"${emp.status}"`, `"${emp.address.replace(/"/g, '""')}"`,
            `"${emp.emergencyContact.name}"`, `"${emp.emergencyContact.phone}"`, `"${emp.emergencyContact.relationship}"`,
            `"${emp.skills.join(';')}"`, `"${emp.certifications.join(';')}"`
        ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          const text = e.target?.result as string;
          if (!text) { alert(t('importNoData')); return; }
          try {
              const rows = text.trim().split('\n');
              const header = rows.shift()?.split(',') || [];
              if (header.length < 2) throw new Error("Invalid CSV header.");

              const newEmployees: Employee[] = rows.map(row => {
                  const values = row.split(',');
                  const employeeData: any = {
                      id: faker.string.uuid(),
                      status: 'active',
                      emergencyContact: { name: '', phone: '', relationship: '' },
                      skills: [],
                      certifications: [],
                      avatar: faker.image.avatar()
                  };

                  header.forEach((key, index) => {
                      const value = values[index]?.trim().replace(/"/g, '');
                      if (value) {
                          const propKey = key.trim();
                          if (propKey === 'salary') employeeData[propKey] = parseInt(value, 10);
                          else if (propKey === 'skills' || propKey === 'certifications') employeeData[propKey] = value.split(';');
                          else employeeData[propKey] = value;
                      }
                  });

                  if (!employeeData.firstName || !employeeData.lastName) return null;
                  return employeeData as Employee;
              }).filter((emp): emp is Employee => emp !== null);

              if (newEmployees.length > 0) {
                  setEmployees(prev => [...prev, ...newEmployees]);
                  alert(t('importSuccess', { count: newEmployees.length }));
              } else {
                  alert(t('importNoData'));
              }
          } catch (error) {
              console.error("Error importing file:", error);
              alert(t('importFailed'));
          }
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".csv"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('employees')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('manageWorkforce')}</p>
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <button onClick={handleImportClick} className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 
            rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">{t('import')}</span>
          </button>
          <button onClick={handleExport} className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 
            rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('export')}</span>
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white 
              rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('addEmployee')}</span>
            <span className="sm:hidden">{t('addEmployee').split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 
              text-gray-400 w-4 h-4`} />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
          
          <div className="relative">
            <Filter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 
              text-gray-400 w-4 h-4`} />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700
                rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
            >
              <option value="">{t('departmentAll')}</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{t(dept)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {t('employeeCount', { count: filteredEmployees.length, total: employees.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Employee Table for Desktop */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('fullName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('department')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('position')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('hireDate')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=3B82F6&color=fff`} alt={`${employee.firstName} ${employee.lastName}`} />
                      <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{employee.firstName} {employee.lastName}</div>
                        <div className="text-sm text-gray-500 dark:text-slate-400">{employee.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{t(employee.department)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{employee.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{new Date(employee.hireDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>{t(employee.status === 'on-leave' ? 'onLeave' : employee.status)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleViewClick(employee)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEditClick(employee)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClick(employee.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Cards for Mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img className="h-10 w-10 rounded-full" src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=3B82F6&color=fff`} alt={`${employee.firstName} ${employee.lastName}`} />
                <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <p className="font-bold text-gray-900 dark:text-slate-100">{employee.firstName} {employee.lastName}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{employee.position}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>{t(employee.status === 'on-leave' ? 'onLeave' : employee.status)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3 space-y-2 text-sm">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-400"/> {employee.email}</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400"/> {employee.phone}</div>
              <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-400"/> {t(employee.department)}</div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => handleViewClick(employee)} className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><Eye className="w-4 h-4" /></button>
              <button onClick={() => handleEditClick(employee)} className="p-2 text-green-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteClick(employee.id)} className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-slate-400">
          {t('paginationResults', { start: 1, end: Math.min(10, filteredEmployees.length), total: filteredEmployees.length })}
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700">{t('previous')}</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700">2</button>
          <button className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700">{t('next')}</button>
        </div>
      </div>

      {/* Add/Edit/View Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              {modalType === 'add' && t('addEmployee')}
              {modalType === 'edit' && t('editEmployee')}
              {modalType === 'view' && t('viewEmployeeDetails')}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder={t('firstName')} defaultValue={selectedEmployee?.firstName} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
                <input type="text" placeholder={t('lastName')} defaultValue={selectedEmployee?.lastName} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
                <input type="email" placeholder={t('email')} defaultValue={selectedEmployee?.email} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
                <input type="tel" placeholder={t('phone')} defaultValue={selectedEmployee?.phone} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
                <select defaultValue={selectedEmployee?.department} disabled={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-slate-600">
                  <option value="">{t('selectDepartment')}</option>
                  {departments.map(dept => (<option key={dept} value={dept}>{t(dept)}</option>))}
                </select>
                <input type="text" placeholder={t('position')} defaultValue={selectedEmployee?.position} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
                <input type="date" placeholder={t('hireDate')} defaultValue={selectedEmployee?.hireDate} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
                <input type="number" placeholder={t('salary')} defaultValue={selectedEmployee?.salary} readOnly={modalType === 'view'} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 read-only:bg-gray-100 dark:read-only:bg-slate-600" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  {modalType === 'view' ? t('close') : t('cancel')}
                </button>
                {modalType !== 'view' && (<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('save')}</button>)}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
