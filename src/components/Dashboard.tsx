import React from 'react';
import { 
  Users, UserPlus, Calendar, BookOpen, TrendingUp, 
  DollarSign, Award, Clock 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { 
      title: t('totalEmployees'), 
      value: '1,247', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      title: t('activeRecruitment'), 
      value: '23', 
      change: '+3%', 
      icon: UserPlus, 
      color: 'bg-green-500' 
    },
    { 
      title: t('pendingLeave'), 
      value: '8', 
      change: '-2%', 
      icon: Calendar, 
      color: 'bg-yellow-500' 
    },
    { 
      title: t('upcomingTraining'), 
      value: '15', 
      change: '+5%', 
      icon: BookOpen, 
      color: 'bg-purple-500' 
    },
  ];

  const additionalStats = [
    { title: t('newHires'), value: '34', icon: TrendingUp },
    { title: t('turnoverRate'), value: '3.2%', icon: Users },
    { title: t('averageSalary'), value: '$68,500', icon: DollarSign },
    { title: t('satisfactionScore'), value: '4.2/5', icon: Award },
  ];

  const employeeTrendData = [
    { month: 'Jan', employees: 1180, newHires: 25, turnover: 18 },
    { month: 'Feb', employees: 1195, newHires: 30, turnover: 15 },
    { month: 'Mar', employees: 1210, newHires: 28, turnover: 13 },
    { month: 'Apr', employees: 1225, newHires: 32, turnover: 17 },
    { month: 'May', employees: 1240, newHires: 35, turnover: 20 },
    { month: 'Jun', employees: 1247, newHires: 34, turnover: 27 },
  ];

  const departmentData = [
    { name: t('manufacturing'), employees: 450, color: '#3B82F6' },
    { name: t('engineering'), employees: 280, color: '#10B981' },
    { name: t('quality'), employees: 180, color: '#F59E0B' },
    { name: t('maintenance'), employees: 150, color: '#EF4444' },
    { name: t('logistics'), employees: 120, color: '#8B5CF6' },
    { name: 'Others', employees: 67, color: '#6B7280' },
  ];

  const leaveData = [
    { type: t('annualLeave'), count: 45, color: '#3B82F6' },
    { type: t('sickLeave'), count: 23, color: '#EF4444' },
    { type: t('personalLeave'), count: 12, color: '#F59E0B' },
    { type: t('emergencyLeave'), count: 8, color: '#8B5CF6' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 5) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const recentActivitiesData = [
    { action: t('newEmployeeOnboarded'), employee: 'John Smith', time: t('twoHoursAgo'), type: 'new' },
    { action: t('performanceReviewCompleted'), employee: 'Sarah Wilson', time: t('fourHoursAgo'), type: 'review' },
    { action: t('leaveRequestApproved'), employee: 'Mike Johnson', time: t('sixHoursAgo'), type: 'leave' },
    { action: t('trainingSessionCompleted'), employee: 'Lisa Brown', time: t('oneDayAgo'), type: 'training' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-2 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} {t('vsLastMonth')}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('employeeGrowthTrend')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={employeeTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="employees" stroke="#3B82F6" strokeWidth={2} name={t('totalEmployeesTooltip')} />
              <Line type="monotone" dataKey="newHires" stroke="#10B981" strokeWidth={2} name={t('newHiresTooltip')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('departmentDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="employees"
                nameKey="name"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value} ${t('employeesUnit')}`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities & Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('recentActivities')}</h3>
          <div className="space-y-4">
            {recentActivitiesData.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'new' ? 'bg-green-500' :
                  activity.type === 'review' ? 'bg-blue-500' :
                  activity.type === 'leave' ? 'bg-yellow-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.employee}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('leaveRequestsThisMonth')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leaveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
