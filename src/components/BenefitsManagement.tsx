import React, { useState } from 'react';
import { HandHeart, AlertTriangle, FileText, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockInsurancePolicies, mockWorkAccidents, mockWorkCertificates, mockEmployees } from '../data/mockData';
import { InsurancePolicy, WorkAccident, WorkCertificate } from '../types';
import { faker } from '@faker-js/faker';
import DatePicker from 'react-datepicker';

const BenefitsManagement: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'insurance' | 'accidents' | 'certificates'>('insurance');
  
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(mockInsurancePolicies);
  const [workAccidents, setWorkAccidents] = useState<WorkAccident[]>(mockWorkAccidents);
  const [workCertificates, setWorkCertificates] = useState<WorkCertificate[]>(mockWorkCertificates);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'insurance' | 'accident' | 'certificate' | null>(null);

  const [newPolicy, setNewPolicy] = useState({ employeeId: '', type: 'health', provider: '', policyNumber: '', coverageAmount: 50000, monthlyPremium: 100, startDate: new Date() });
  const [newAccident, setNewAccident] = useState({ employeeId: '', accidentDate: new Date(), location: '', description: '', severity: 'minor', followUpActions: '' });
  const [newCertificate, setNewCertificate] = useState({ employeeId: '', type: 'work' });

  const openModal = (type: 'insurance' | 'accident' | 'certificate') => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handlePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockEmployees.find(emp => emp.id === newPolicy.employeeId);
    if (!employee) return;
    const policy: InsurancePolicy = {
      id: faker.string.uuid(),
      employeeId: newPolicy.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: newPolicy.type as 'health' | 'life' | 'disability',
      provider: newPolicy.provider,
      policyNumber: newPolicy.policyNumber,
      coverageAmount: newPolicy.coverageAmount,
      monthlyPremium: newPolicy.monthlyPremium,
      startDate: newPolicy.startDate.toISOString().split('T')[0],
      status: 'active'
    };
    setInsurancePolicies([policy, ...insurancePolicies]);
    closeModal();
  };

  const handleAccidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockEmployees.find(emp => emp.id === newAccident.employeeId);
    if (!employee) return;
    const accident: WorkAccident = {
      id: faker.string.uuid(),
      employeeId: newAccident.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      accidentDate: newAccident.accidentDate.toISOString(),
      location: newAccident.location,
      description: newAccident.description,
      severity: newAccident.severity as 'minor' | 'moderate' | 'severe' | 'critical',
      status: 'reported',
      followUpActions: newAccident.followUpActions,
    };
    setWorkAccidents([accident, ...workAccidents]);
    closeModal();
  };

  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockEmployees.find(emp => emp.id === newCertificate.employeeId);
    if (!employee) return;
    const certificate: WorkCertificate = {
      id: faker.string.uuid(),
      employeeId: newCertificate.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: newCertificate.type as 'work' | 'salary',
      requestDate: new Date().toISOString().split('T')[0],
      status: 'requested',
    };
    setWorkCertificates([certificate, ...workCertificates]);
    closeModal();
  };

  const getStatusColor = (status: string, context: string) => {
    if (context === 'insurance') {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'expired': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      }
    }
    if (context === 'accidents') {
      switch (status) {
        case 'reported': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
      }
    }
    if (context === 'certificates') {
        switch (status) {
            case 'requested': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'issued': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'downloaded': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        }
    }
    return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'critical': return 'bg-red-700 text-white';
        case 'severe': return 'bg-red-500 text-white';
        case 'moderate': return 'bg-yellow-500 text-black';
        case 'minor': return 'bg-green-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'insurance':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('insurance')}</h2>
                <button onClick={() => openModal('insurance')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    <span>{t('addPolicy')}</span>
                </button>
            </div>
            {/* Desktop Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('employee')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('type')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('provider')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('policyNumber')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('status')}</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {insurancePolicies.map(policy => (
                            <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{policy.employeeName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{t(policy.type === 'health' ? 'healthInsurance' : policy.type === 'life' ? 'lifeInsurance' : 'disabilityInsurance')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{policy.provider}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{policy.policyNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status, 'insurance')}`}>{t(policy.status)}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {insurancePolicies.map(policy => (
                <div key={policy.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900 dark:text-slate-100">{policy.employeeName}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status, 'insurance')}`}>{t(policy.status)}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-300 space-y-1 border-t border-gray-200 dark:border-slate-700 pt-3">
                    <p><strong>{t('type')}:</strong> {t(policy.type === 'health' ? 'healthInsurance' : policy.type === 'life' ? 'lifeInsurance' : 'disabilityInsurance')}</p>
                    <p><strong>{t('provider')}:</strong> {policy.provider}</p>
                    <p><strong>{t('policyNumber')}:</strong> {policy.policyNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'accidents':
        return (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{t('workAccidents')}</h2>
                  <button onClick={() => openModal('accident')} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <Plus className="w-4 h-4" />
                      <span>{t('reportAccident')}</span>
                  </button>
              </div>
              {/* Desktop Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
                  <div className="overflow-x-auto">
                      <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-slate-700">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('employee')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('accidentDate')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('location')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('severity')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('status')}</th>
                          </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                          {workAccidents.map(accident => (
                              <tr key={accident.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{accident.employeeName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{new Date(accident.accidentDate).toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{accident.location}</td>
                              <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(accident.severity)}`}>{t(accident.severity)}</span></td>
                              <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(accident.status, 'accidents')}`}>{t(accident.status)}</span></td>
                              </tr>
                          ))}
                          </tbody>
                      </table>
                  </div>
              </div>
              {/* Mobile Cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {workAccidents.map(accident => (
                  <div key={accident.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-slate-100">{accident.employeeName}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(accident.accidentDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(accident.severity)}`}>{t(accident.severity)}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 space-y-1 border-t border-gray-200 dark:border-slate-700 pt-3">
                      <p><strong>{t('location')}:</strong> {accident.location}</p>
                      <p><strong>{t('status')}:</strong> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(accident.status, 'accidents')}`}>{t(accident.status)}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
      case 'certificates':
        return (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{t('workCertificates')}</h2>
                  <button onClick={() => openModal('certificate')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="w-4 h-4" />
                      <span>{t('requestCertificate')}</span>
                  </button>
              </div>
              {/* Desktop Table */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hidden md:block">
                  <div className="overflow-x-auto">
                      <table className="w-full">
                          <thead className="bg-gray-50 dark:bg-slate-700">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('employee')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('certificateType')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('requestDate')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('status')}</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">{t('actions')}</th>
                          </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                          {workCertificates.map(cert => (
                              <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">{cert.employeeName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{t(cert.type === 'work' ? 'workCertificate' : 'salaryCertificate')}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{new Date(cert.requestDate).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cert.status, 'certificates')}`}>{t(cert.status)}</span></td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {cert.status === 'requested' && <button className="text-blue-600 hover:text-blue-800">{t('issueCertificate')}</button>}
                                {cert.status === 'issued' && <button className="text-green-600 hover:text-green-800">{t('download')}</button>}
                                {cert.status === 'downloaded' && <button className="text-purple-600 hover:text-purple-800">{t('download')}</button>}
                              </td>
                              </tr>
                          ))}
                          </tbody>
                      </table>
                  </div>
              </div>
              {/* Mobile Cards */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {workCertificates.map(cert => (
                  <div key={cert.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-slate-100">{cert.employeeName}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{t(cert.type === 'work' ? 'workCertificate' : 'salaryCertificate')}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cert.status, 'certificates')}`}>{t(cert.status)}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 border-t border-gray-200 dark:border-slate-700 pt-3">
                      <p><strong>{t('requestDate')}:</strong> {new Date(cert.requestDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-end pt-2">
                      {cert.status === 'requested' && <button className="text-sm text-blue-600 hover:underline">{t('issueCertificate')}</button>}
                      {cert.status === 'issued' && <button className="text-sm text-green-600 hover:underline">{t('download')}</button>}
                      {cert.status === 'downloaded' && <button className="text-sm text-purple-600 hover:underline">{t('download')}</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!showModal) return null;

    switch (modalType) {
      case 'insurance':
        return (
          <form onSubmit={handlePolicySubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{t('addNewPolicy')}</h2>
            <select value={newPolicy.employeeId} onChange={e => setNewPolicy({...newPolicy, employeeId: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required><option value="">{t('selectEmployee')}</option>{mockEmployees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}</select>
            <select value={newPolicy.type} onChange={e => setNewPolicy({...newPolicy, type: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded"><option value="health">{t('healthInsurance')}</option><option value="life">{t('lifeInsurance')}</option><option value="disability">{t('disabilityInsurance')}</option></select>
            <input type="text" placeholder={t('provider')} value={newPolicy.provider} onChange={e => setNewPolicy({...newPolicy, provider: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required />
            <input type="text" placeholder={t('policyNumber')} value={newPolicy.policyNumber} onChange={e => setNewPolicy({...newPolicy, policyNumber: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required />
            <div className="flex justify-end space-x-2"><button type="button" onClick={closeModal} className="px-4 py-2 border dark:border-slate-600 rounded">{t('cancel')}</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{t('save')}</button></div>
          </form>
        );
      case 'accident':
        return (
          <form onSubmit={handleAccidentSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{t('reportNewAccident')}</h2>
            <select value={newAccident.employeeId} onChange={e => setNewAccident({...newAccident, employeeId: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required><option value="">{t('selectEmployee')}</option>{mockEmployees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}</select>
            <DatePicker selected={newAccident.accidentDate} onChange={(date: Date) => setNewAccident({...newAccident, accidentDate: date})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" />
            <input type="text" placeholder={t('location')} value={newAccident.location} onChange={e => setNewAccident({...newAccident, location: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required />
            <textarea placeholder={t('description')} value={newAccident.description} onChange={e => setNewAccident({...newAccident, description: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required />
            <select value={newAccident.severity} onChange={e => setNewAccident({...newAccident, severity: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded"><option value="minor">{t('minor')}</option><option value="moderate">{t('moderate')}</option><option value="severe">{t('severe')}</option><option value="critical">{t('critical')}</option></select>
            <div className="flex justify-end space-x-2"><button type="button" onClick={closeModal} className="px-4 py-2 border dark:border-slate-600 rounded">{t('cancel')}</button><button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">{t('reportAccident')}</button></div>
          </form>
        );
      case 'certificate':
        return (
          <form onSubmit={handleCertificateSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">{t('requestNewCertificate')}</h2>
            <select value={newCertificate.employeeId} onChange={e => setNewCertificate({...newCertificate, employeeId: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded" required><option value="">{t('selectEmployee')}</option>{mockEmployees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}</select>
            <select value={newCertificate.type} onChange={e => setNewCertificate({...newCertificate, type: e.target.value})} className="w-full p-2 border dark:border-slate-600 dark:bg-slate-700 rounded"><option value="work">{t('workCertificate')}</option><option value="salary">{t('salaryCertificate')}</option></select>
            <div className="flex justify-end space-x-2"><button type="button" onClick={closeModal} className="px-4 py-2 border dark:border-slate-600 rounded">{t('cancel')}</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{t('submitRequest')}</button></div>
          </form>
        );
      default:
        return null;
    }
  }

  const tabs = [
    { id: 'insurance', label: t('insurance'), icon: HandHeart },
    { id: 'accidents', label: t('workAccidents'), icon: AlertTriangle },
    { id: 'certificates', label: t('workCertificates'), icon: FileText },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('benefits')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('manageEmployeeBenefits')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
            {renderModal()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitsManagement;
