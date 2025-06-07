import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import candidateService from '@/services/api/candidateService';
import StageFilterButton from '@/components/molecules/StageFilterButton';
import CandidateCard from '@/components/molecules/CandidateCard';
import Button from '@/components/atoms/Button';

const CandidatePipeline = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('all');

  const stages = [
    { id: 'all', label: 'All Candidates', color: 'bg-gray-500' },
    { id: 'Applied', label: 'Applied', color: 'bg-blue-500' },
    { id: 'Screening', label: 'Screening', color: 'bg-purple-500' },
    { id: 'Interview', label: 'Interview', color: 'bg-orange-500' },
    { id: 'Offer', label: 'Offer', color: 'bg-green-500' },
    { id: 'Hired', label: 'Hired', color: 'bg-emerald-500' }
  ];

  const loadCandidates = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const getFilteredCandidates = () => {
    if (selectedStage === 'all') return candidates;
    return candidates.filter(candidate => candidate.stage === selectedStage);
  };

  const handleStageChange = async (candidateId, newStage) => {
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      const updatedCandidate = await candidateService.update(candidateId, {
        ...candidate,
        stage: newStage
      });
      
      setCandidates(prev => 
        prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c)
      );
      
      toast.success(`Candidate moved to ${newStage}`);
    } catch (error) {
      toast.error('Failed to update candidate stage');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex space-x-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>
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
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Candidates</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={loadCandidates}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const filteredCandidates = getFilteredCandidates();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidate Pipeline</h2>
        
        {/* Stage Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {stages.map(stage => (
            <StageFilterButton
              key={stage.id}
              label={stage.label}
              count={stage.id === 'all' ? candidates.length : candidates.filter(c => c.stage === stage.id).length}
              isSelected={selectedStage === stage.id}
              onClick={() => setSelectedStage(stage.id)}
              color={stage.color}
            />
          ))}
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredCandidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onStageChange={handleStageChange}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No candidates found</h3>
          <p className="text-gray-500">
            {selectedStage === 'all' 
              ? 'No candidates in the system yet' 
              : `No candidates in ${selectedStage} stage`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidatePipeline;