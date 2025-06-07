import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import candidateService from '../services/api/candidateService';
import interviewService from '../services/api/interviewService';
import positionService from '../services/api/positionService';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCandidates: 0,
    openPositions: 0,
    scheduledInterviews: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const [candidates, positions, interviews] = await Promise.all([
          candidateService.getAll(),
          positionService.getAll(),
          interviewService.getAll()
        ]);

        const today = new Date();
        const todayInterviews = interviews.filter(interview => {
          const interviewDate = new Date(interview.scheduledTime);
          return interviewDate.toDateString() === today.toDateString();
        });

        const pendingCandidates = candidates.filter(c => 
          c.stage === 'Applied' || c.stage === 'Screening'
        );

        setStats({
          totalCandidates: candidates.length,
          openPositions: positions.filter(p => p.status === 'open').length,
          scheduledInterviews: todayInterviews.length,
          pendingReviews: pendingCandidates.length
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Candidates',
      value: stats.totalCandidates,
      icon: 'Users',
      color: 'bg-primary',
      textColor: 'text-white',
      action: () => navigate('/pipeline')
    },
    {
      title: 'Open Positions',
      value: stats.openPositions,
      icon: 'Briefcase',
      color: 'bg-secondary',
      textColor: 'text-white',
      action: () => navigate('/pipeline')
    },
    {
      title: "Today's Interviews",
      value: stats.scheduledInterviews,
      icon: 'Calendar',
      color: 'bg-accent',
      textColor: 'text-white',
      action: () => navigate('/interviews')
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: 'Clock',
      color: 'bg-orange-500',
      textColor: 'text-white',
      action: () => navigate('/pipeline')
    }
  ];

  const quickActions = [
    {
      title: 'View Pipeline',
      description: 'Manage candidates through hiring stages',
      icon: 'GitBranch',
      action: () => navigate('/pipeline'),
      color: 'bg-primary'
    },
    {
      title: 'Create Assessment',
      description: 'Build new evaluation forms',
      icon: 'Plus',
      action: () => navigate('/assessments'),
      color: 'bg-secondary'
    },
    {
      title: 'Schedule Interview',
      description: 'Book candidate interviews',
      icon: 'CalendarPlus',
      action: () => navigate('/interviews'),
      color: 'bg-accent'
    },
    {
      title: 'View Reports',
      description: 'Analyze hiring metrics',
      icon: 'BarChart3',
      action: () => navigate('/reports'),
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, translateY: -2 }}
              onClick={stat.action}
              className={`${stat.color} ${stat.textColor} rounded-lg p-6 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <ApperIcon name={stat.icon} size={32} className="opacity-80" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`${action.color} text-white p-3 rounded-lg`}>
                  <ApperIcon name={action.icon} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;