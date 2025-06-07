import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import InterviewScheduler from '../components/InterviewScheduler';
import interviewService from '../services/api/interviewService';
import candidateService from '../services/api/candidateService';
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedView, setSelectedView] = useState('upcoming'); // upcoming, today, calendar

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [interviewData, candidateData] = await Promise.all([
        interviewService.getAll(),
        candidateService.getAll()
      ]);
      setInterviews(interviewData);
      setCandidates(candidateData);
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getCandidateById = (candidateId) => {
    return candidates.find(c => c.id === candidateId);
  };

  const getFilteredInterviews = () => {
    const now = new Date();
    const sorted = interviews
      .map(interview => ({
        ...interview,
        candidate: getCandidateById(interview.candidateId),
        scheduledTime: parseISO(interview.scheduledTime)
      }))
      .sort((a, b) => a.scheduledTime - b.scheduledTime);

    switch (selectedView) {
      case 'today':
        return sorted.filter(interview => isToday(interview.scheduledTime));
      case 'upcoming':
        return sorted.filter(interview => interview.scheduledTime >= now);
      default:
        return sorted;
    }
  };

  const getTimeCategory = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return 'This Week';
    return 'Later';
  };

  const groupedInterviews = getFilteredInterviews().reduce((groups, interview) => {
    const category = getTimeCategory(interview.scheduledTime);
    if (!groups[category]) groups[category] = [];
    groups[category].push(interview);
    return groups;
  }, {});

  const handleReschedule = async (interviewId) => {
    // Implementation for rescheduling
    toast.info('Reschedule functionality coming soon');
  };

  const handleCancel = async (interviewId) => {
    if (!confirm('Are you sure you want to cancel this interview?')) return;

    try {
      await interviewService.delete(interviewId);
      setInterviews(prev => prev.filter(i => i.id !== interviewId));
      toast.success('Interview cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel interview');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Interviews</h3>
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

  if (interviews.length === 0 && !showScheduler) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowScheduler(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ApperIcon name="CalendarPlus" size={20} />
            <span>Schedule Interview</span>
          </motion.button>
        </div>
        
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No interviews scheduled</h3>
          <p className="mt-2 text-gray-500">Schedule your first candidate interview</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScheduler(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Schedule Interview
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600">Manage and track candidate interviews</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowScheduler(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ApperIcon name="CalendarPlus" size={20} />
          <span>Schedule Interview</span>
        </motion.button>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {[
          { id: 'upcoming', label: 'Upcoming', icon: 'Clock' },
          { id: 'today', label: 'Today', icon: 'Calendar' },
          { id: 'all', label: 'All', icon: 'List' }
        ].map(view => (
          <motion.button
            key={view.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedView === view.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name={view.icon} size={16} />
            <span>{view.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Interviews List */}
      <div className="space-y-6">
        {Object.entries(groupedInterviews).map(([category, categoryInterviews]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {categoryInterviews.map((interview, index) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, translateY: -1 }}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {interview.candidate?.name || 'Unknown Candidate'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {interview.candidate?.position || 'No position specified'}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Clock" size={14} />
                              <span>{format(interview.scheduledTime, 'h:mm a')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Calendar" size={14} />
                              <span>{format(interview.scheduledTime, 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="MapPin" size={14} />
                              <span>{interview.location || interview.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {interview.interviewers?.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Interviewers:</span>
                            <span className="ml-1">{interview.interviewers.join(', ')}</span>
                          </div>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReschedule(interview.id)}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                          title="Reschedule"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCancel(interview.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Cancel"
                        >
                          <ApperIcon name="X" size={16} />
                        </motion.button>
                      </div>
                    </div>

                    {interview.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{interview.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedInterviews).length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No interviews found</h3>
          <p className="text-gray-500">No interviews match your current filter</p>
        </div>
      )}

      <AnimatePresence>
        {showScheduler && (
          <InterviewScheduler
            candidates={candidates}
            onClose={() => setShowScheduler(false)}
            onScheduled={() => {
              setShowScheduler(false);
              loadData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interviews;