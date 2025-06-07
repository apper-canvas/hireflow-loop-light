import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { subDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import 'react-datepicker/dist/react-datepicker.css';

const FilterBar = ({ candidates, onFilterChange, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    stages: [],
    positions: [],
    dateRange: 'all',
    customStartDate: null,
    customEndDate: null
  });
  
  const [filteredCount, setFilteredCount] = useState(candidates.length);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('pipelineFilters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters({
          ...parsed,
          customStartDate: parsed.customStartDate ? new Date(parsed.customStartDate) : null,
          customEndDate: parsed.customEndDate ? new Date(parsed.customEndDate) : null
        });
        setIsExpanded(Object.values(parsed).some(val => 
          Array.isArray(val) ? val.length > 0 : val && val !== 'all'
        ));
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pipelineFilters', JSON.stringify({
      ...filters,
      customStartDate: filters.customStartDate?.toISOString(),
      customEndDate: filters.customEndDate?.toISOString()
    }));
  }, [filters]);

  // Apply filters whenever filters or candidates change
  useEffect(() => {
    const filtered = applyFilters(candidates, filters);
    setFilteredCount(filtered.length);
    onFilterChange(filtered);
  }, [candidates, filters, onFilterChange]);

  const applyFilters = (candidateList, currentFilters) => {
    return candidateList.filter(candidate => {
      // Stage filter
      if (currentFilters.stages.length > 0 && !currentFilters.stages.includes(candidate.stage)) {
        return false;
      }

      // Position filter
      if (currentFilters.positions.length > 0 && !currentFilters.positions.includes(candidate.position)) {
        return false;
      }

      // Date range filter
      if (currentFilters.dateRange !== 'all') {
        const candidateDate = new Date(candidate.appliedDate);
        const now = new Date();

        switch (currentFilters.dateRange) {
          case 'last7':
            if (isBefore(candidateDate, subDays(now, 7))) return false;
            break;
          case 'last30':
            if (isBefore(candidateDate, subDays(now, 30))) return false;
            break;
          case 'last90':
            if (isBefore(candidateDate, subDays(now, 90))) return false;
            break;
          case 'custom':
            if (currentFilters.customStartDate && isBefore(candidateDate, startOfDay(currentFilters.customStartDate))) {
              return false;
            }
            if (currentFilters.customEndDate && isAfter(candidateDate, endOfDay(currentFilters.customEndDate))) {
              return false;
            }
            break;
        }
      }

      return true;
    });
  };

  const handleStageFilter = (stage) => {
    setFilters(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage]
    }));
  };

  const handlePositionFilter = (position) => {
    setFilters(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  };

  const handleDateRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range,
      customStartDate: range !== 'custom' ? null : prev.customStartDate,
      customEndDate: range !== 'custom' ? null : prev.customEndDate
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      stages: [],
      positions: [],
      dateRange: 'all',
      customStartDate: null,
      customEndDate: null
    };
    setFilters(clearedFilters);
    setIsExpanded(false);
  };

  const hasActiveFilters = () => {
    return filters.stages.length > 0 || 
           filters.positions.length > 0 || 
           filters.dateRange !== 'all';
  };

  // Get unique stages and positions from candidates
  const availableStages = [...new Set(candidates.map(c => c.stage))];
  const availablePositions = [...new Set(candidates.map(c => c.position))];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Filter Toggle Bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            aria-label="Toggle filters"
            aria-expanded={isExpanded}
          >
            <ApperIcon name="Filter" size={16} />
            <span>Filters</span>
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="transition-transform duration-200"
            />
          </Button>
          
          {hasActiveFilters() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <span className="text-sm text-gray-600">
                {filteredCount} of {candidates.length} candidates
              </span>
              <Button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-blue-700 underline"
                aria-label="Clear all filters"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </div>

        {!isExpanded && hasActiveFilters() && (
          <div className="flex items-center space-x-2">
            {filters.stages.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {filters.stages.length} stage{filters.stages.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.positions.length > 0 && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {filters.positions.length} position{filters.positions.length > 1 ? 's' : ''}
              </span>
            )}
            {filters.dateRange !== 'all' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                {filters.dateRange === 'custom' ? 'Custom dates' : filters.dateRange.replace('last', 'Last ')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Filter Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Stage Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filter by Stage
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableStages.map(stage => (
                    <Button
                      key={stage}
                      onClick={() => handleStageFilter(stage)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.stages.includes(stage)
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                      aria-pressed={filters.stages.includes(stage)}
                    >
                      {stage}
                      {filters.stages.includes(stage) && (
                        <ApperIcon name="Check" size={14} className="ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Position Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filter by Position
                </label>
                <div className="flex flex-wrap gap-2">
                  {availablePositions.map(position => (
                    <Button
                      key={position}
                      onClick={() => handlePositionFilter(position)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.positions.includes(position)
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                      aria-pressed={filters.positions.includes(position)}
                    >
                      {position}
                      {filters.positions.includes(position) && (
                        <ApperIcon name="Check" size={14} className="ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Filter by Application Date
                </label>
                <div className="space-y-3">
                  <Select
                    value={filters.dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Select date range"
                  >
                    <option value="all">All time</option>
                    <option value="last7">Last 7 days</option>
                    <option value="last30">Last 30 days</option>
                    <option value="last90">Last 90 days</option>
                    <option value="custom">Custom range</option>
                  </Select>

                  {filters.dateRange === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">From</label>
                        <DatePicker
                          selected={filters.customStartDate}
                          onChange={(date) => setFilters(prev => ({ ...prev, customStartDate: date }))}
                          selectsStart
                          startDate={filters.customStartDate}
                          endDate={filters.customEndDate}
                          maxDate={new Date()}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholderText="Select start date"
                          aria-label="Custom start date"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">To</label>
                        <DatePicker
                          selected={filters.customEndDate}
                          onChange={(date) => setFilters(prev => ({ ...prev, customEndDate: date }))}
                          selectsEnd
                          startDate={filters.customStartDate}
                          endDate={filters.customEndDate}
                          minDate={filters.customStartDate}
                          maxDate={new Date()}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholderText="Select end date"
                          aria-label="Custom end date"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Showing {filteredCount} of {candidates.length} candidates
                </span>
                <div className="flex space-x-3">
                  <Button
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;