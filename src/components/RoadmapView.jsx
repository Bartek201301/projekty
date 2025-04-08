import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const RoadmapView = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="flex justify-center mb-6"
        >
          <Lock size={64} className="text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Niedostępne we wczesnym dostępie
        </h1>
        <p className="text-gray-400 text-lg">
          Ta funkcja będzie dostępna wkrótce
        </p>
      </motion.div>
    </div>
  );
};

export default RoadmapView; 