import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Select from '@/components/atoms/Select';

const stageColors = {
    Applied: 'bg-gray-100 text-gray-700',
    Screening: 'bg-blue-100 text-blue-700',
    Interview: 'bg-purple-100 text-purple-700',
    Offer: 'bg-green-100 text-green-700',
    Hired: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700', // Added for Rejected stage
};

const CandidateCard = ({ candidate, onStageChange, index }) => {
    const avgScore = candidate.assessmentScores?.length > 0
        ? Math.round(candidate.assessmentScores.reduce((a, b) => a + b, 0) / candidate.assessmentScores.length)
        : null;

    return (
        <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, translateY: -1 }}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>{candidate.position}</span>
                            <span>•</span>
                            <span>Applied {format(new Date(candidate.appliedDate), 'MMM dd')}</span>
                            {avgScore !== null && (
                                <>
                                    <span>•</span>
                                    <span className="text-accent font-medium">
                                        Score: {avgScore}%
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[candidate.stage] || 'bg-red-100 text-red-700'}`}>
                        {candidate.stage}
                    </div>
                    
                    <Select
                        value={candidate.stage}
                        onChange={(e) => onStageChange(candidate.id, e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                    </Select>
                </div>
            </div>
        </motion.div>
    );
};

export default CandidateCard;