import React, { useState } from 'react';
import { Calendar, Filter, Plus, Check, X, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useLanguage } from '../contexts/LanguageContext';
import { mockLeaveRequests, mockEmployees } from '../data/mockData';
import { LeaveRequest } from '../types';
import { faker } from '@faker-js/faker';

const initialLeaveState = {
  employeeId: '',
  type: 'annual' as const,
  startDate: new Date(),
  endDate: new Date(),
  reason: '',
};

const LeaveManagement: React.FC = () => {
  const { t } = useLanguage();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState(initialLeaveState);

  const handleStatusChange = (requestId: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(
      leaveRequests.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const handleCreateClick = () => {
    setNewLeaveData(initialLeaveState);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLeaveData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setNewLeaveData(prev => ({ ...prev, startDate: start || new Date(), endDate: end || new Date() }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockEmployees.find(emp => emp.id === newLeaveData.employeeId);
    if (!employee) {
      alert(t('selectEmployeeAlert'));
      return;
    }
    const newRequest: LeaveRequest = {
      id: faker.string.uuid(),
      employeeId: newLeaveData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: newLeaveData.type,
      startDate: newLeaveData.startDate.toISOString().split('T')[0],
      endDate: newLeaveData.endDate.toISOString().split('T')[0],
      reason: newLeaveData.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowModal(false);
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = !filterStatus || request.status === filterStatus;
    const matchesType = !filterType || request.type === filterType;
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getTypeTranslationKey = (type: string) => {
    switch (type) {
      case 'annual': return 'annualLeave';
      case 'sick': return 'sickLeave';
      case 'personal': return 'personalLeave';
      case 'maternity': return 'maternityLeave';
      case 'emergency': return 'emergencyLeave';
      default: return type;
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'sick': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'maternity': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300';
      case 'emergency': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('leave')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('manageLeave')}</p>
        </div>
        <button onClick={handleCreateClick} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>{t('newLeaveRequest')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: t('pendingRequests'), value: leaveRequests.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
          { title: t('approvedThisMonth'), value: leaveRequests.filter(r => r.status === 'approved').length, color: 'bg-green-500' },
          { title: t('totalDaysRequested'), value: leaveRequests.reduce((acc, req) => acc + calculateDays(req.startDate, req.endDate), 0), color: 'bg-blue-500' },
          { title: t('avgProcessingTime'), value: t('daysValue', { count: 2.3 }), color: 'bg-purple-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">{t('allStatus')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="rejected">{t('rejected')}</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">{t('allTypes')}</option>
              <option value="annual">{t('annualLeave')}</option>
              <option value="sick">{t('sickLeave')}</option>
              <option value="personal">{t('personalLeave')}</option>
              <option value="maternity">{t('maternityLeave')}</option>
              <option value="emergency">{t('emergencyLeave')}</option>
            </select>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {t('requestCount', { count: filteredRequests.length, total: leaveRequests.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Leave Requests Table (Desktop) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('employee')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('duration')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('dates')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('reason')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-slate-100">{request.employeeName}</div><div className="text-sm text-gray-500 dark:text-slate-400">ID: {request.employeeId.slice(0, 8)}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>{t(getTypeTranslationKey(request.type))}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{t('daysUnit', { count: calculateDays(request.startDate, request.endDate) })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300"><div>{new Date(request.startDate).toLocaleDateString()}</div><div className="text-gray-500 dark:text-slate-400">{t('dateTo')} {new Date(request.endDate).toLocaleDateString()}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-slate-300 max-w-xs truncate">{request.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>{t(request.status)}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'pending' ? (<div className="flex space-x-2"><button onClick={() => handleStatusChange(request.id, 'approved')} className="text-green-600 hover:text-green-900" title={t('approve')}><Check className="w-4 h-4" /></button><button onClick={() => handleStatusChange(request.id, 'rejected')} className="text-red-600 hover:text-red-900" title={t('reject')}><X className="w-4 h-4" /></button></div>) : (<div className="flex items-center space-x-1 text-gray-500 dark:text-slate-400"><Clock className="w-4 h-4" /><span className="text-xs">{t(request.status)}</span></div>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Requests Cards (Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900 dark:text-slate-100">{request.employeeName}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>{t(getTypeTranslationKey(request.type))}</span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>{t(request.status)}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300 space-y-1">
              <p><strong>{t('duration')}:</strong> {t('daysUnit', { count: calculateDays(request.startDate, request.endDate) })}</p>
              <p><strong>{t('dates')}:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</p>
              <p><strong>{t('reason')}:</strong> <span className="italic">{request.reason}</span></p>
            </div>
            {request.status === 'pending' && (
              <div className="flex justify-end space-x-2 border-t border-gray-200 dark:border-slate-700 pt-3">
                <button onClick={() => handleStatusChange(request.id, 'rejected')} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg">{t('reject')}</button>
                <button onClick={() => handleStatusChange(request.id, 'approved')} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg">{t('approve')}</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-6">{t('newLeaveRequest')}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('employee')}</label>
                <select name="employeeId" value={newLeaveData.employeeId} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg" required>
                  <option value="">{t('selectEmployee')}</option>
                  {mockEmployees.map(emp => (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('leaveType')}</label>
                <select name="type" value={newLeaveData.type} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg" required>
                  <option value="annual">{t('annualLeave')}</option>
                  <option value="sick">{t('sickLeave')}</option>
                  <option value="personal">{t('personalLeave')}</option>
                  <option value="maternity">{t('maternityLeave')}</option>
                  <option value="emergency">{t('emergencyLeave')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('dateRange')}</label>
                <DatePicker selectsRange startDate={newLeaveData.startDate} endDate={newLeaveData.endDate} onChange={handleDateChange} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg" dateFormat="MM/dd/yyyy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('reason')}</label>
                <textarea name="reason" value={newLeaveData.reason} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg" required />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('submitRequest')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
