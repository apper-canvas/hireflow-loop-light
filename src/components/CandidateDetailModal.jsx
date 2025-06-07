import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import EmailComposer from './EmailComposer';
import candidateService from '../services/api/candidateService';
import interviewService from '../services/api/interviewService';
import emailService from '../services/api/emailService';
import { format } from 'date-fns';
const CandidateDetailModal = ({ candidate, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [interviews, setInterviews] = useState([]);
  const [emails, setEmails] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
useEffect(() => {
    loadInterviews();
    loadEmails();
  }, [candidate.id]);
const loadInterviews = async () => {
    try {
      const allInterviews = await interviewService.getAll();
      const candidateInterviews = allInterviews.filter(i => i.candidateId === candidate.id);
      setInterviews(candidateInterviews);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    }
  };

  const loadEmails = async () => {
    try {
      const emailHistory = await emailService.getEmailHistory(candidate.id);
      setEmails(emailHistory);
    } catch (error) {
      console.error('Failed to load email history:', error);
    }
  };
const handleAddNote = async () => {
    if (!notes.trim()) return;

    setLoading(true);
    try {
      const updatedCandidate = await candidateService.update(candidate.id, {
        ...candidate,
        notes: [...(candidate.notes || []), {
          id: Date.now().toString(),
          content: notes,
          timestamp: new Date().toISOString(),
          author: 'Current User'
        }]
      });
      
      setNotes('');
      toast.success('Note added successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSent = () => {
    loadEmails();
    onUpdate();
  };
const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'assessments', label: 'Assessments', icon: 'FileText' },
    { id: 'interviews', label: 'Interviews', icon: 'Calendar' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'notes', label: 'Notes', icon: 'MessageSquare' }
];

  return (
    <>
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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
{/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={24} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.email}</p>
              <p className="text-sm text-gray-500">{candidate.position}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEmailComposer(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ApperIcon name="Mail" size={16} />
              <span>Send Email</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Mail" size={16} className="text-gray-400" />
                        <span className="text-sm">{candidate.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Phone" size={16} className="text-gray-400" />
                        <span className="text-sm">{candidate.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Details</label>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
                        <span className="text-sm">{candidate.position}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                        <span className="text-sm">Applied {format(new Date(candidate.appliedDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Tag" size={16} className="text-gray-400" />
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          candidate.stage === 'Hired' ? 'bg-green-100 text-green-700' :
                          candidate.stage === 'Offer' ? 'bg-blue-100 text-blue-700' :
                          candidate.stage === 'Interview' ? 'bg-purple-100 text-purple-700' :
                          candidate.stage === 'Screening' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {candidate.stage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {candidate.resumeUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="FileText" size={16} className="text-gray-400" />
                        <a 
                          href={candidate.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'assessments' && (
              <motion.div
                key="assessments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {candidate.assessmentScores && candidate.assessmentScores.length > 0 ? (
                  candidate.assessmentScores.map((score, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Assessment {index + 1}</h3>
                        <span className={`text-lg font-bold ${score >= 70 ? 'text-green-600' : score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="FileText" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No assessments completed</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'interviews' && (
              <motion.div
                key="interviews"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {interviews.length > 0 ? (
                  interviews.map(interview => (
                    <div key={interview.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{interview.type || 'Interview'}</h3>
                        <span className="text-sm text-gray-500">
                          {format(new Date(interview.scheduledTime), 'MMM dd, yyyy h:mm a')}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="MapPin" size={14} />
                          <span>{interview.location || 'Location TBD'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Clock" size={14} />
                          <span>{interview.duration} minutes</span>
                        </div>
                        {interview.interviewers?.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Users" size={14} />
                            <span>{interview.interviewers.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      {interview.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          {interview.notes}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No interviews scheduled</p>
                  </div>
                )}
              </motion.div>
)}

            {activeTab === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
                  <button
                    onClick={() => setShowEmailComposer(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ApperIcon name="Plus" size={16} />
                    <span>Compose Email</span>
                  </button>
                </div>

                {emails.length > 0 ? (
                  <div className="space-y-3">
                    {emails.map(email => (
                      <div key={email.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">{email.subject}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {format(new Date(email.sentAt), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Mail" size={14} />
                            <span>To: {email.to}</span>
                          </div>
                          {email.cc && (
                            <div className="flex items-center space-x-2">
                              <ApperIcon name="Copy" size={14} />
                              <span>CC: {email.cc}</span>
                            </div>
                          )}
                          {email.attachments && email.attachments.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <ApperIcon name="Paperclip" size={14} />
                              <span>{email.attachments.length} attachment(s)</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <div 
                            dangerouslySetInnerHTML={{ __html: email.content.length > 200 ? 
                              email.content.substring(0, 200) + '...' : email.content 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Mail" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No emails sent yet</p>
                    <button
                      onClick={() => setShowEmailComposer(true)}
                      className="mt-2 text-primary hover:underline"
                    >
                      Send your first email
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Add Note */}
                <div className="space-y-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note about this candidate..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!notes.trim() || loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      <ApperIcon name="Plus" size={16} />
                    )}
                    <span>Add Note</span>
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  {candidate.notes && candidate.notes.length > 0 ? (
                    candidate.notes.map(note => (
                      <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{note.author}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(note.timestamp), 'MMM dd, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageSquare" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No notes added yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
</div>
      </motion.div>
    </motion.div>

    {/* Email Composer Modal */}
    <AnimatePresence>
      {showEmailComposer && (
        <EmailComposer
          candidate={candidate}
          onClose={() => setShowEmailComposer(false)}
          onSent={handleEmailSent}
        />
      )}
    </AnimatePresence>
    </>
  );
};

export default CandidateDetailModal;