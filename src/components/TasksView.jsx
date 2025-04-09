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
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Typy dla drag and drop
const ItemTypes = {
  TASK: 'task'
};

// Komponent reprezentujący pojedyncze zadanie z obsługą drag and drop
const TaskCard = ({ task, changeTaskStatus, openEditTaskModal, initiateDeleteTask, hasRelatedChecklists, goToChecklist, formatDate, getPriorityColor }) => {
  // Poprawiona implementacja drag operacji
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: () => ({ 
      id: task.id, 
      status: task.status 
    }),
    // Dodajemy końcową obsługę operacji drag
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      // Jeśli zadanie zostało upuszczone na kolumnę i faktycznie zmieniono status
      if (dropResult && dropResult.moved && item.status !== dropResult.newStatus) {
        // Już wywołaliśmy changeTaskStatus w obsłudze drop, więc tutaj nic nie robimy
        // To zapobiega podwójnym aktualizacjom
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
  }), [task.id, task.status]); // Dodajemy zależności, aby useDrag odświeżał się, gdy zmieni się task.id lub task.status

  return (
    <div
      ref={drag}
      className={`bg-dark-100/50 backdrop-blur-sm rounded-xl border ${isDragging ? 'border-primary shadow-lg shadow-primary/20' : 'border-dark-100/80'} overflow-hidden mb-3 cursor-grab`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.2s, transform 0.2s',
        zIndex: isDragging ? 999 : 1
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          <div className="flex gap-4 bg-dark-200/80 rounded-lg p-1 -mt-1 -mr-1 border border-dark-100/30">
            <motion.button 
              className="text-gray-400 hover:text-primary p-1 rounded transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openEditTaskModal(task.id)}
            >
              <Edit size={16} />
            </motion.button>
            <motion.button 
              className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => initiateDeleteTask(task.id)}
            >
              <Trash2 size={16} />
            </motion.button>
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
        
        <div className="mt-4 flex items-center justify-between">
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
        
        {hasRelatedChecklists(task.id) && (
          <div className="mt-2 flex justify-end">
            <motion.button 
              className="flex items-center text-xs text-primary hover:text-primary/70"
              whileHover={{ scale: 1.05 }}
              onClick={() => goToChecklist(task.id)}
            >
              <ListChecks size={14} className="mr-1" />
              Pokaż listę
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

// Komponent reprezentujący kolumnę zadań
const TaskColumn = ({ title, status, tasks, changeTaskStatus, openEditTaskModal, initiateDeleteTask, hasRelatedChecklists, goToChecklist, formatDate, getPriorityColor, iconComponent }) => {
  // Poprawiony sposób obsługi drop operacji
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    // Sprawdź czy zadanie ma inny status niż ta kolumna
    canDrop: (item) => item.status !== status,
    drop: (item) => {
      // Tutaj wywołujemy zmianę statusu - tylko raz po upuszczeniu
      changeTaskStatus(item.id, status);
      return { moved: true, newStatus: status };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && monitor.canDrop(),
    }),
  }), [status, changeTaskStatus]); // Dodajemy zależności, aby useDrop odświeżał się, gdy zmieni się status lub changeTaskStatus

  return (
    <div 
      ref={drop} 
      className={`flex-1 bg-dark-200/30 backdrop-blur-sm rounded-xl border ${isOver ? 'border-primary border-2 bg-primary/5' : 'border-dark-100/30'} p-4 h-full flex flex-col transition-all duration-200`}
    >
      <div className={`flex items-center space-x-2 mb-4 text-white font-medium ${isOver ? 'text-primary' : ''}`}>
        {iconComponent}
        <h2 className="text-lg">{title}</h2>
        <div className={`px-2 py-0.5 rounded-full text-xs ${isOver ? 'bg-primary/20 text-primary' : 'bg-dark-100/70 text-gray-300'}`}>
          {tasks.length}
        </div>
      </div>
      
      <div className={`overflow-y-auto flex-grow ${isOver ? 'bg-primary/5 rounded-lg p-2 -mx-2' : ''}`}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              changeTaskStatus={changeTaskStatus}
              openEditTaskModal={openEditTaskModal}
              initiateDeleteTask={initiateDeleteTask}
              hasRelatedChecklists={hasRelatedChecklists}
              goToChecklist={goToChecklist}
              formatDate={formatDate}
              getPriorityColor={getPriorityColor}
            />
          ))
        ) : (
          <div className={`text-center py-8 ${isOver ? 'bg-primary/10 border border-dashed border-primary/30 rounded-lg' : ''}`}>
            <p className="text-gray-400 text-sm">{isOver ? 'Upuść tutaj' : 'Brak zadań'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

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

  // Funkcja zmieniająca status zadania - poprawiona dla eliminacji błędów przy drag and drop
  const changeTaskStatus = (taskId, newStatus) => {
    // Znajdź zadanie, które jest zmieniane
    const taskToUpdate = tasks.find(task => task.id === taskId);
    
    // Sprawdź, czy zadanie istnieje i czy status faktycznie się zmienia
    if (!taskToUpdate || taskToUpdate.status === newStatus) {
      return; // Nic nie rób, jeśli zadanie nie istnieje lub status jest taki sam
    }
    
    // Utwórz nową kopię tabeli zadań z zaktualizowanym statusem
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          status: newStatus,
        };
        
        // Aktualizuj datę ukończenia tylko jeśli potrzeba
        if (newStatus === 'completed' && task.status !== 'completed') {
          updatedTask.completedAt = new Date().toISOString().split('T')[0];
        } else if (task.status === 'completed' && newStatus !== 'completed') {
          updatedTask.completedAt = null;
        }
        
        return updatedTask;
      }
      return task;
    });
    
    // Ustaw nową tablicę zadań bezpośrednio
    setTasks(updatedTasks);
    
    // Zresetuj menu zadania, jeśli jest otwarte
    if (taskMenuOpen === taskId) {
      setTaskMenuOpen(null);
    }
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

  // Funkcja sprawdzająca, czy zadanie ma powiązane listy zadań
  const hasRelatedChecklists = (taskId) => {
    return checklistLists.some(list => list.taskId === taskId);
  };

  // Funkcja nawigująca do widoku listy zadań
  const goToChecklist = (taskId) => {
    if (window.navigateToChecklist) {
      window.navigateToChecklist(taskId);
    } else {
      console.log(`Navigating to checklist for task ${taskId}`);
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

  // Filtrowanie zadań według statusu
  const todoTasks = tasks.filter(task => 
    task.status === 'to-do' && 
    (searchValue === '' || 
     task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
     task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
     task.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase())))
  );
  
  const inProgressTasks = tasks.filter(task => 
    task.status === 'in-progress' && 
    (searchValue === '' || 
     task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
     task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
     task.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase())))
  );
  
  const completedTasks = tasks.filter(task => 
    task.status === 'completed' && 
    (searchValue === '' || 
     task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
     task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
     task.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase())))
  );

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

      {/* Pasek narzędzi (wyszukiwanie) */}
      <div className="bg-dark-100/50 backdrop-blur-sm rounded-xl border border-dark-100/80 shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Wyszukiwarka */}
          <div className="relative w-full">
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
        </div>
      </div>

      {/* Kanban Board - trzy kolumny */}
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-240px)]">
          <TaskColumn 
            title="Do zrobienia" 
            status="to-do"
            tasks={todoTasks}
            changeTaskStatus={changeTaskStatus}
            openEditTaskModal={openEditTaskModal}
            initiateDeleteTask={initiateDeleteTask}
            hasRelatedChecklists={hasRelatedChecklists}
            goToChecklist={goToChecklist}
            formatDate={formatDate}
            getPriorityColor={getPriorityColor}
            iconComponent={<Circle size={18} className="text-gray-400" />}
          />
          
          <TaskColumn 
            title="W trakcie" 
            status="in-progress"
            tasks={inProgressTasks}
            changeTaskStatus={changeTaskStatus}
            openEditTaskModal={openEditTaskModal}
            initiateDeleteTask={initiateDeleteTask}
            hasRelatedChecklists={hasRelatedChecklists}
            goToChecklist={goToChecklist}
            formatDate={formatDate}
            getPriorityColor={getPriorityColor}
            iconComponent={<PlayCircle size={18} className="text-blue-400" />}
          />
          
          <TaskColumn 
            title="Ukończone" 
            status="completed"
            tasks={completedTasks}
            changeTaskStatus={changeTaskStatus}
            openEditTaskModal={openEditTaskModal}
            initiateDeleteTask={initiateDeleteTask}
            hasRelatedChecklists={hasRelatedChecklists}
            goToChecklist={goToChecklist}
            formatDate={formatDate}
            getPriorityColor={getPriorityColor}
            iconComponent={<CheckCircle2 size={18} className="text-green-500" />}
          />
        </div>
      </DndProvider>

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