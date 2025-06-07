import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import candidateService from '../services/api/candidateService';
import interviewService from '../services/api/interviewService';
import positionService from '../services/api/positionService';
import { differenceInDays, format, subDays, parseISO } from 'date-fns';

const Reports = () => {
  const [data, setData] = useState({
    candidates: [],
    interviews: [],
    positions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [candidates, interviews, positions] = await Promise.all([
        candidateService.getAll(),
        interviewService.getAll(),
        positionService.getAll()
      ]);
      setData({ candidates, interviews, positions });
    } catch (err) {
      setError(err.message || 'Failed to load reports data');
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const daysAgo = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), daysAgo);
    
    return {
      candidates: data.candidates.filter(c => 
        new Date(c.appliedDate) >= cutoffDate
      ),
      interviews: data.interviews.filter(i => 
        new Date(i.scheduledTime) >= cutoffDate
      ),
      positions: data.positions
    };
  };

  const calculateMetrics = () => {
    const filtered = getFilteredData();
    const { candidates, interviews, positions } = filtered;

    // Pipeline metrics
    const pipelineStats = candidates.reduce((acc, candidate) => {
      acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
      return acc;
    }, {});

    // Time to hire calculation
    const hiredCandidates = candidates.filter(c => c.stage === 'Hired');
    const avgTimeToHire = hiredCandidates.length > 0 
      ? hiredCandidates.reduce((sum, candidate) => {
          return sum + differenceInDays(new Date(), new Date(candidate.appliedDate));
        }, 0) / hiredCandidates.length
      : 0;

    // Conversion rates
    const totalCandidates = candidates.length;
    const conversionRates = {
      'Applied to Screening': totalCandidates > 0 ? 
        ((pipelineStats.Screening || 0) + (pipelineStats.Interview || 0) + 
         (pipelineStats.Offer || 0) + (pipelineStats.Hired || 0)) / totalCandidates * 100 : 0,
      'Screening to Interview': (pipelineStats.Screening || 0) > 0 ? 
        ((pipelineStats.Interview || 0) + (pipelineStats.Offer || 0) + 
         (pipelineStats.Hired || 0)) / (pipelineStats.Screening || 1) * 100 : 0,
      'Interview to Offer': (pipelineStats.Interview || 0) > 0 ? 
        ((pipelineStats.Offer || 0) + (pipelineStats.Hired || 0)) / (pipelineStats.Interview || 1) * 100 : 0,
      'Offer to Hire': (pipelineStats.Offer || 0) > 0 ? 
        (pipelineStats.Hired || 0) / (pipelineStats.Offer || 1) * 100 : 0
    };

    // Interview metrics
    const interviewStats = {
      total: interviews.length,
      upcoming: interviews.filter(i => new Date(i.scheduledTime) > new Date()).length,
      completed: interviews.filter(i => new Date(i.scheduledTime) < new Date()).length
    };

    // Position metrics
    const positionStats = {
      total: positions.length,
      open: positions.filter(p => p.status === 'open').length,
      filled: positions.filter(p => p.status === 'filled').length
    };

    return {
      pipelineStats,
      avgTimeToHire: Math.round(avgTimeToHire),
      conversionRates,
      interviewStats,
      positionStats,
      totalCandidates
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reports</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: 'Total Candidates',
      value: metrics.totalCandidates,
      icon: 'Users',
      color: 'bg-primary',
      textColor: 'text-white'
    },
    {
      title: 'Avg. Time to Hire',
      value: `${metrics.avgTimeToHire} days`,
      icon: 'Clock',
      color: 'bg-secondary',
      textColor: 'text-white'
    },
    {
      title: 'Interviews Scheduled',
      value: metrics.interviewStats.total,
      icon: 'Calendar',
      color: 'bg-accent',
      textColor: 'text-white'
    },
    {
      title: 'Open Positions',
      value: metrics.positionStats.open,
      icon: 'Briefcase',
      color: 'bg-orange-500',
      textColor: 'text-white'
    }
  ];

  const pipelineData = [
    { stage: 'Applied', count: metrics.pipelineStats.Applied || 0, color: 'bg-gray-500' },
    { stage: 'Screening', count: metrics.pipelineStats.Screening || 0, color: 'bg-blue-500' },
    { stage: 'Interview', count: metrics.pipelineStats.Interview || 0, color: 'bg-purple-500' },
    { stage: 'Offer', count: metrics.pipelineStats.Offer || 0, color: 'bg-green-500' },
    { stage: 'Hired', count: metrics.pipelineStats.Hired || 0, color: 'bg-emerald-500' },
    { stage: 'Rejected', count: metrics.pipelineStats.Rejected || 0, color: 'bg-red-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track hiring performance and pipeline metrics</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${metric.color} ${metric.textColor} rounded-lg p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{metric.title}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <ApperIcon name={metric.icon} size={28} className="opacity-80" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Pipeline Overview</h2>
        <div className="space-y-4">
          {pipelineData.map((stage, index) => {
            const maxCount = Math.max(...pipelineData.map(s => s.count), 1);
            const percentage = (stage.count / maxCount) * 100;
            
            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="w-20 text-sm font-medium text-gray-700">
                  {stage.stage}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                    className={`h-full ${stage.color} rounded-full`}
                  />
                </div>
                <div className="w-12 text-sm font-semibold text-gray-900 text-right">
                  {stage.count}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Conversion Rates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Rates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(metrics.conversionRates).map(([stage, rate], index) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">{stage}</span>
              <span className="text-lg font-bold text-primary">{rate.toFixed(1)}%</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interview Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Interview Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metrics.interviewStats.total}</div>
            <div className="text-sm text-gray-600">Total Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{metrics.interviewStats.upcoming}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{metrics.interviewStats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </motion.div>

      {data.candidates.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="BarChart3" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No data available</h3>
          <p className="text-gray-500">Add candidates to see reports and analytics</p>
        </div>
      )}
    </div>
  );
};

export default Reports;