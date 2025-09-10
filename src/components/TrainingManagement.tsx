import React, { useState } from 'react';
import { BookOpen, Users, Calendar, Clock, Plus, Edit, Eye } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useLanguage } from '../contexts/LanguageContext';
import { mockTrainingPrograms } from '../data/mockData';
import { TrainingProgram } from '../types';
import { faker } from '@faker-js/faker';

const initialTrainingState = {
  title: '',
  description: '',
  instructor: '',
  startDate: new Date(),
  endDate: new Date(),
  capacity: 20,
  category: 'Technical' as const,
};

const TrainingManagement: React.FC = () => {
  const { t } = useLanguage();
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(mockTrainingPrograms);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTrainingData, setNewTrainingData] = useState(initialTrainingState);

  const handleCreateClick = () => {
    setNewTrainingData(initialTrainingState);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTrainingData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value) : value }));
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setNewTrainingData(prev => ({ ...prev, startDate: start || new Date(), endDate: end || new Date() }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProgram: TrainingProgram = {
      id: faker.string.uuid(),
      ...newTrainingData,
      startDate: newTrainingData.startDate.toISOString().split('T')[0],
      endDate: newTrainingData.endDate.toISOString().split('T')[0],
      enrolled: 0,
      status: 'upcoming',
    };
    setTrainingPrograms([newProgram, ...trainingPrograms]);
    setShowModal(false);
  };

  const filteredPrograms = trainingPrograms.filter(program => {
    const matchesStatus = !filterStatus || program.status === filterStatus;
    const matchesCategory = !filterCategory || program.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Safety': return 'bg-red-100 text-red-800';
      case 'Technical': return 'bg-blue-100 text-blue-800';
      case 'Management': return 'bg-purple-100 text-purple-800';
      case 'Compliance': return 'bg-yellow-100 text-yellow-800';
      case 'Soft Skills': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (enrolled: number, capacity: number) => {
    if (capacity === 0) return 0;
    return Math.round((enrolled / capacity) * 100);
  };

  const statsCards = [
    { 
      title: t('activePrograms'), 
      value: trainingPrograms.filter(p => p.status === 'ongoing').length, 
      icon: BookOpen, 
      color: 'bg-blue-500' 
    },
    { 
      title: t('totalEnrolled'), 
      value: trainingPrograms.reduce((acc, p) => acc + p.enrolled, 0), 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: t('upcomingPrograms'), 
      value: trainingPrograms.filter(p => p.status === 'upcoming').length, 
      icon: Calendar, 
      color: 'bg-yellow-500' 
    },
    { 
      title: t('completionRate'), 
      value: '87%', 
      icon: Clock, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('training')}</h1>
          <p className="text-gray-600 mt-1">{t('manageTraining')}</p>
        </div>
        <button onClick={handleCreateClick} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>{t('createTrainingProgram')}</span>
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
            <option value="upcoming">{t('upcoming')}</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">{t('completed')}</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">{t('allCategories')}</option>
            <option value="Safety">Safety</option>
            <option value="Technical">Technical</option>
            <option value="Management">Management</option>
            <option value="Compliance">Compliance</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {t('programCount', { count: filteredPrograms.length, total: trainingPrograms.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Training Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => {
          const progress = calculateProgress(program.enrolled, program.capacity);
          return (
            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{program.description}</p>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => console.log('View program', program.id)} className="p-1 text-gray-400 hover:text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => console.log('Edit program', program.id)} className="p-1 text-gray-400 hover:text-green-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(program.status)}`}>
                    {t(program.status)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(program.category)}`}>
                    {program.category}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{t('instructor')}: {program.instructor}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{t('enrollmentProgress')}</span>
                    <span>{t('enrollmentFraction', { enrolled: program.enrolled, capacity: program.capacity, percent: progress })}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <button onClick={() => console.log('Action for program', program.id)} className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                    {program.status === 'upcoming' ? t('enrollEmployees') : 
                     program.status === 'ongoing' ? t('viewProgress') : t('viewResults')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-6">{t('createTrainingProgram')}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" name="title" value={newTrainingData.title} onChange={handleInputChange} placeholder={t('programTitle')} className="w-full px-4 py-2 border rounded-lg" required />
              <textarea name="description" value={newTrainingData.description} onChange={handleInputChange} placeholder={t('description')} rows={3} className="w-full px-4 py-2 border rounded-lg" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="instructor" value={newTrainingData.instructor} onChange={handleInputChange} placeholder={t('instructor')} className="w-full px-4 py-2 border rounded-lg" required />
                <input type="number" name="capacity" value={newTrainingData.capacity} onChange={handleInputChange} placeholder={t('capacity')} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('dateRange')}</label>
                <DatePicker
                  selectsRange
                  startDate={newTrainingData.startDate}
                  endDate={newTrainingData.endDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                <select name="category" value={newTrainingData.category} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required>
                  <option value="Technical">Technical</option>
                  <option value="Safety">Safety</option>
                  <option value="Management">Management</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('createProgram')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingManagement;
