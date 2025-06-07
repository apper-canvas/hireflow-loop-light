import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const StageFilterButton = ({ label, count, isSelected, onClick, color }) => {
    return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
                onClick={onClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                        ? `${color} text-white shadow-sm`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                {label}
                <span className="ml-2 text-xs opacity-75">({count})</span>
            </Button>
        </motion.div>
    );
};

export default StageFilterButton;