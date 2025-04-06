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
  X,
  AlertCircle,
  PlayCircle,
  ListChecks
} from 'lucide-react';

const TasksView = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('deadline');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [taskMenuOpen, setTaskMenuOpen] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: new Date().toISOString().split('T')[0],
    priority: 'Średni',
    tags: '',
    status: 'to-do',
  });
  
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const taskMenuRef = useRef(null);

  // Hook zamykający menu po kliknięciu na zewnątrz
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target) && showTaskModal) {
        setShowTaskModal(false);
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target) && showDeleteModal) {
        setShowDeleteModal(false);
      }
      if (taskMenuRef.current && !taskMenuRef.current.contains(event.target)) {
        setTaskMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showTaskModal, showDeleteModal, taskMenuOpen]);

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

  // Obsługa pól formularza nowego zadania
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // Funkcja otwierająca modal w trybie dodawania
  const openAddTaskModal = () => {
    setNewTask({
      title: '',
      description: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Średni',
      tags: '',
      status: 'to-do',
    });
    setIsEditMode(false);
    setEditingTaskId(null);
    setShowTaskModal(true);
  };

  // Funkcja otwierająca modal w trybie edycji
  const openEditTaskModal = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setNewTask({
        title: taskToEdit.title,
        description: taskToEdit.description,
        deadline: taskToEdit.deadline,
        priority: taskToEdit.priority,
        tags: taskToEdit.tags.join(', '),
        status: taskToEdit.status,
      });
      setIsEditMode(true);
      setEditingTaskId(taskId);
      setShowTaskModal(true);
      setTaskMenuOpen(null);
    }
  };

  // Funkcja dodająca/edytująca zadanie
  const saveTask = () => {
    // Walidacja
    if (!newTask.title.trim()) {
      alert('Proszę podać tytuł zadania');
      return;
    }

    const tagsArray = newTask.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    if (isEditMode && editingTaskId) {
      // Tryb edycji
      setTasks(tasks.map(task => {
        if (task.id === editingTaskId) {
          return { 
            ...task,
            title: newTask.title,
            description: newTask.description,
            deadline: newTask.deadline,
            priority: newTask.priority,
            tags: tagsArray,
            status: newTask.status,
          };
        }
        return task;
      }));
    } else {
      // Tryb dodawania
      const newTaskObj = {
        id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
        title: newTask.title,
        description: newTask.description,
        deadline: newTask.deadline,
        priority: newTask.priority,
        status: newTask.status,
        tags: tagsArray,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks([...tasks, newTaskObj]);
    }
    
    // Reset formularza i zamknięcie modala
    resetTaskForm();
  };

  // Funkcja resetująca formularz i zamykająca modal
  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      deadline: new Date().toISOString().split('T')[0],
      priority: 'Średni',
      tags: '',
      status: 'to-do',
    });
    setIsEditMode(false);
    setEditingTaskId(null);
    setShowTaskModal(false);
  };

  // Funkcja inicjująca usuwanie zadania
  const initiateDeleteTask = (taskId) => {
    setDeleteTaskId(taskId);
    setShowDeleteModal(true);
    setTaskMenuOpen(null);
  };

  // Funkcja usuwająca zadanie
  const deleteTask = () => {
    if (deleteTaskId) {
      setTasks(tasks.filter(task => task.id !== deleteTaskId));
      setShowDeleteModal(false);
      setDeleteTaskId(null);
    }
  };

  // Funkcja zmieniająca status zadania
  const changeTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          status: newStatus,
        };
        
        // Dodaj datę ukończenia, jeśli zadanie jest oznaczone jako ukończone
        if (newStatus === 'completed') {
          updatedTask.completedAt = new Date().toISOString().split('T')[0];
        } else if (task.status === 'completed') {
          updatedTask.completedAt = null;
        }
        
        return updatedTask;
      }
      return task;
    }));
    setTaskMenuOpen(null);
  };

  // Funkcja przełączająca menu zadania
  const toggleTaskMenu = (taskId) => {
    setTaskMenuOpen(taskMenuOpen === taskId ? null : taskId);
  };

  // Funkcje do obsługi powiązanych list zadań
  const [checklistLists, setChecklistLists] = useState([
    {
      id: 1,
      title: 'Do zrobienia na dziś',
      createdAt: '2023-11-05',
      updatedAt: '2023-11-07',
      taskId: null,
      items: [
        { id: 1, text: 'Spotkanie zespołu o 10:00', completed: true },
        { id: 2, text: 'Przejrzeć raporty sprzedażowe', completed: false },
        { id: 3, text: 'Dokończyć prezentację dla klienta', completed: false },
        { id: 4, text: 'Odpowiedzieć na emaile', completed: true },
      ]
    },
    {
      id: 2,
      title: 'Lista zakupów',
      createdAt: '2023-11-10',
      updatedAt: '2023-11-10',
      taskId: null,
      items: [
        { id: 1, text: 'Mleko', completed: false },
        { id: 2, text: 'Chleb', completed: false },
        { id: 3, text: 'Owoce', completed: false },
        { id: 4, text: 'Warzywa', completed: true },
      ]
    },
    {
      id: 3,
      title: 'Plan pracy nad prezentacją',
      createdAt: '2023-11-12',
      updatedAt: '2023-11-14',
      taskId: 1,
      items: [
        { id: 1, text: 'Przygotować outline prezentacji', completed: true },
        { id: 2, text: 'Zebrać dane do wykresów', completed: true },
        { id: 3, text: 'Zaprojektować slajdy', completed: false },
        { id: 4, text: 'Przygotować notki dla prezentera', completed: false },
        { id: 5, text: 'Przeprowadzić próbną prezentację', completed: false },
      ]
    },
    {
      id: 4,
      title: 'Plan aktualizacji dokumentacji',
      createdAt: '2023-11-15',
      updatedAt: '2023-11-15',
      taskId: 3,
      items: [
        { id: 1, text: 'Zaktualizować diagramy architektury', completed: false },
        { id: 2, text: 'Opisać nowe endpointy API', completed: false },
        { id: 3, text: 'Uzupełnić dokumentację użytkownika', completed: false },
      ]
    },
  ]);

  // Sprawdzanie czy zadanie ma powiązane listy
  const hasRelatedChecklists = (taskId) => {
    return checklistLists.some(list => list.taskId === taskId);
  };

  // Przejście do widoku checklisty dla zadania
  const goToChecklist = (taskId) => {
    // Zmiana aktywnego elementu w sidbarze i przejście do widoku checklisty
    // Ta część jest obsługiwana przez komponent Dashboard, więc musimy wywołać
    // funkcję przekazaną przez props lub emitować zdarzenie
    if (window.navigateToChecklist) {
      window.navigateToChecklist(taskId);
    } else {
      // Alternatywne rozwiązanie - przekierowanie przez zmianę stanu aplikacji
      const dashboardComponent = document.querySelector('[data-active-item]');
      if (dashboardComponent) {
        dashboardComponent.dataset.activeItem = 'checklist';
        dashboardComponent.dataset.selectedTaskId = taskId;
      }
    }
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
          onClick={openAddTaskModal}
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
            {/* Filtrowanie - nowa implementacja z użyciem selektora */}
            <div className="relative">
              <select
                className="appearance-none bg-dark-200 hover:bg-dark-100 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">Wszystkie zadania</option>
                <option value="to-do">Do zrobienia</option>
                <option value="in-progress">W trakcie</option>
                <option value="completed">Ukończone</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
            
            {/* Sortowanie - nowa implementacja z użyciem selektora */}
            <div className="relative">
              <select
                className="appearance-none bg-dark-200 hover:bg-dark-100 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="deadline">Termin</option>
                <option value="priority">Priorytet</option>
                <option value="created">Data utworzenia</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUpDown size={18} className="text-gray-400" />
              </div>
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
                    onClick={() => 
                      task.status === 'completed' 
                        ? changeTaskStatus(task.id, 'to-do') 
                        : changeTaskStatus(task.id, 'completed')}
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
                      <div className="flex-shrink-0 relative" ref={taskMenuOpen === task.id ? taskMenuRef : null}>
                        <button 
                          className="text-gray-400 hover:text-white p-1 rounded-full"
                          onClick={() => toggleTaskMenu(task.id)}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {/* Menu opcji dla zadania */}
                        {taskMenuOpen === task.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-dark-200 rounded-lg shadow-xl border border-dark-100 z-50">
                            <div className="py-1">
                              {/* Opcje zmiany statusu */}
                              {task.status !== 'to-do' && (
                                <button 
                                  className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-100"
                                  onClick={() => changeTaskStatus(task.id, 'to-do')}
                                >
                                  <Circle size={16} className="mr-2 text-gray-400" />
                                  <span>Do zrobienia</span>
                                </button>
                              )}
                              {task.status !== 'in-progress' && (
                                <button 
                                  className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-100"
                                  onClick={() => changeTaskStatus(task.id, 'in-progress')}
                                >
                                  <PlayCircle size={16} className="mr-2 text-blue-400" />
                                  <span>W trakcie</span>
                                </button>
                              )}
                              {task.status !== 'completed' && (
                                <button 
                                  className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-100"
                                  onClick={() => changeTaskStatus(task.id, 'completed')}
                                >
                                  <CheckCircle2 size={16} className="mr-2 text-green-500" />
                                  <span>Ukończone</span>
                                </button>
                              )}
                              
                              {/* Separator */}
                              <div className="border-t border-dark-100 my-1"></div>
                              
                              {/* Opcje edycji i usuwania */}
                              {hasRelatedChecklists(task.id) && (
                                <button 
                                  className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-100"
                                  onClick={() => goToChecklist(task.id)}
                                >
                                  <ListChecks size={16} className="mr-2 text-primary" />
                                  <span>Sprawdź listę</span>
                                </button>
                              )}
                              <button 
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-100"
                                onClick={() => openEditTaskModal(task.id)}
                              >
                                <Edit size={16} className="mr-2 text-primary" />
                                <span>Edytuj</span>
                              </button>
                              <button 
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-100"
                                onClick={() => initiateDeleteTask(task.id)}
                              >
                                <Trash2 size={16} className="mr-2 text-red-500" />
                                <span>Usuń</span>
                              </button>
                            </div>
                          </div>
                        )}
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
                        
                        {/* Status zadania */}
                        {task.status === 'in-progress' && (
                          <div className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-400">
                            W trakcie
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        {hasRelatedChecklists(task.id) && (
                          <motion.button 
                            className="p-1.5 bg-dark-200 hover:bg-dark-100 rounded-full text-gray-400 hover:text-primary flex items-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => goToChecklist(task.id)}
                          >
                            <ListChecks size={16} className="text-primary" />
                          </motion.button>
                        )}
                        <motion.button 
                          className="p-1.5 bg-dark-200 hover:bg-dark-100 rounded-full text-gray-400 hover:text-primary"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditTaskModal(task.id)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button 
                          className="p-1.5 bg-dark-200 hover:bg-dark-100 rounded-full text-gray-400 hover:text-red-500"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => initiateDeleteTask(task.id)}
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

      {/* Modal dodawania/edycji zadania */}
      {showTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            ref={modalRef}
            className="bg-dark-100 rounded-xl border border-dark-100/80 shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center border-b border-dark-200 p-4">
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? 'Edytuj zadanie' : 'Nowe zadanie'}
              </h2>
              <button 
                className="text-gray-400 hover:text-white rounded-full p-1"
                onClick={resetTaskForm}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Tytuł zadania*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Wpisz tytuł zadania"
                    value={newTask.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Opis zadania</label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Opisz zadanie"
                    rows="3"
                    value={newTask.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-1">Termin</label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newTask.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">Priorytet</label>
                    <select
                      id="priority"
                      name="priority"
                      className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newTask.priority}
                      onChange={handleInputChange}
                    >
                      <option value="Krytyczny">Krytyczny</option>
                      <option value="Wysoki">Wysoki</option>
                      <option value="Średni">Średni</option>
                      <option value="Niski">Niski</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Tagi (oddzielone przecinkami)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Projekt, Frontend, Design, ..."
                    value={newTask.tags}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="w-full bg-dark-200 border border-dark-100 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={newTask.status}
                    onChange={handleInputChange}
                  >
                    <option value="to-do">Do zrobienia</option>
                    <option value="in-progress">W trakcie</option>
                    <option value="completed">Ukończone</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  className="px-4 py-2 bg-dark-200 hover:bg-dark-100 text-white rounded-lg"
                  onClick={resetTaskForm}
                >
                  Anuluj
                </button>
                <motion.button
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveTask}
                >
                  {isEditMode ? 'Zapisz zmiany' : 'Dodaj zadanie'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal potwierdzenia usunięcia */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <motion.div
            ref={deleteModalRef}
            className="bg-dark-100 rounded-xl border border-dark-100/80 shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center border-b border-dark-200 p-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <AlertCircle size={20} className="text-red-500 mr-2" />
                Potwierdź usunięcie
              </h2>
              <button 
                className="text-gray-400 hover:text-white rounded-full p-1"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-gray-300 mb-4">
                Czy na pewno chcesz usunąć to zadanie? Tej operacji nie można cofnąć.
              </p>
              
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 bg-dark-200 hover:bg-dark-100 text-white rounded-lg"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Anuluj
                </button>
                <motion.button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={deleteTask}
                >
                  Usuń zadanie
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TasksView; 