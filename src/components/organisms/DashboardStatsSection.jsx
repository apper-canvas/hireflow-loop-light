import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const DashboardStatsSection = ({ stats, onNavigate, loading }) => {
    const statCardsData = [
        {
            title: 'Total Candidates',
            value: stats.totalCandidates,
            icon: 'Users',
            color: 'bg-primary',
            textColor: 'text-white',
            action: () => onNavigate('/pipeline')
        },
        {
            title: 'Open Positions',
            value: stats.openPositions,
            icon: 'Briefcase',
            color: 'bg-secondary',
            textColor: 'text-white',
            action: () => onNavigate('/pipeline')
        },
        {
            title: "Today's Interviews",
            value: stats.scheduledInterviews,
            icon: 'Calendar',
            color: 'bg-accent',
            textColor: 'text-white',
            action: () => onNavigate('/interviews')
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingReviews,
            icon: 'Clock',
            color: 'bg-orange-500',
            textColor: 'text-white',
            action: () => onNavigate('/pipeline')
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCardsData.map((stat, index) => (
                <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    textColor={stat.textColor}
                    onClick={stat.action}
                    index={index}
                />
            ))}
        </div>
    );
};

export default DashboardStatsSection;