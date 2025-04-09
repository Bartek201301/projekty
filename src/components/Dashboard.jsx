import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Map, 
  Calendar, 
  Settings, 
  LogOut, 
  Pin, 
  ChevronRight,
  Clock,
  TrendingUp,
  BarChart3,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  Users,
  ListChecks,
} from 'lucide-react';

// Importujemy komponent widoku zadań i listy do zrobienia
import TasksView from './TasksView';
import ListaDoZrobienia from './ListaDoZrobienia';
import SettingsView from './SettingsView';
import RoadmapView from './RoadmapView';
import CalendarView from './CalendarView';

const Dashboard = ({ initialView = 'home' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeItem, setActiveItem] = useState(initialView);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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

  // Funkcja nawigacji do widoku checklisty dla konkretnego zadania
  const navigateToChecklist = (taskId) => {
    setActiveItem('checklist');
    setSelectedTaskId(taskId);
  };

  // Funkcja tworzenia nowej listy dla konkretnego zadania
  const createChecklistForTask = (taskId) => {
    setActiveItem('checklist');
    setSelectedTaskId(taskId);
    // Dodanie parametru, który będzie sygnalizował potrzebę utworzenia nowej listy
    sessionStorage.setItem('createNewList', 'true');
  };

  // Dodajemy funkcje do globalnego obiektu window, aby inne komponenty mogły ich używać
  useEffect(() => {
    window.navigateToChecklist = navigateToChecklist;
    window.createChecklistForTask = createChecklistForTask;
    return () => {
      delete window.navigateToChecklist;
      delete window.createChecklistForTask;
    };
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tasks', icon: CheckSquare, label: 'Zadania' },
    { id: 'checklist', icon: ListChecks, label: 'Lista do zrobienia' },
    { id: 'roadmap', icon: Map, label: 'Roadmapa' },
    { id: 'calendar', icon: Calendar, label: 'Kalendarz' },
    { id: 'settings', icon: Settings, label: 'Ustawienia' },
    { id: 'logout', icon: LogOut, label: 'Wyloguj' },
  ];

  // Dane do statystyk i wykresów (symulowane dane użytkownika)
  const stats = {
    completedTasks: 38,
    pendingTasks: 12,
    totalProjects: 7,
    activeProjects: 4,
    productivity: 87, // procent
    timeSpent: 24.5, // godziny
  };

  const weeklyActivity = [
    { day: 'Pon', hours: 4.2, completed: 7 },
    { day: 'Wt', hours: 5.8, completed: 9 },
    { day: 'Śr', hours: 3.5, completed: 5 },
    { day: 'Czw', hours: 6.2, completed: 11 },
    { day: 'Pt', hours: 4.7, completed: 8 },
    { day: 'Sob', hours: 1.2, completed: 2 },
    { day: 'Nd', hours: 0.5, completed: 1 },
  ];

  const recentProjects = [
    { id: 1, name: 'Redesign strony firmowej', progress: 78, deadline: '2023-12-15', priority: 'Wysoki' },
    { id: 2, name: 'Aplikacja mobilna TimeManager', progress: 42, deadline: '2024-01-20', priority: 'Średni' },
    { id: 3, name: 'Integracja z systemem CRM', progress: 95, deadline: '2023-12-05', priority: 'Krytyczny' },
    { id: 4, name: 'Automatyzacja raportów', progress: 15, deadline: '2024-02-10', priority: 'Niski' },
  ];

  const upcomingTasks = [
    { id: 1, name: 'Call z klientem XYZ', dueDate: '2023-11-28 13:00', completed: false },
    { id: 2, name: 'Przygotowanie prezentacji', dueDate: '2023-11-29 16:00', completed: false },
    { id: 3, name: 'Code review', dueDate: '2023-11-30 10:00', completed: false },
    { id: 4, name: 'Aktualizacja dokumentacji', dueDate: '2023-12-01 12:00', completed: false },
    { id: 5, name: 'Testy aplikacji mobile', dueDate: '2023-12-02 15:00', completed: false },
  ];

  // Funkcja pomocnicza do obliczania koloru paska postępu
  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Funkcja pomocnicza do określania koloru priorytetu
  const getPriorityColor = (priority) => {
    if (priority === 'Krytyczny') return 'text-red-500';
    if (priority === 'Wysoki') return 'text-orange-400';
    if (priority === 'Średni') return 'text-yellow-400';
    return 'text-blue-400';
  };

  // Funkcja do formatowania daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Obliczenie najwyższej wartości w danych aktywności
  const maxActivityValue = Math.max(...weeklyActivity.map(day => day.hours)) * 1.2;

  // Renderowanie odpowiedniego widoku w zależności od wybranej zakładki
  const renderView = () => {
    switch (activeItem) {
      case 'tasks':
        return <TasksView />;
      case 'checklist':
        return <ListaDoZrobienia selectedTaskId={selectedTaskId} />;
      case 'settings':
        return <SettingsView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'calendar':
        return <CalendarView />;
      case 'home':
      default:
        return renderHomeView();
    }
  };

  // Renderowanie widoku Home
  const renderHomeView = () => (
    <>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          Witaj, <span className="text-primary">Bartek!</span>
        </h1>
        <p className="text-gray-400 mt-1">
          Ostatnie logowanie: dziś, 10:45
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lewa kolumna - statystyki i aktywność */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-4 rounded-xl border border-dark-100/80 shadow-lg"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Wykonane zadania</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.completedTasks}</h3>
                </div>
                <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div className="mt-2 text-green-400 text-xs font-medium flex items-center">
                <TrendingUp size={14} className="mr-1" />
                <span>+12% w tym tygodniu</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-4 rounded-xl border border-dark-100/80 shadow-lg"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Oczekujące</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.pendingTasks}</h3>
                </div>
                <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500">
                  <AlertCircle size={20} />
                </div>
              </div>
              <div className="mt-2 text-yellow-400 text-xs font-medium flex items-center">
                <span>3 z wysokim priorytetem</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-4 rounded-xl border border-dark-100/80 shadow-lg"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Poświęcony czas</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.timeSpent}h</h3>
                </div>
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
                  <Timer size={20} />
                </div>
              </div>
              <div className="mt-2 text-blue-400 text-xs font-medium flex items-center">
                <span>W tym tygodniu</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-4 rounded-xl border border-dark-100/80 shadow-lg"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Projekty</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.activeProjects}/{stats.totalProjects}</h3>
                </div>
                <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-2 text-purple-400 text-xs font-medium flex items-center">
                <span>Aktywne projekty</span>
              </div>
            </motion.div>
          </div>

          {/* Productivity Chart */}
          <motion.div 
            className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Aktywność w tym tygodniu</h3>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span className="text-sm text-gray-400">Godziny</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-400">Ukończone zadania</span>
                </div>
              </div>
            </div>

            <div className="relative h-64">
              {/* Linie pomocnicze */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1, 0.75, 0.5, 0.25, 0].map((val, i) => (
                  <div 
                    key={i} 
                    className="w-full h-px bg-gray-700 relative"
                  >
                    <span className="absolute -top-2.5 -left-8 text-xs text-gray-500">
                      {Math.round(maxActivityValue * val)}h
                    </span>
                  </div>
                ))}
              </div>

              {/* Wykresy słupkowe */}
              <div className="absolute inset-0 flex items-end justify-between pt-5">
                {weeklyActivity.map((day, i) => (
                  <div key={i} className="flex flex-col items-center w-full">
                    {/* Słupek godzin */}
                    <motion.div 
                      className="w-5 rounded-t-md bg-primary bg-opacity-80"
                      style={{ height: `${(day.hours / maxActivityValue) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.hours / maxActivityValue) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <div className="text-xs text-white font-medium mt-2 opacity-0 group-hover:opacity-100">
                        {day.hours}h
                      </div>
                    </motion.div>

                    {/* Słupek zadań (przesunięty w prawo) */}
                    <motion.div 
                      className="w-5 ml-6 rounded-t-md bg-green-500 bg-opacity-80 absolute bottom-0"
                      style={{ 
                        height: `${(day.completed / 12) * 100}%`,
                        left: `calc(${i * (100 / weeklyActivity.length)}% + 10px)` 
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.completed / 12) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                    ></motion.div>

                    {/* Etykieta dnia */}
                    <div className="text-xs text-gray-400 mt-2">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div 
            className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Ostatnie projekty</h3>
              <a href="#" className="text-primary text-sm hover:underline">Zobacz wszystkie</a>
            </div>

            <div className="space-y-4">
              {recentProjects.map((project) => (
                <motion.div 
                  key={project.id}
                  className="p-4 bg-dark-200/70 rounded-lg hover:bg-dark-200"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-semibold">{project.name}</h4>
                      <div className="flex items-center mt-1 space-x-3">
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-400">
                            {formatDate(project.deadline)}
                          </span>
                        </div>
                        <div className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-white">{project.progress}%</div>
                  </div>
                  
                  <div className="mt-3 relative w-full h-1.5 bg-dark-300 rounded-full overflow-hidden">
                    <motion.div 
                      className={`absolute top-0 left-0 h-full ${getProgressColor(project.progress)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Prawa kolumna - nadchodzące zadania i statystyki */}
        <div className="space-y-6">
          {/* Produktywność */}
          <motion.div 
            className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Produktywność</h3>
            
            <div className="relative pt-5">
              <svg className="w-full" height="160" viewBox="0 0 160 160">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  fill="none" 
                  stroke="#1E1E2F" 
                  strokeWidth="15"
                />
                <motion.circle 
                  cx="80" 
                  cy="80" 
                  r="70"
                  fill="none" 
                  stroke="#A78BFA" 
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeDasharray="440"
                  strokeDashoffset="440"
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ 
                    strokeDashoffset: 440 - (440 * stats.productivity / 100)
                  }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  transform="rotate(-90 80 80)"
                />
                <text 
                  x="80" 
                  y="85" 
                  textAnchor="middle" 
                  fontSize="28" 
                  fontWeight="bold"
                  fill="white"
                >
                  {stats.productivity}%
                </text>
              </svg>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-sm">
              <div className="text-gray-400">Twój cel: 85%</div>
              <div className="text-primary font-medium">+2% od zeszłego tygodnia</div>
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div 
            className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Nadchodzące zadania</h3>
              <button 
                className="text-primary text-sm hover:underline"
                onClick={() => setActiveItem('tasks')}
              >
                Zobacz więcej
              </button>
            </div>

            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <motion.div 
                  key={task.id} 
                  className="flex items-center p-3 rounded-lg hover:bg-dark-200/70"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 3 }}
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-9 h-9 rounded-full bg-dark-200 flex items-center justify-center border border-dark-100">
                      <Clock3 size={16} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-white text-sm font-medium">{task.name}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{task.dueDate}</p>
                  </div>
                  <motion.button 
                    className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-dark-200 flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <CheckSquare size={15} className="text-gray-400 hover:text-primary" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Task Breakdown */}
          <motion.div 
            className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Podział zadań</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-300">Ukończone</span>
                  </div>
                  <span className="text-sm text-white font-medium">38</span>
                </div>
                <div className="w-full h-2 bg-dark-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-gray-300">W trakcie</span>
                  </div>
                  <span className="text-sm text-white font-medium">8</span>
                </div>
                <div className="w-full h-2 bg-dark-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: '16%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                  ></motion.div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-300">Zaległe</span>
                  </div>
                  <span className="text-sm text-white font-medium">4</span>
                </div>
                <div className="w-full h-2 bg-dark-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: '8%' }}
                    transition={{ duration: 1, delay: 0.6 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );

  // Zaktualizuj useEffect, aby reagował na zmianę initialView
  useEffect(() => {
    setActiveItem(initialView);
  }, [initialView]);

  return (
    <div className="flex h-screen overflow-hidden" data-active-item={activeItem} data-selected-task-id={selectedTaskId}>
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
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              className={`absolute right-3 top-3 p-1.5 rounded-full transition-colors ${isPinned ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-dark-100'}`}
              onClick={togglePin}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Pin size={16} className={isPinned ? 'rotate-45' : ''} />
            </motion.button>
          )}
        </AnimatePresence>

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
      <main className="flex-1 overflow-auto py-6 px-6 bg-gradient-to-br from-dark-300 to-dark-200">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 