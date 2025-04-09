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
  ChevronLeft,
  ArrowRight,
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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

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
  const renderHomeView = () => {
    // Funkcja pomocnicza do uzyskania pierwszego dnia miesiąca
    const getFirstDayOfMonth = (year, month) => {
      const firstDay = new Date(year, month, 1);
      return firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Korygujemy dni tygodnia (0-6) -> (1-7) z poniedziałkiem jako 0
    };

    // Funkcja pomocnicza do uzyskania liczby dni w miesiącu
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Funkcja pomocnicza do sprawdzania, czy data jest dzisiaj
    const isToday = (day) => {
      const today = new Date();
      return day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear();
    };

    // Funkcja do zmiany miesiąca
    const changeMonth = (increment) => {
      let newMonth = currentMonth + increment;
      let newYear = currentYear;
      
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    };

    // Nazwy dni tygodnia
    const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

    // Nazwy miesięcy
    const monthNames = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    return (
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
          {/* Lewa kolumna - statystyki i kalendarz */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            {/* Kalendarz */}
            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Twój kalendarz</h3>
                <div className="flex items-center bg-dark-300/80 rounded-lg p-1.5 border border-dark-100">
                  <button 
                    className="p-1.5 mx-1 rounded-lg hover:bg-dark-200/70"
                    onClick={() => changeMonth(-1)}
                  >
                    <ChevronLeft size={16} className="text-gray-400" />
                  </button>
                  
                  <div className="text-white font-medium mx-3 min-w-[100px] text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </div>
                  
                  <button 
                    className="p-1.5 mx-1 rounded-lg hover:bg-dark-200/70"
                    onClick={() => changeMonth(1)}
                  >
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Uproszczony kalendarz */}
              <motion.div 
                className="grid grid-cols-7 gap-1 overflow-hidden rounded-lg border border-primary/30 bg-dark-300/90 cursor-pointer"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveItem('calendar')}
              >
                {/* Nagłówki dni tygodnia */}
                {weekDays.map((day) => (
                  <div 
                    key={day} 
                    className="text-center text-gray-400 font-medium text-sm py-2 border-b border-primary/30"
                  >
                    {day}
                  </div>
                ))}
                
                {/* Dni miesiąca */}
                {(() => {
                  const days = [];
                  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
                  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
                  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
                  
                  // Generowanie wszystkich komórek (puste i z dniami)
                  for (let i = 0; i < totalCells; i++) {
                    const day = i - firstDay + 1;
                    
                    if (day > 0 && day <= daysInMonth) {
                      const isCurrentDay = isToday(day);
                      
                      // Komórka z dniem
                      days.push(
                        <motion.div 
                          key={`day-${day}`}
                          className={`h-10 flex items-center justify-center text-sm
                            ${isCurrentDay ? 'bg-primary/30 text-white font-bold' : 'text-gray-300 hover:bg-dark-200/30'}`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {day}
                        </motion.div>
                      );
                    } else {
                      // Pusta komórka
                      days.push(
                        <div 
                          key={`empty-${i}`} 
                          className="h-10"
                        ></div>
                      );
                    }
                  }
                  
                  return days;
                })()}
              </motion.div>
              <div className="mt-4 text-center">
                <motion.button
                  className="inline-flex items-center text-primary text-sm hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveItem('calendar')}
                >
                  <span>Przejdź do widoku kalendarza</span>
                  <ArrowRight size={14} className="ml-1" />
                </motion.button>
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

          {/* Prawa kolumna - nadchodzące zadania i informacje */}
          <div className="space-y-6">
            {/* Dzisiejsza data z animacją */}
            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Dzisiaj</h3>
              
              <motion.div 
                className="relative flex items-center justify-center p-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute w-32 h-32 rounded-full border-4 border-primary/20"></div>
                <div className="absolute w-24 h-24 rounded-full border-2 border-primary/40"></div>
                
                <div className="bg-dark-200/90 rounded-full p-6 relative z-10">
                  <motion.div 
                    className="text-center text-white"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <div className="text-3xl font-bold">
                      {new Date().getDate()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date().toLocaleDateString('pl-PL', { month: 'long' })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <p className="text-center text-gray-300 mt-4">
                {new Date().toLocaleDateString('pl-PL', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long', 
                  year: 'numeric'
                })}
              </p>
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

            {/* Inspirujący cytat z animacją */}
            <motion.div 
              className="bg-dark-100/50 backdrop-blur-sm p-6 rounded-xl border border-dark-100/80 shadow-lg overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              <motion.div
                className="absolute -left-20 -bottom-20 w-60 h-60 bg-primary/5 rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              />
              
              <h3 className="text-lg font-semibold text-white mb-4 relative z-10">Inspiracja na dziś</h3>
              
              <blockquote className="relative z-10">
                <p className="text-gray-300 italic">
                  "Nie ma znaczenia, jak wolno idziesz, dopóki się nie zatrzymujesz."
                </p>
                <footer className="text-primary text-sm mt-3 font-medium">
                  — Konfucjusz
                </footer>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </>
    );
  };

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