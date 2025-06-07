import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const QuickActionButton = ({ title, description, icon, color, onClick, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200"
        >
            <div className="flex items-start space-x-4">
                <div className={`${color} text-white p-3 rounded-lg`}>
                    <ApperIcon name={icon} size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default QuickActionButton;