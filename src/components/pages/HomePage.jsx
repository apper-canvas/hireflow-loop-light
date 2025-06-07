import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import candidateService from '@/services/api/candidateService';
import interviewService from '@/services/api/interviewService';
import positionService from '@/services/api/positionService';
import DashboardStatsSection from '@/components/organisms/DashboardStatsSection';
import QuickActionsOverview from '@/components/organisms/QuickActionsOverview';

const HomePage = () => {
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

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <DashboardStatsSection stats={stats} onNavigate={navigate} loading={loading} />

        {/* Quick Actions */}
        <QuickActionsOverview onNavigate={navigate} loading={loading} />
      </motion.div>
    </div>
  );
};

export default HomePage;