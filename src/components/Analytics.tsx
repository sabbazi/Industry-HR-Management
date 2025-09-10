import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList, LineChart, Line } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { mockEmployees, mockCandidates } from '../data/mockData';
import { useTheme } from '../contexts/ThemeContext';

const Analytics: React.FC = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const tickColor = isDark ? '#94a3b8' : '#64748b';

    const departmentData = mockEmployees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const departmentChartData = Object.keys(departmentData).map(key => ({
        name: t(key),
        count: departmentData[key],
    }));

    const genderData = mockEmployees.reduce((acc, emp) => {
        acc[emp.gender] = (acc[emp.gender] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const genderChartData = [
        { name: t('male'), value: genderData['male'] || 0, color: '#3b82f6' },
        { name: t('female'), value: genderData['female'] || 0, color: '#ec4899' },
    ];

    const ageData = mockEmployees.reduce((acc, emp) => {
        const age = new Date().getFullYear() - new Date(emp.dateOfBirth).getFullYear();
        if (age < 25) acc['<25']++;
        else if (age <= 34) acc['25-34']++;
        else if (age <= 44) acc['35-44']++;
        else if (age <= 54) acc['45-54']++;
        else acc['55+']++;
        return acc;
    }, { '<25': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 });

    const ageChartData = Object.keys(ageData).map(key => ({ name: key, count: ageData[key as keyof typeof ageData] }));

    const salaryData = [
        { range: '<$40k', count: mockEmployees.filter(e => e.salary < 40000).length },
        { range: '$40k-$60k', count: mockEmployees.filter(e => e.salary >= 40000 && e.salary < 60000).length },
        { range: '$60k-$80k', count: mockEmployees.filter(e => e.salary >= 60000 && e.salary < 80000).length },
        { range: '$80k-$100k', count: mockEmployees.filter(e => e.salary >= 80000 && e.salary < 100000).length },
        { range: '>$100k', count: mockEmployees.filter(e => e.salary >= 100000).length },
    ];

    const recruitmentFunnelData = [
        { value: mockCandidates.length, name: t('applied'), fill: '#8884d8' },
        { value: mockCandidates.filter(c => ['screening', 'interview', 'offer', 'hired'].includes(c.status)).length, name: t('screening'), fill: '#83a6ed' },
        { value: mockCandidates.filter(c => ['interview', 'offer', 'hired'].includes(c.status)).length, name: t('interview'), fill: '#8dd1e1' },
        { value: mockCandidates.filter(c => ['offer', 'hired'].includes(c.status)).length, name: t('offer'), fill: '#82ca9d' },
        { value: mockCandidates.filter(c => c.status === 'hired').length, name: t('hired'), fill: '#a4de6c' },
    ];

    const turnoverData = [
        { month: 'Jan', voluntary: 2, involuntary: 1 },
        { month: 'Feb', voluntary: 3, involuntary: 0 },
        { month: 'Mar', voluntary: 1, involuntary: 2 },
        { month: 'Apr', voluntary: 4, involuntary: 1 },
        { month: 'May', voluntary: 2, involuntary: 1 },
        { month: 'Jun', voluntary: 3, involuntary: 2 },
    ];

    const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">{title}</h3>
            <div style={{ width: '100%', height: 300 }}>
                {children}
            </div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('analyticsAndReporting')}</h1>
                    <p className="text-gray-600 dark:text-slate-400 mt-1">{t('deepDive')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title={t('headcountOverview')}>
                    <ResponsiveContainer>
                        <BarChart data={departmentChartData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
                            <XAxis type="number" stroke={tickColor} />
                            <YAxis type="category" dataKey="name" width={80} stroke={tickColor} />
                            <Tooltip cursor={{ fill: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.3)' }} contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }} />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title={t('genderDistribution')}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={genderChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name">
                                {genderChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title={t('ageDistribution')}>
                    <ResponsiveContainer>
                        <BarChart data={ageChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
                            <XAxis dataKey="name" stroke={tickColor} />
                            <YAxis stroke={tickColor} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }} />
                            <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title={t('salaryDistribution')}>
                    <ResponsiveContainer>
                        <BarChart data={salaryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
                            <XAxis dataKey="range" stroke={tickColor} />
                            <YAxis stroke={tickColor} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }} />
                            <Bar dataKey="count" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title={t('recruitmentFunnel')}>
                    <ResponsiveContainer>
                        <FunnelChart>
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }} />
                            <Funnel dataKey="value" data={recruitmentFunnelData} isAnimationActive>
                                <LabelList position="right" fill={tickColor} stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title={t('turnoverRateOverTime')}>
                    <ResponsiveContainer>
                        <LineChart data={turnoverData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
                            <XAxis dataKey="month" stroke={tickColor} />
                            <YAxis stroke={tickColor} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}` }} />
                            <Legend wrapperStyle={{ color: tickColor }} />
                            <Line type="monotone" dataKey="voluntary" stroke="#ef4444" name="Voluntary" />
                            <Line type="monotone" dataKey="involuntary" stroke="#f97316" name="Involuntary" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default Analytics;
