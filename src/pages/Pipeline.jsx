import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import CandidateDetailModal from '@/components/organisms/CandidateDetailModal';
import candidateService from '@/services/candidateService';

const Pipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [draggedCandidate, setDraggedCandidate] = useState(null);

  const stages = [
    { id: 'Applied', title: 'Applied', color: 'bg-gray-100', count: 0 },
    { id: 'Screening', title: 'Screening', color: 'bg-blue-100', count: 0 },
    { id: 'Interview', title: 'Interview', color: 'bg-purple-100', count: 0 },
    { id: 'Offer', title: 'Offer', color: 'bg-green-100', count: 0 },
    { id: 'Hired', title: 'Hired', color: 'bg-emerald-100', count: 0 },
    { id: 'Rejected', title: 'Rejected', color: 'bg-red-100', count: 0 }
  ];

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await candidateService.getAll();
      setCandidates(data);
    } catch (err) {
      setError(err.message || 'Failed to load candidates');
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const getCandidatesByStage = (stage) => {
    return candidates.filter(candidate => candidate.stage === stage);
  };

  const handleDragStart = (candidate) => {
    setDraggedCandidate(candidate);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedCandidate || draggedCandidate.stage === newStage) {
      setDraggedCandidate(null);
      return;
    }

    try {
      const updatedCandidate = await candidateService.update(draggedCandidate.id, {
        ...draggedCandidate,
        stage: newStage
      });
      
      setCandidates(prev => 
        prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c)
      );
      
      toast.success(`Candidate moved to ${newStage}`);
    } catch (error) {
      toast.error('Failed to update candidate stage');
    }
    
    setDraggedCandidate(null);
  };

  const getStageWithCounts = () => {
    return stages.map(stage => ({
      ...stage,
      count: getCandidatesByStage(stage.id).length
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex space-x-6 overflow-x-auto">
            {stages.map((_, index) => (
              <div key={index} className="flex-shrink-0 w-80">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Pipeline</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCandidates}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Candidate Pipeline</h1>
        <div className="text-center py-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No candidates yet</h3>
          <p className="mt-2 text-gray-500">Start by adding candidates to your pipeline</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Candidate
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Pipeline</h1>
        <p className="text-gray-600">Drag candidates between stages to update their status</p>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-6 min-w-max pb-4">
          {getStageWithCounts().map((stage) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 w-80"
            >
              <div 
                className={`${stage.color} rounded-lg p-4 min-h-96`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                  <span className="bg-white text-gray-600 px-2 py-1 rounded-full text-sm">
                    {stage.count}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <AnimatePresence>
                    {getCandidatesByStage(stage.id).map((candidate, index) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        draggable
                        onDragStart={() => handleDragStart(candidate)}
                        onClick={() => setSelectedCandidate(candidate)}
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" size={20} className="text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{candidate.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Position:</span>
                            <span className="font-medium text-gray-900">{candidate.position}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Applied:</span>
                            <span className="text-gray-900">
                              {format(new Date(candidate.appliedDate), 'MMM dd')}
                            </span>
                          </div>
                          {candidate.assessmentScores?.length > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Score:</span>
                              <span className="font-medium text-accent">
                                {Math.round(candidate.assessmentScores.reduce((a, b) => a + b, 0) / candidate.assessmentScores.length)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailModal
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            onUpdate={loadCandidates}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pipeline;