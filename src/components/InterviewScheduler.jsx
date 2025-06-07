import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import interviewService from '../services/api/interviewService';
import { format, addDays, startOfDay } from 'date-fns';

const InterviewScheduler = ({ candidates, onClose, onScheduled }) => {
  const [formData, setFormData] = useState({
    candidateId: '',
    scheduledTime: '',
    duration: 60,
    type: 'Phone',
    location: '',
    interviewers: [''],
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const interviewTypes = [
    { value: 'Phone', label: 'Phone Interview' },
    { value: 'Video', label: 'Video Call' },
    { value: 'In-Person', label: 'In-Person' },
    { value: 'Technical', label: 'Technical Interview' },
    { value: 'Panel', label: 'Panel Interview' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const handleSchedule = async () => {
    if (!formData.candidateId || !formData.scheduledTime) {
      toast.error('Please select a candidate and time');
      return;
    }

    setLoading(true);
    try {
      await interviewService.create({
        ...formData,
        interviewers: formData.interviewers.filter(i => i.trim()),
        scheduledTime: new Date(formData.scheduledTime).toISOString()
      });
      
      toast.success('Interview scheduled successfully');
      onScheduled();
    } catch (error) {
      toast.error('Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const addInterviewer = () => {
    setFormData(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, '']
    }));
  };

  const updateInterviewer = (index, value) => {
    setFormData(prev => ({
      ...prev,
      interviewers: prev.interviewers.map((interviewer, i) => 
        i === index ? value : interviewer
      )
    }));
  };

  const removeInterviewer = (index) => {
    if (formData.interviewers.length > 1) {
      setFormData(prev => ({
        ...prev,
        interviewers: prev.interviewers.filter((_, i) => i !== index)
      }));
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Exclude weekends
        dates.push(date);
      }
    }
    return dates;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Schedule Interview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Candidate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Candidate *
              </label>
              <select
                value={formData.candidateId}
                onChange={(e) => setFormData(prev => ({ ...prev, candidateId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Choose a candidate...</option>
                {candidates.map(candidate => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} - {candidate.position}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <select
                  value={formData.scheduledTime.split('T')[0] || ''}
                  onChange={(e) => {
                    const time = formData.scheduledTime.split('T')[1] || '09:00';
                    setFormData(prev => ({ 
                      ...prev, 
                      scheduledTime: e.target.value ? `${e.target.value}T${time}` : ''
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select date...</option>
                  {getAvailableDates().map(date => (
                    <option key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                      {format(date, 'EEEE, MMM dd, yyyy')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <select
                  value={formData.scheduledTime.split('T')[1] || ''}
                  onChange={(e) => {
                    const date = formData.scheduledTime.split('T')[0] || format(addDays(new Date(), 1), 'yyyy-MM-dd');
                    setFormData(prev => ({ 
                      ...prev, 
                      scheduledTime: `${date}T${e.target.value}`
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Select time...</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interview Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interview Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {interviewTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="15"
                  max="180"
                  step="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location / Meeting Link
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder={
                  formData.type === 'Video' ? 'Zoom/Teams meeting link' :
                  formData.type === 'Phone' ? 'Phone number' :
                  formData.type === 'In-Person' ? 'Office address or room number' :
                  'Meeting location or link'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Interviewers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Interviewers
                </label>
                <button
                  type="button"
                  onClick={addInterviewer}
                  className="flex items-center space-x-1 text-sm text-primary hover:text-blue-700"
                >
                  <ApperIcon name="Plus" size={14} />
                  <span>Add Interviewer</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.interviewers.map((interviewer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={interviewer}
                      onChange={(e) => updateInterviewer(index, e.target.value)}
                      placeholder="Interviewer name or email"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    {formData.interviewers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInterviewer(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes or preparation instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSchedule}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="Calendar" size={16} />
            )}
            <span>{loading ? 'Scheduling...' : 'Schedule Interview'}</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InterviewScheduler;