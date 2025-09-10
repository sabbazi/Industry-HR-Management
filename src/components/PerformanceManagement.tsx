import React, { useState } from 'react';
import { TrendingUp, Star, Target, Award, Plus, Edit, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { mockPerformanceReviews, mockEmployees } from '../data/mockData';
import { PerformanceReview } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { faker } from '@faker-js/faker';

const initialReviewState = {
  employeeId: '',
  reviewPeriod: 'Q1 2025',
  overallRating: 0,
  goals: '',
  achievements: '',
  improvementAreas: '',
};

const PerformanceManagement: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(mockPerformanceReviews);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newReviewData, setNewReviewData] = useState(initialReviewState);

  const handleCreateClick = () => {
    setNewReviewData(initialReviewState);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = mockEmployees.find(emp => emp.id === newReviewData.employeeId);
    if (!employee || !user) {
      alert(t('selectEmployeeAlert'));
      return;
    }
    const newReview: PerformanceReview = {
      id: faker.string.uuid(),
      employeeId: newReviewData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      reviewPeriod: newReviewData.reviewPeriod,
      overallRating: 0,
      goals: newReviewData.goals.split('\n'),
      achievements: newReviewData.achievements.split('\n'),
      improvementAreas: newReviewData.improvementAreas.split('\n'),
      reviewedBy: `${user.firstName} ${user.lastName}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setPerformanceReviews([newReview, ...performanceReviews]);
    setShowModal(false);
  };

  const filteredReviews = performanceReviews.filter(review => {
    const matchesStatus = !filterStatus || review.status === filterStatus;
    const matchesPeriod = !filterPeriod || review.reviewPeriod === filterPeriod;
    return matchesStatus && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = filteredReviews.length > 0 
    ? filteredReviews.reduce((sum, review) => sum + review.overallRating, 0) / filteredReviews.length 
    : 0;

  const periods = Array.from(new Set(performanceReviews.map(review => review.reviewPeriod))).sort().reverse();

  const statsCards = [
    { 
      title: t('totalReviews'), 
      value: filteredReviews.length, 
      icon: TrendingUp, 
      color: 'bg-blue-500' 
    },
    { 
      title: t('averageRating'), 
      value: averageRating.toFixed(1), 
      icon: Star, 
      color: 'bg-yellow-500' 
    },
    { 
      title: t('completedReviews'), 
      value: filteredReviews.filter(r => r.status === 'completed' || r.status === 'approved').length, 
      icon: Award, 
      color: 'bg-green-500' 
    },
    { 
      title: t('pendingReviews'), 
      value: filteredReviews.filter(r => r.status === 'draft').length, 
      icon: Target, 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('performance')}</h1>
          <p className="text-gray-600 mt-1">{t('managePerformance')}</p>
        </div>
        <button onClick={handleCreateClick} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>{t('createReview')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">{t('allStatus')}</option>
            <option value="draft">{t('draft')}</option>
            <option value="completed">{t('completed')}</option>
            <option value="approved">{t('approved')}</option>
          </select>
          
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">{t('allPeriods')}</option>
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {t('reviewCount', { count: filteredReviews.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{review.employeeName}</h3>
                <p className="text-sm text-gray-600">{review.reviewPeriod}</p>
                <p className="text-xs text-gray-500 mt-1">{t('reviewedBy', { name: review.reviewedBy })}</p>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => console.log('View review', review.id)} className="p-1 text-gray-400 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => console.log('Edit review', review.id)} className="p-1 text-gray-400 hover:text-green-600">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Overall Rating */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t('overallRating')}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {getRatingStars(review.overallRating)}
                  </div>
                  <span className={`text-lg font-bold ${getRatingColor(review.overallRating)}`}>
                    {review.overallRating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{t('status')}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                  {t(review.status)}
                </span>
              </div>

              {/* Goals */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('goals')}</h4>
                <div className="space-y-1">
                  {review.goals.slice(0, 2).map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Target className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 line-clamp-1">{goal}</span>
                    </div>
                  ))}
                  {review.goals.length > 2 && (
                    <span className="text-xs text-gray-500">+{review.goals.length - 2} more goals</span>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('achievements')}</h4>
                <div className="space-y-1">
                  {review.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 line-clamp-1">{achievement}</span>
                    </div>
                  ))}
                  {review.achievements.length > 2 && (
                    <span className="text-xs text-gray-500">+{review.achievements.length - 2} more achievements</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-200">
                <button onClick={() => console.log('Action for review', review.id)} className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                  {review.status === 'draft' ? t('continueReview') : t('viewDetails')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{t('createPerformanceReview')}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('employee')}</label>
                  <select name="employeeId" value={newReviewData.employeeId} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required>
                    <option value="">{t('selectEmployee')}</option>
                    {mockEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('reviewPeriod')}</label>
                  <select name="reviewPeriod" value={newReviewData.reviewPeriod} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required>
                    <option value="Q1 2025">Q1 2025</option>
                    <option value="Q2 2025">Q2 2025</option>
                    <option value="Q3 2025">Q3 2025</option>
                    <option value="Q4 2025">Q4 2025</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('goals')}</label>
                <textarea name="goals" value={newReviewData.goals} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder={t('goalsPlaceholder')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('achievements')}</label>
                <textarea name="achievements" value={newReviewData.achievements} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder={t('achievementsPlaceholder')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('improvementAreas')}</label>
                <textarea name="improvementAreas" value={newReviewData.improvementAreas} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border rounded-lg" placeholder={t('improvementAreasPlaceholder')} />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('createDraft')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceManagement;
