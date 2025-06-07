import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, icon, color, textColor, onClick, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            onClick={onClick}
            className={`${color} ${textColor} rounded-lg p-6 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <ApperIcon name={icon} size={32} className="opacity-80" />
            </div>
        </motion.div>
    );
};

export default StatCard;