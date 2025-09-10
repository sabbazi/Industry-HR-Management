import React, { useState } from 'react';
import { DollarSign, Calculator, Download, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockPayrollRecords } from '../data/mockData';
import { PayrollRecord } from '../types';

const PayrollManagement: React.FC = () => {
  const { t } = useLanguage();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [periodToProcess, setPeriodToProcess] = useState('');

  const filteredRecords = payrollRecords.filter(record => {
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesPeriod = !selectedPeriod || record.period === selectedPeriod;
    return matchesStatus && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'processed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processed': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'draft': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalGrossPay = filteredRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalDeductions = filteredRecords.reduce((sum, record) => sum + record.deductions, 0);

  const periods = Array.from(new Set(payrollRecords.map(record => record.period))).sort().reverse();
  const draftPeriods = Array.from(new Set(payrollRecords.filter(r => r.status === 'draft').map(r => r.period))).sort().reverse();

  const handleExport = () => {
    const headers = ['id', 'employeeId', 'employeeName', 'period', 'baseSalary', 'overtime', 'bonuses', 'deductions', 'grossPay', 'netPay', 'status', 'payDate'];
    const csvRows = [
        headers.join(','),
        ...filteredRecords.map(rec => [
            `"${rec.id}"`, `"${rec.employeeId}"`, `"${rec.employeeName}"`, `"${rec.period}"`,
            rec.baseSalary, rec.overtime, rec.bonuses, rec.deductions, rec.grossPay, rec.netPay,
            `"${rec.status}"`, `"${rec.payDate || ''}"`
        ].join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'payroll_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessPayroll = () => {
    if (!periodToProcess) return;
    setPayrollRecords(prevRecords =>
      prevRecords.map(record =>
        record.period === periodToProcess && record.status === 'draft'
          ? { ...record, status: 'processed' }
          : record
      )
    );
    setShowProcessModal(false);
    setPeriodToProcess('');
  };

  const statsCards = [
    { title: t('totalGrossPay'), value: `$${totalGrossPay.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: t('totalNetPay'), value: `$${totalNetPay.toLocaleString()}`, icon: DollarSign, color: 'bg-blue-500' },
    { title: t('totalDeductions'), value: `$${totalDeductions.toLocaleString()}`, icon: Calculator, color: 'bg-red-500' },
    { title: t('processedRecords'), value: payrollRecords.filter(r => r.status === 'processed' || r.status === 'paid').length, icon: CheckCircle, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('payrollManagement')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('managePayroll')}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowProcessModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Calculator className="w-4 h-4" />
            <span>{t('processPayroll')}</span>
          </button>
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>{t('exportReport')}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">{t('allStatus')}</option>
              <option value="draft">{t('draft')}</option>
              <option value="processed">{t('processed')}</option>
              <option value="paid">{t('paid')}</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">{t('allPeriods')}</option>
              {periods.map(period => (<option key={period} value={period}>{period}</option>))}
            </select>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {t('recordCount', { count: filteredRecords.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Payroll Table (Desktop) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('employee')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('period')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('grossPay')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('deductions')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('netPay')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-slate-100">{record.employeeName}</div><div className="text-sm text-gray-500 dark:text-slate-400">ID: {record.employeeId.slice(0, 8)}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{record.period}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-300">${record.grossPay.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">(${record.deductions.toLocaleString()})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">${record.netPay.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-2">{getStatusIcon(record.status)}<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>{t(record.status)}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Cards (Mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900 dark:text-slate-100">{record.employeeName}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{t('period')}: {record.period}</p>
              </div>
              <div className="flex items-center space-x-2">{getStatusIcon(record.status)}<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>{t(record.status)}</span></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300 space-y-1 border-t border-gray-200 dark:border-slate-700 pt-3">
              <p><strong>{t('grossPay')}:</strong> <span className="font-medium text-gray-800 dark:text-slate-200">${record.grossPay.toLocaleString()}</span></p>
              <p><strong>{t('deductions')}:</strong> <span className="text-red-600 dark:text-red-400">(${record.deductions.toLocaleString()})</span></p>
              <p><strong>{t('netPay')}:</strong> <span className="font-bold text-green-600 dark:text-green-400">${record.netPay.toLocaleString()}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Process Payroll Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">{t('processPayrollForPeriod')}</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('selectPeriod')}</label>
              <select value={periodToProcess} onChange={(e) => setPeriodToProcess(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                <option value="">{t('select')}</option>
                {draftPeriods.map(p => (<option key={p} value={p}>{p}</option>))}
              </select>
              {draftPeriods.length === 0 && <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">{t('noDraftsToProcess')}</p>}
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button type="button" onClick={() => setShowProcessModal(false)} className="px-4 py-2 border dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">{t('cancel')}</button>
              <button type="button" onClick={handleProcessPayroll} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={!periodToProcess}>
                {t('confirmProcess')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;
