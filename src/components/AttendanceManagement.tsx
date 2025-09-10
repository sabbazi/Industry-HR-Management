import React, { useState } from 'react';
import { Clock, MapPin, Calendar, CheckCircle, XCircle, Filter, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockAttendanceRecords, mockEmployees } from '../data/mockData';
import { AttendanceRecord } from '../types';
import { faker } from '@faker-js/faker';

const AttendanceManagement: React.FC = () => {
  const { t } = useLanguage();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const handleCheckIn = () => {
    if (!selectedEmployeeId) {
      alert(t('selectEmployeeAlert'));
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const alreadyCheckedIn = attendanceRecords.some(
      record => record.employeeId === selectedEmployeeId && record.date === today
    );

    if (alreadyCheckedIn) {
      alert(t('alreadyCheckedIn'));
      return;
    }

    const employee = mockEmployees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) return;

    const checkInTime = new Date();
    const isLate = checkInTime.getHours() >= 9;

    const newRecord: AttendanceRecord = {
      id: faker.string.uuid(),
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      date: today,
      checkIn: checkInTime.toTimeString().slice(0, 5),
      totalHours: 0,
      status: isLate ? 'late' : 'present',
      location: faker.helpers.arrayElement(['Main Factory', 'Office Building', 'Warehouse', 'Remote']),
    };

    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setShowCheckInModal(false);
    setSelectedEmployeeId('');
  };

  const getCheckedInEmployees = () => {
    const today = new Date().toISOString().split('T')[0];
    const checkedInIds = new Set(
      attendanceRecords
        .filter(r => r.date === today && !r.checkOut)
        .map(r => r.employeeId)
    );
    return mockEmployees.filter(emp => checkedInIds.has(emp.id));
  };

  const handleCheckOut = () => {
    if (!selectedEmployeeId) {
      alert(t('selectEmployeeAlert'));
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const checkOutTime = new Date();

    setAttendanceRecords(
      attendanceRecords.map(record => {
        if (record.employeeId === selectedEmployeeId && record.date === today && !record.checkOut) {
          const checkInDateTime = new Date(`${record.date}T${record.checkIn}`);
          const totalHours = (checkOutTime.getTime() - checkInDateTime.getTime()) / (1000 * 60 * 60);

          return {
            ...record,
            checkOut: checkOutTime.toTimeString().slice(0, 5),
            totalHours: parseFloat(totalHours.toFixed(2)),
          };
        }
        return record;
      })
    );

    setShowCheckOutModal(false);
    setSelectedEmployeeId('');
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesDate = !selectedDate || record.date === selectedDate;
    return matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'half-day': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'half-day': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalHours = filteredRecords.reduce((sum, record) => sum + record.totalHours, 0);
  const averageHours = filteredRecords.length > 0 ? totalHours / filteredRecords.length : 0;

  const handleExport = () => {
    const headers = ['id', 'employeeId', 'employeeName', 'date', 'checkIn', 'checkOut', 'totalHours', 'status', 'location'];
    const csvRows = [
        headers.join(','),
        ...filteredRecords.map(rec => [
            `"${rec.id}"`, `"${rec.employeeId}"`, `"${rec.employeeName}"`, `"${rec.date}"`,
            `"${rec.checkIn}"`, `"${rec.checkOut || ''}"`, rec.totalHours, `"${rec.status}"`, `"${rec.location}"`
        ].join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statsCards = [
    { title: t('presentToday'), value: filteredRecords.filter(r => r.status === 'present').length, icon: CheckCircle, color: 'bg-green-500' },
    { title: t('lateArrivals'), value: filteredRecords.filter(r => r.status === 'late').length, icon: Clock, color: 'bg-yellow-500' },
    { title: t('absent'), value: filteredRecords.filter(r => r.status === 'absent').length, icon: XCircle, color: 'bg-red-500' },
    { title: t('averageHours'), value: averageHours.toFixed(1), icon: Clock, color: 'bg-blue-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('attendance')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('manageAttendance')}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowCheckInModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>{t('checkIn')}</span>
          </button>
          <button onClick={() => setShowCheckOutModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <XCircle className="w-4 h-4" />
            <span>{t('checkOut')}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">{t('allStatus')}</option>
              <option value="present">{t('present')}</option>
              <option value="late">{t('late')}</option>
              <option value="absent">{t('absent')}</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {t('recordCount', { count: filteredRecords.length })}
            </span>
          </div>

          <button onClick={handleExport} className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>{t('export')}</span>
          </button>
        </div>
      </div>

      {/* Attendance Table (Desktop) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('employee')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('checkIn')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('checkOut')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('totalHours')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('location')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-slate-100">{record.employeeName}</div><div className="text-sm text-gray-500 dark:text-slate-400">ID: {record.employeeId.slice(0, 8)}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{record.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{record.checkOut || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{t('hoursUnit', { count: record.totalHours.toFixed(1) })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300"><div className="flex items-center space-x-1"><MapPin className="w-4 h-4 text-gray-400" /><span>{record.location}</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-2">{getStatusIcon(record.status)}<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Cards (Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900 dark:text-slate-100">{record.employeeName}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(record.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">{getStatusIcon(record.status)}<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300 space-y-1 border-t border-gray-200 dark:border-slate-700 pt-3">
              <p><strong>{t('checkIn')}:</strong> {record.checkIn}</p>
              <p><strong>{t('checkOut')}:</strong> {record.checkOut || '-'}</p>
              <p><strong>{t('totalHours')}:</strong> {t('hoursUnit', { count: record.totalHours.toFixed(1) })}</p>
              <p><strong>{t('location')}:</strong> {record.location}</p>
            </div>
          </div>
        ))}
      </div>
      
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">{t('checkInEmployee')}</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('selectEmployee')}</label>
              <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                <option value="">{t('select')}</option>
                {mockEmployees.map(emp => (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button type="button" onClick={() => {setShowCheckInModal(false); setSelectedEmployeeId('');}} className="px-4 py-2 border dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">{t('cancel')}</button>
              <button type="button" onClick={handleCheckIn} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{t('confirmCheckIn')}</button>
            </div>
          </div>
        </div>
      )}

      {showCheckOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">{t('checkOutEmployee')}</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('selectEmployee')}</label>
              <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                <option value="">{t('select')}</option>
                {getCheckedInEmployees().map(emp => (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>))}
              </select>
              {getCheckedInEmployees().length === 0 && <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">{t('noEmployeesCheckedIn')}</p>}
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button type="button" onClick={() => {setShowCheckOutModal(false); setSelectedEmployeeId('');}} className="px-4 py-2 border dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">{t('cancel')}</button>
              <button type="button" onClick={handleCheckOut} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" disabled={getCheckedInEmployees().length === 0}>{t('confirmCheckOut')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
