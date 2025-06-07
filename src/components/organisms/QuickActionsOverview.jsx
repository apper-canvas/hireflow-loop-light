import React from 'react';
import QuickActionButton from '@/components/molecules/QuickActionButton';

const QuickActionsOverview = ({ onNavigate, loading }) => {
    const quickActionsData = [
        {
            title: 'View Pipeline',
            description: 'Manage candidates through hiring stages',
            icon: 'GitBranch',
            action: () => onNavigate('/pipeline'),
            color: 'bg-primary'
        },
        {
            title: 'Create Assessment',
            description: 'Build new evaluation forms',
            icon: 'Plus',
            action: () => onNavigate('/assessments'),
            color: 'bg-secondary'
        },
        {
            title: 'Schedule Interview',
            description: 'Book candidate interviews',
            icon: 'CalendarPlus',
            action: () => onNavigate('/interviews'),
            color: 'bg-accent'
        },
        {
            title: 'View Reports',
            description: 'Analyze hiring metrics',
            icon: 'BarChart3',
            action: () => onNavigate('/reports'),
            color: 'bg-orange-500'
        }
    ];

    if (loading) {
        return (
            <>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActionsData.map((action, index) => (
                    <QuickActionButton
                        key={action.title}
                        title={action.title}
                        description={action.description}
                        icon={action.icon}
                        color={action.color}
                        onClick={action.action}
                        index={index}
                    />
                ))}
            </div>
        </>
    );
};

export default QuickActionsOverview;