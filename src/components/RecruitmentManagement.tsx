import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Plus, Eye, Edit, MapPin, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockJobPostings, mockCandidates } from '../data/mockData';
import { JobPosting, Candidate } from '../types';
import { faker } from '@faker-js/faker';

const departments = [
  'engineering', 'manufacturing', 'quality', 'maintenance', 
  'safety', 'logistics', 'finance', 'hr', 'it', 'management'
];

const initialJobState: Omit<JobPosting, 'id' | 'postedDate' | 'applications'> = {
  title: '',
  department: '',
  location: '',
  type: 'full-time',
  description: '',
  requirements: [],
  salary: { min: 0, max: 0 },
  status: 'open',
};

const RecruitmentManagement: React.FC = () => {
  const { t } = useLanguage();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');
  const [filterStatus, setFilterStatus] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobFormData, setJobFormData] = useState(initialJobState);

  useEffect(() => {
    if (isModalOpen && modalMode === 'edit' && selectedJob) {
      setJobFormData({
        title: selectedJob.title,
        department: selectedJob.department,
        location: selectedJob.location,
        type: selectedJob.type,
        description: selectedJob.description,
        requirements: selectedJob.requirements,
        salary: selectedJob.salary,
        status: selectedJob.status,
      });
    } else {
      setJobFormData(initialJobState);
    }
  }, [modalMode, selectedJob, isModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'min' || name === 'max') {
      setJobFormData(prev => ({
        ...prev,
        salary: { ...prev.salary, [name]: parseInt(value) || 0 }
      }));
    } else if (name === 'requirements') {
      setJobFormData(prev => ({ ...prev, requirements: value.split('\n') }));
    } else {
      setJobFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenModal = (mode: 'add' | 'edit', job: JobPosting | null = null) => {
    setModalMode(mode);
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setJobFormData(initialJobState);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newJob: JobPosting = {
        id: faker.string.uuid(),
        ...jobFormData,
        postedDate: new Date().toISOString().split('T')[0],
        applications: 0,
      };
      setJobPostings([newJob, ...jobPostings]);
    } else if (selectedJob) {
      setJobPostings(jobPostings.map(job => 
        job.id === selectedJob.id ? { ...job, ...jobFormData } : job
      ));
    }
    handleCloseModal();
  };

  const filteredJobs = jobPostings.filter(job => !filterStatus || job.status === filterStatus);
  const filteredCandidates = candidates.filter(candidate => !filterStatus || candidate.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'filled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'hired': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'interview': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'offer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'part-time': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'contract': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'intern': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getJobTypeTranslationKey = (type: string) => {
    switch (type) {
      case 'full-time': return 'jobTypeFullTime';
      case 'part-time': return 'jobTypePartTime';
      case 'contract': return 'jobTypeContract';
      case 'intern': return 'jobTypeIntern';
      default: return '';
    }
  };

  const statsCards = [
    { title: t('activeJobs'), value: jobPostings.filter(j => j.status === 'open').length, icon: Briefcase, color: 'bg-blue-500' },
    { title: t('totalApplications'), value: candidates.length, icon: Users, color: 'bg-green-500' },
    { title: t('interviewsScheduled'), value: candidates.filter(c => c.status === 'interview').length, icon: Calendar, color: 'bg-yellow-500' },
    { title: t('hiredThisMonth'), value: candidates.filter(c => c.status === 'hired').length, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('recruitment')}</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">{t('manageRecruitment')}</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>{t('createJob')}</span>
        </button>
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

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6">
            <button
              onClick={() => { setActiveTab('jobs'); setFilterStatus(''); }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {t('jobPostings')} ({jobPostings.length})
            </button>
            <button
              onClick={() => { setActiveTab('candidates'); setFilterStatus(''); }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {t('candidates')} ({candidates.length})
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="">{t('allStatus')}</option>
              {activeTab === 'jobs' ? (<> <option value="open">Open</option> <option value="closed">Closed</option> <option value="filled">Filled</option> </>
              ) : (<> <option value="applied">Applied</option> <option value="screening">Screening</option> <option value="interview">Interview</option> <option value="offer">Offer</option> <option value="hired">Hired</option> <option value="rejected">Rejected</option> </>)}
            </select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                {t('jobCount', { count: activeTab === 'jobs' ? filteredJobs.length : filteredCandidates.length })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'jobs' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{job.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{t(job.department)}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button onClick={() => console.log('View job', job.id)} className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('edit', job)} className="p-1 text-gray-400 hover:text-green-600"><Edit className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>{t(job.status)}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeColor(job.type)}`}>{t(getJobTypeTranslationKey(job.type))}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                      <div className="flex items-center space-x-1"><DollarSign className="w-4 h-4" /><span>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</span></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">{job.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                      <span className="text-sm text-gray-500 dark:text-slate-400">{t('applicationsCount', { count: job.applications })}</span>
                      <span className="text-sm text-gray-500 dark:text-slate-400">{t('postedDateLabel', { date: new Date(job.postedDate).toLocaleDateString() })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Candidates Table (Desktop) */}
              <div className="overflow-x-auto hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('candidate')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('jobTitle')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('appliedDate')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('status')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-6 py-4 whitespace-nowrap"><div><div className="text-sm font-medium text-gray-900 dark:text-slate-100">{candidate.firstName} {candidate.lastName}</div><div className="text-sm text-gray-500 dark:text-slate-400">{candidate.email}</div></div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{candidate.jobTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-300">{new Date(candidate.appliedDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>{t(candidate.status)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><div className="flex space-x-2"><button onClick={() => console.log('View candidate', candidate.id)} className="text-blue-600 hover:text-blue-900"><Eye className="w-4 h-4" /></button><button onClick={() => console.log('Edit candidate', candidate.id)} className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Candidates Cards (Mobile) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredCandidates.map(candidate => (
                  <div key={candidate.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-slate-100">{candidate.firstName} {candidate.lastName}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{candidate.jobTitle}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>{t(candidate.status)}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 border-t border-gray-200 dark:border-slate-700 pt-3">
                      <p><strong>{t('appliedDate')}:</strong> {new Date(candidate.appliedDate).toLocaleDateString()}</p>
                    </div>
                     <div className="flex justify-end space-x-2 pt-2">
                        <button onClick={() => console.log('View candidate', candidate.id)} className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => console.log('Edit candidate', candidate.id)} className="p-2 text-green-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><Edit className="w-4 h-4" /></button>
                      </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {modalMode === 'add' ? t('createJob') : t('editJobPosting')}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="title" value={jobFormData.title} onChange={handleInputChange} placeholder={t('jobTitlePlaceholder')} className="px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" required />
                <select name="department" value={jobFormData.department} onChange={handleInputChange} className="px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" required>
                  <option value="">{t('selectDepartment')}</option>
                  {departments.map(dept => <option key={dept} value={dept}>{t(dept)}</option>)}
                </select>
                <input type="text" name="location" value={jobFormData.location} onChange={handleInputChange} placeholder={t('locationPlaceholder')} className="px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" required />
                <select name="type" value={jobFormData.type} onChange={handleInputChange} className="px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                  <option value="full-time">{t('jobTypeFullTime')}</option>
                  <option value="part-time">{t('jobTypePartTime')}</option>
                  <option value="contract">{t('jobTypeContract')}</option>
                  <option value="intern">{t('jobTypeIntern')}</option>
                </select>
                <input type="number" name="min" value={jobFormData.salary.min} onChange={handleInputChange} placeholder={t('minSalaryPlaceholder')} className="px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" />
                <input type="number" name="max" value={jobFormData.salary.max} onChange={handleInputChange} placeholder={t('maxSalaryPlaceholder')} className="px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" />
              </div>
              <textarea name="description" value={jobFormData.description} onChange={handleInputChange} placeholder={t('jobDescriptionPlaceholder')} rows={4} className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" required />
              <textarea name="requirements" value={jobFormData.requirements.join('\n')} onChange={handleInputChange} placeholder={t('requirementsPlaceholder')} rows={4} className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg" required />
              {modalMode === 'edit' && (
                <select name="status" value={jobFormData.status} onChange={handleInputChange} className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-700 rounded-lg">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="filled">Filled</option>
                </select>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
                  {t('cancel')}
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {modalMode === 'add' ? t('createJob') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentManagement;
