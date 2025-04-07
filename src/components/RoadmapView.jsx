import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Map } from 'lucide-react';

const RoadmapView = () => {
  // Mock data for roadmap examples
  const roadmaps = [
    { id: 1, name: 'Projekt Alpha', updatedAt: '2023-11-22' },
    { id: 2, name: 'Redesign aplikacji', updatedAt: '2023-11-15' }
  ];

  // Since we're not using React Router, we'll use a simple function to navigate
  const navigateToCreator = () => {
    window.location.href = '/roadmap-creator';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Twoje roadmapy
        </h1>
        <p className="text-gray-400 mt-1">
          Zarządzaj swoimi projektami i twórz plany rozwoju
        </p>
      </header>

      {/* Roadmaps grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {roadmaps.map((roadmap) => (
          <motion.div
            key={roadmap.id}
            className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg hover:border-primary/50"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
            transition={{ duration: 0.2 }}
            onClick={() => window.location.href = `/roadmap-creator?id=${roadmap.id}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{roadmap.name}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Ostatnia aktualizacja: {roadmap.updatedAt}
                </p>
              </div>
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <Map size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create new roadmap button */}
      <motion.button
        className="flex items-center justify-center w-full md:w-auto bg-primary hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={navigateToCreator}
      >
        <PlusCircle className="mr-2" size={20} />
        Stwórz nową roadmapę
      </motion.button>
    </div>
  );
};

export default RoadmapView; 