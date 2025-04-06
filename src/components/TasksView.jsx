import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  CheckSquare,
} from 'lucide-react';

const TasksView = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('deadline');
  
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Hook zamykający menu po kliknięciu na zewnątrz
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Funkcja obsługująca wybór filtra
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setFilterOpen(false);
  };

  // Funkcja obsługująca wybór sortowania
  const handleSortSelect = (sort) => {
    setSelectedSort(sort);
    setSortOpen(false);
  };

  // Przykładowe dane zadań
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Przygotowanie prezentacji dla klienta', 
      description: 'Stworzyć prezentację podsumowującą postępy projektu',
      deadline: '2023-12-01', 
      priority: 'Wysoki', 
      status: 'in-progress',
      tags: ['Marketing', 'Klient XYZ'],
      createdAt: '2023-11-05',
    },
    { 
      id: 2, 
      title: 'Analiza danych z ostatniego kwartału', 
      description: 'Przeprowadzić analizę wyników sprzedażowych Q3',
      deadline: '2023-11-30', 
      priority: 'Średni', 
      status: 'to-do',
      tags: ['Analityka', 'Raport'],
      createdAt: '2023-11-10',
    },
    { 
      id: 3, 
      title: 'Aktualizacja dokumentacji projektu', 
      description: 'Zaktualizować dokumentację techniczną zgodnie z nowymi wytycznymi',
      deadline: '2023-11-25', 
      priority: 'Niski', 
      status: 'to-do',
      tags: ['Dokumentacja'],
      createdAt: '2023-11-12',
    },
    { 
      id: 4, 
      title: 'Poprawa błędów w aplikacji', 
      description: 'Naprawić zgłoszone błędy w aplikacji mobilnej',
      deadline: '2023-11-20', 
      priority: 'Krytyczny', 
      status: 'in-progress',
      tags: ['Development', 'Mobile'],
      createdAt: '2023-11-08',
    },
    { 
      id: 5, 
      title: 'Przeprowadzenie testów użyteczności', 
      description: 'Zorganizować sesję testów z użytkownikami',
      deadline: '2023-12-05', 
      priority: 'Średni', 
      status: 'to-do',
      tags: ['UX', 'Testy'],
      createdAt: '2023-11-15',
    },
    { 
      id: 6, 
      title: 'Optymalizacja wydajności aplikacji', 
      description: 'Poprawić czas ładowania kluczowych ekranów',
      deadline: '2023-12-10', 
      priority: 'Wysoki', 
      status: 'to-do',
      tags: ['Development', 'Optymalizacja'],
      createdAt: '2023-11-18',
    },
    { 
      id: 7, 
      title: 'Spotkanie zespołu projektowego', 
      description: 'Cotygodniowe spotkanie statusowe projektu TimeManager',
      deadline: '2023-11-22', 
      priority: 'Średni', 
      status: 'to-do',
      tags: ['Spotkanie', 'Team'],
      createdAt: '2023-11-14',
    },
    { 
      id: 8, 
      title: 'Finalizacja designu nowego dashboardu', 
      description: 'Zakończyć prace nad UI nowego dashboardu',
      deadline: '2023-11-18', 
      priority: 'Wysoki', 
      status: 'completed',
      tags: ['Design', 'UI/UX'],
      createdAt: '2023-11-01',
      completedAt: '2023-11-17',
    },
  ]);

  // Filtracja zadań
  const filteredTasks = tasks.filter(task => {
    // Filtrowanie według statusu
    if (selectedFilter === 'to-do' && task.status !== 'to-do') return false;
    if (selectedFilter === 'in-progress' && task.status !== 'in-progress') return false;
    if (selectedFilter === 'completed' && task.status !== 'completed') return false;
    
    // Filtrowanie według wyszukiwania
    if (searchValue && !task.title.toLowerCase().includes(searchValue.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchValue.toLowerCase()) &&
        !task.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  // Sortowanie zadań
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (selectedSort === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (selectedSort === 'priority') {
      const priorityOrder = { 'Krytyczny': 1, 'Wysoki': 2, 'Średni': 3, 'Niski': 4 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (selectedSort === 'created') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Funkcje obsługujące zadania
  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'to-do' : 'completed';
        return { 
          ...task, 
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
        };
      }
      return task;
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Krytyczny': return 'text-red-500 bg-red-500/10';
      case 'Wysoki': return 'text-orange-400 bg-orange-400/10';
      case 'Średni': return 'text-yellow-400 bg-yellow-400/10';
      case 'Niski': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  // Formatowanie daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Renderowanie komponentu
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Zadania</h1>
        <motion.button
          className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} className="mr-2" />
          <span>Nowe zadanie</span>
        </motion.button>
      </div>

      {/* Pasek narzędzi (wyszukiwanie i filtrowanie) */}
      <div className="bg-dark-100/50 backdrop-blur-sm rounded-xl border border-dark-100/80 shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Wyszukiwarka */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full bg-dark-200 border border-dark-100 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Szukaj zadań..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Przyciski filtrowania i sortowania */}
          <div className="flex gap-3">
            {/* Filtrowanie */}
            <div className="relative" ref={filterRef}>
              <button
                className="flex items-center bg-dark-200 hover:bg-dark-100 text-white px-4 py-2 rounded-lg"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={18} className="mr-2 text-gray-400" />
                <span>Filtruj</span>
              </button>
              
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-xl border border-dark-100 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedFilter === 'all' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleFilterSelect('all')}
                      >
                        Wszystkie zadania
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedFilter === 'to-do' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleFilterSelect('to-do')}
                      >
                        Do zrobienia
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedFilter === 'in-progress' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleFilterSelect('in-progress')}
                      >
                        W trakcie
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedFilter === 'completed' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleFilterSelect('completed')}
                      >
                        Ukończone
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sortowanie */}
            <div className="relative" ref={sortRef}>
              <button
                className="flex items-center bg-dark-200 hover:bg-dark-100 text-white px-4 py-2 rounded-lg"
                onClick={() => setSortOpen(!sortOpen)}
              >
                <ArrowUpDown size={18} className="mr-2 text-gray-400" />
                <span>
                  {selectedSort === 'deadline' && 'Termin'}
                  {selectedSort === 'priority' && 'Priorytet'}
                  {selectedSort === 'created' && 'Data utworzenia'}
                </span>
              </button>
              
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-xl border border-dark-100 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-1">
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedSort === 'deadline' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleSortSelect('deadline')}
                      >
                        Termin
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedSort === 'priority' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleSortSelect('priority')}
                      >
                        Priorytet
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm ${selectedSort === 'created' ? 'bg-primary/20 text-primary' : 'text-white hover:bg-dark-100'}`}
                        onClick={() => handleSortSelect('created')}
                      >
                        Data utworzenia
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Lista zadań */}
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <motion.div
              key={task.id}
              className="bg-dark-100/50 backdrop-blur-sm rounded-xl border border-dark-100/80 shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="p-5">
                <div className="flex items-start">
                  <button 
                    className="flex-shrink-0 mt-1"
                    onClick={() => toggleTaskStatus(task.id)}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={22} className="text-green-500" />
                    ) : (
                      <Circle size={22} className="text-gray-500" />
                    )}
                  </button>
                  
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="flex-shrink-0 relative">
                        <button className="text-gray-400 hover:text-white p-1 rounded-full">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`mt-1 text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {task.description}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="bg-dark-200 text-xs px-2 py-1 rounded-full text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {task.status === 'completed' ? 
                              `Ukończono: ${formatDate(task.completedAt)}` : 
                              `Termin: ${formatDate(task.deadline)}`}
                          </span>
                        </div>
                        
                        <div className={`text-xs px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <motion.button 
                          className="p-1.5 bg-dark-200 hover:bg-dark-100 rounded-full text-gray-400 hover:text-primary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button 
                          className="p-1.5 bg-dark-200 hover:bg-dark-100 rounded-full text-gray-400 hover:text-red-500"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400"
            >
              <div className="mb-4 flex justify-center">
                <CheckSquare size={48} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-1">Brak zadań</h3>
              <p className="text-gray-400">
                {searchValue ? "Nie znaleziono zadań pasujących do wyszukiwania" : "Dodaj nowe zadanie, aby rozpocząć"}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView; 