import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Map, 
  Star, 
  Settings, 
  LogOut, 
  Pin, 
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  const handleMouseEnter = () => {
    if (!isPinned) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) setIsExpanded(false);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tasks', icon: CheckSquare, label: 'Zadania' },
    { id: 'roadmap', icon: Map, label: 'Roadmapa' },
    { id: 'favorites', icon: Star, label: 'Ulubione' },
    { id: 'settings', icon: Settings, label: 'Ustawienia' },
    { id: 'logout', icon: LogOut, label: 'Wyloguj' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        className="relative h-full bg-dark-200/80 backdrop-blur-md border-r border-dark-100 shadow-xl z-10"
        initial={{ width: 72 }}
        animate={{ width: isExpanded ? 240 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Pin Button */}
        <motion.button
          className={`absolute right-3 top-3 p-1.5 rounded-full transition-colors ${isPinned ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-dark-100'}`}
          onClick={togglePin}
          whileTap={{ scale: 0.9 }}
        >
          <Pin size={16} className={isPinned ? 'rotate-45' : ''} />
        </motion.button>

        {/* Logo */}
        <div className="flex items-center px-4 h-16">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </motion.div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="ml-3 font-semibold text-xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                TimeManager
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="mt-8 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <motion.button
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeItem === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-300 hover:bg-dark-100'}`}
                  onClick={() => setActiveItem(item.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="relative flex-shrink-0">
                    <item.icon size={20} />
                    {activeItem === item.id && (
                      <motion.div
                        className="absolute inset-0 -m-1 rounded-md border border-primary/50"
                        layoutId="activeNavItem"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        className="ml-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isExpanded && activeItem === item.id && (
                    <motion.div 
                      className="ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ChevronRight size={16} className="text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-dark-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-dark-100/80">
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome, <span className="text-primary">Bartek!</span>
            </h1>
            <p className="text-gray-300">
              Dashboard content will be displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 