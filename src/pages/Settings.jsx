import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailReminders: true,
      interviewAlerts: true,
      applicationUpdates: false,
      weeklyReports: true
    },
    hiring: {
      autoAdvanceStages: false,
      requireAssessment: true,
      defaultInterviewDuration: 60,
      assessmentTimeLimit: 30
    },
    system: {
      timezone: 'America/New_York',
      dateFormat: 'MM/dd/yyyy',
      theme: 'light'
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const settingSections = [
    {
      title: 'Notifications',
      description: 'Manage when and how you receive notifications',
      icon: 'Bell',
      settings: [
        {
          key: 'emailReminders',
          label: 'Email reminders for upcoming interviews',
          type: 'toggle',
          value: settings.notifications.emailReminders
        },
        {
          key: 'interviewAlerts',
          label: 'Push notifications for interview changes',
          type: 'toggle',
          value: settings.notifications.interviewAlerts
        },
        {
          key: 'applicationUpdates',
          label: 'Notifications for new applications',
          type: 'toggle',
          value: settings.notifications.applicationUpdates
        },
        {
          key: 'weeklyReports',
          label: 'Weekly hiring summary reports',
          type: 'toggle',
          value: settings.notifications.weeklyReports
        }
      ]
    },
    {
      title: 'Hiring Process',
      description: 'Configure default hiring workflow settings',
      icon: 'Settings',
      settings: [
        {
          key: 'autoAdvanceStages',
          label: 'Automatically advance candidates after completed interviews',
          type: 'toggle',
          value: settings.hiring.autoAdvanceStages
        },
        {
          key: 'requireAssessment',
          label: 'Require assessment completion before interviews',
          type: 'toggle',
          value: settings.hiring.requireAssessment
        },
        {
          key: 'defaultInterviewDuration',
          label: 'Default interview duration (minutes)',
          type: 'number',
          value: settings.hiring.defaultInterviewDuration,
          min: 15,
          max: 180,
          step: 15
        },
        {
          key: 'assessmentTimeLimit',
          label: 'Default assessment time limit (minutes)',
          type: 'number',
          value: settings.hiring.assessmentTimeLimit,
          min: 10,
          max: 120,
          step: 5
        }
      ]
    },
    {
      title: 'System Preferences',
      description: 'Customize your system display and format preferences',
      icon: 'Monitor',
      settings: [
        {
          key: 'timezone',
          label: 'Timezone',
          type: 'select',
          value: settings.system.timezone,
          options: [
            { value: 'America/New_York', label: 'Eastern Time (ET)' },
            { value: 'America/Chicago', label: 'Central Time (CT)' },
            { value: 'America/Denver', label: 'Mountain Time (MT)' },
            { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
            { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
          ]
        },
        {
          key: 'dateFormat',
          label: 'Date format',
          type: 'select',
          value: settings.system.dateFormat,
          options: [
            { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
            { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
            { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
            { value: 'MMM dd, yyyy', label: 'MMM DD, YYYY' }
          ]
        },
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          value: settings.system.theme,
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (follow system)' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your hiring workflow preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <ApperIcon name="Loader2" size={20} className="animate-spin" />
          ) : (
            <ApperIcon name="Save" size={20} />
          )}
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </motion.button>
      </div>

      <div className="space-y-8">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary text-white rounded-lg">
                <ApperIcon name={section.icon} size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting, settingIndex) => (
                <motion.div
                  key={setting.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (settingIndex * 0.05) }}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900">
                      {setting.label}
                    </label>
                  </div>

                  <div className="flex-shrink-0">
                    {setting.type === 'toggle' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateSetting(
                          settingSections[sectionIndex].title.toLowerCase().replace(' ', ''),
                          setting.key,
                          !setting.value
                        )}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          setting.value ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </motion.button>
                    )}

                    {setting.type === 'number' && (
                      <input
                        type="number"
                        value={setting.value}
                        onChange={(e) => updateSetting(
                          settingSections[sectionIndex].title.toLowerCase().replace(' ', ''),
                          setting.key,
                          parseInt(e.target.value)
                        )}
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                        className="w-20 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={setting.value}
                        onChange={(e) => updateSetting(
                          settingSections[sectionIndex].title.toLowerCase().replace(' ', ''),
                          setting.key,
                          e.target.value
                        )}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        {setting.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reset Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-500 text-white rounded-lg">
            <ApperIcon name="AlertTriangle" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-600">These actions cannot be undone</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-900">Reset all settings</h3>
              <p className="text-sm text-red-600">Reset all settings to their default values</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              Reset Settings
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;