import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  X,
  Plus,
  AlertCircle,
  ListPlus,
  ArrowRight
} from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [tasks, setTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayTasks, setSelectedDayTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Średni');

  // Przykładowe zadania (w rzeczywistej aplikacji powinny być pobierane z API/localStorage)
  useEffect(() => {
    const sampleTasks = [
      { id: 1, title: "Spotkanie z klientem", date: "2025-04-10", priority: "Wysoki", description: "Spotkanie w sprawie nowego projektu i omówienie terminu realizacji." },
      { id: 2, title: "Termin projektu", date: "2025-04-15", priority: "Krytyczny", description: "Ostateczny termin oddania projektu TimeManager." },
      { id: 3, title: "Przygotować prezentację", date: "2025-04-09", priority: "Średni", description: "Przygotowanie prezentacji na spotkanie z zarządem." },
      { id: 4, title: "Rozmowa telefoniczna", date: "2025-04-12", priority: "Niski", description: "Rozmowa z klientem XYZ odnośnie nowych wymagań." },
      { id: 5, title: "Aktualizacja dokumentacji", date: "2025-04-18", priority: "Średni", description: "Aktualizacja dokumentacji technicznej dla systemu." },
      { id: 6, title: "Przegląd kodu", date: "2025-04-09", priority: "Wysoki", description: "Code review dla ostatnich zmian w projekcie." },
      { id: 7, title: "Oddanie raportu", date: "2025-04-20", priority: "Krytyczny", description: "Raport z postępu prac za pierwszy kwartał." },
      { id: 8, title: "Spotkanie zespołu", date: "2025-04-22", priority: "Średni", description: "Cotygodniowe spotkanie zespołu projektowego." }
    ];
    setTasks(sampleTasks);
  }, []);

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

  // Funkcja do formatowania daty w formacie YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Funkcja do pobierania zadań dla danego dnia
  const getTasksForDay = (day) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    return tasks.filter(task => task.date === dateStr);
  };

  // Funkcja do nawigacji do zadania
  const navigateToTask = (taskId) => {
    // Użyj globalnej funkcji z Dashboard do nawigacji do zadania
    if (window.navigateToChecklist) {
      window.navigateToChecklist(taskId);
    }
    // Zamykamy modal po przejściu do zadania
    setIsModalOpen(false);
  };

  // Funkcja do tworzenia nowej listy dla zadania
  const createNewListForTask = (taskId) => {
    // Użyj globalnej funkcji z Dashboard do tworzenia nowej listy
    if (window.createChecklistForTask) {
      window.createChecklistForTask(taskId);
    }
    // Zamykamy modal po tworzeniu nowej listy
    setIsModalOpen(false);
  };

  // Funkcja do obsługi kliknięcia w dzień
  const handleDayClick = (day) => {
    const dayTasks = getTasksForDay(day);
    setSelectedDay(day);
    setSelectedDayTasks(dayTasks);
    setIsModalOpen(true);
    setIsAddingTask(false); // Reset stanu dodawania przy otwieraniu modala
  };

  // Funkcja do dodawania nowego zadania
  const addNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(), // Prosta implementacja unikalnego ID
      title: newTaskTitle,
      description: newTaskDescription,
      date: formatDate(currentYear, currentMonth, selectedDay),
      priority: newTaskPriority
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setSelectedDayTasks([...selectedDayTasks, newTask]);
    
    // Reset formularza
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('Średni');
    setIsAddingTask(false);
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
    setCurrentDate(new Date(newYear, newMonth, 1));
  };

  // Funkcja do zmiany roku
  const changeYear = (increment) => {
    const newYear = currentYear + increment;
    setCurrentYear(newYear);
    setCurrentDate(new Date(newYear, currentMonth, 1));
  };

  // Funkcja zwracająca kolor dla priorytetu
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Krytyczny': return 'bg-red-500';
      case 'Wysoki': return 'bg-orange-500';
      case 'Średni': return 'bg-yellow-500';
      case 'Niski': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Nazwy dni tygodnia
  const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

  // Nazwy miesięcy
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const priorityOptions = ['Niski', 'Średni', 'Wysoki', 'Krytyczny'];

  return (
    <div className="px-6 pt-4">
      {/* Nagłówek */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Kalendarz <span className="text-primary">miesięczny</span>
        </h1>
        <p className="text-gray-400 mt-1">
          Przeglądaj kalendarz i znajdź interesujące daty
        </p>
      </header>

      <div className="flex justify-between gap-8">
        <div className="w-4/5">
          {/* Kontrolery kalendarza */}
          <div className="flex mb-6 gap-4">
            <div className="flex items-center bg-dark-300/80 rounded-lg p-1.5 border border-dark-100">
              <button className="p-2 rounded-lg">
                <CalendarIcon size={18} className="text-primary" />
              </button>
              
              <button 
                className="p-1.5 mx-1 rounded-lg hover:bg-dark-200/70"
                onClick={() => changeYear(-1)}
              >
                <ChevronLeft size={16} className="text-gray-400" />
              </button>
              
              <div className="text-white font-medium mx-2 min-w-[60px] text-center">
                {currentYear}
              </div>
              
              <button 
                className="p-1.5 mx-1 rounded-lg hover:bg-dark-200/70"
                onClick={() => changeYear(1)}
              >
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex items-center bg-dark-300/80 rounded-lg p-1.5 border border-dark-100">
              <button 
                className="p-1.5 mx-1 rounded-lg hover:bg-dark-200/70"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={16} className="text-gray-400" />
              </button>
              
              <div className="text-white font-medium mx-3 min-w-[100px] text-center">
                {monthNames[currentMonth]}
              </div>
              
              <button 
                className="p-1.5 mx-1 rounded-lg hover:bg-dark-200/70"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Kalendarz */}
          <div className="grid grid-cols-7 overflow-hidden rounded-[2rem] border border-primary/30 bg-dark-300/90">
            {/* Nagłówki dni tygodnia */}
            {weekDays.map((day, index) => (
              <div 
                key={day} 
                className={`text-center text-gray-400 font-medium text-lg py-3 border-b border-primary/30 
                ${index < 6 ? 'border-r border-primary/30' : ''}`}
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
                const isLastInRow = (i + 1) % 7 === 0;
                const isInLastRow = i >= totalCells - 7;
                
                if (day > 0 && day <= daysInMonth) {
                  // Pobieranie zadań dla tego dnia
                  const dayTasks = getTasksForDay(day);
                  const isCurrentDay = isToday(day);
                  
                  // Komórka z dniem
                  days.push(
                    <div 
                      key={`day-${day}`}
                      className={`h-24 flex flex-col relative text-white cursor-pointer
                        ${isLastInRow ? '' : 'border-r'} 
                        ${isInLastRow ? '' : 'border-b'} 
                        border-primary/30
                        ${isCurrentDay ? 'bg-primary/30' : 'hover:bg-dark-200/30'}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className={`absolute top-2 left-2.5 ${isCurrentDay ? 'text-xl font-medium text-primary' : 'text-xl'}`}>
                        {day}
                      </div>
                      
                      {/* Lista zadań */}
                      <div className="mt-9 px-1.5 overflow-y-auto flex-1 space-y-1">
                        {dayTasks.map((task, index) => (
                          index < 3 && (
                            <div 
                              key={task.id}
                              className="text-xs py-1 px-1.5 rounded cursor-pointer hover:bg-dark-200/80 flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToTask(task.id);
                              }}
                            >
                              <div className="w-4 h-4 min-w-4 flex items-center justify-center mr-1.5 text-primary">
                                <CheckSquare size={12} />
                              </div>
                              <span className="truncate text-white/90">{task.title}</span>
                            </div>
                          )
                        ))}
                        
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-400 mt-0.5 pl-1">
                            +{dayTasks.length - 3} więcej...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  // Pusta komórka
                  days.push(
                    <div 
                      key={`empty-${i}`} 
                      className={`h-24
                        ${isLastInRow ? '' : 'border-r'} 
                        ${isInLastRow ? '' : 'border-b'} 
                        border-primary/30`}
                    ></div>
                  );
                }
              }
              
              return days;
            })()}
          </div>
        </div>
        
        {/* Informacja o dzisiejszej dacie i nadchodzących zadaniach */}
        <div className="w-1/5">
          <div className="bg-dark-300/90 backdrop-blur-sm rounded-xl p-6 border border-dark-100 mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Dzisiejsza data
            </h3>
            <p className="text-gray-300">
              {new Date().toLocaleDateString('pl-PL', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
              })}
            </p>
          </div>
          
          <div className="bg-dark-300/90 backdrop-blur-sm rounded-xl p-6 border border-dark-100">
            <h3 className="text-xl font-semibold text-white mb-4">
              Najbliższe zadania
            </h3>
            
            {tasks
              .filter(task => new Date(task.date) >= new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 3)
              .map(task => (
                <div 
                  key={task.id}
                  className="mb-3 p-3 bg-dark-200/80 rounded cursor-pointer hover:bg-dark-100/50 border-l-2 border-opacity-80"
                  style={{ borderLeftColor: getPriorityColor(task.priority).replace('bg-', '') }}
                  onClick={() => navigateToTask(task.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium">{task.title}</div>
                      <div className="text-xs mt-1 text-gray-400 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(task.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} bg-opacity-20 text-white`}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))
            }
            
            {tasks.length === 0 && (
              <p className="text-gray-400 text-center">Brak nadchodzących zadań</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal z zadaniami dla wybranego dnia */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div 
            className="bg-dark-300/95 w-full max-w-3xl rounded-xl border border-primary/30 shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-primary/30 bg-dark-200/50">
              <h2 className="text-xl font-semibold text-white">
                Zadania na {selectedDay} {monthNames[currentMonth]} {currentYear}
              </h2>
              <button 
                className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-dark-200/80"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {!isAddingTask ? (
                <>
                  {/* Lista zadań */}
                  {selectedDayTasks.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedDayTasks.map(task => (
                        <div 
                          key={task.id}
                          className="p-4 bg-dark-200/80 rounded-lg hover:bg-dark-100/50 border-l-2 border-opacity-80 transition-all"
                          style={{ borderLeftColor: getPriorityColor(task.priority).replace('bg-', '') }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className="mt-1 mr-3 text-primary">
                                <CheckSquare size={16} />
                              </div>
                              <div>
                                <div className="text-white font-medium text-base">{task.title}</div>
                                {task.description && (
                                  <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                                )}
                              </div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} bg-opacity-20 text-white whitespace-nowrap ml-4`}>
                              {task.priority}
                            </div>
                          </div>
                          
                          <div className="flex mt-3 gap-2 justify-end">
                            <button 
                              className="text-xs flex items-center px-2 py-1 bg-dark-300/70 text-gray-300 hover:text-white rounded transition-colors"
                              onClick={() => createNewListForTask(task.id)}
                            >
                              <ListPlus size={12} className="mr-1 text-primary" />
                              Nowa lista
                            </button>
                            <button 
                              className="text-xs flex items-center px-2 py-1 bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors"
                              onClick={() => navigateToTask(task.id)}
                            >
                              <ArrowRight size={12} className="mr-1" />
                              Przejdź do zadania
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <div className="flex justify-center mb-3 text-gray-500">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-gray-400">Brak zadań na ten dzień</p>
                    </div>
                  )}
                  
                  {/* Przycisk do dodawania zadania */}
                  <button 
                    className="mt-2 flex items-center justify-center w-full p-3 bg-dark-200/80 hover:bg-dark-100/70 text-primary rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingTask(true);
                    }}
                  >
                    <Plus size={16} className="mr-2" />
                    <span>Dodaj nowe zadanie</span>
                  </button>
                </>
              ) : (
                /* Formularz dodawania zadania */
                <div className="bg-dark-200/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-4">Nowe zadanie</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Tytuł zadania</label>
                      <input
                        type="text"
                        id="title"
                        className="w-full bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Wprowadź tytuł zadania"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Opis (opcjonalnie)</label>
                      <textarea
                        id="description"
                        className="w-full bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        placeholder="Dodaj opis zadania"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">Priorytet</label>
                      <select
                        id="priority"
                        className="w-full bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value)}
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6 space-x-3">
                    <button 
                      className="px-4 py-2 bg-dark-300 text-gray-300 hover:text-white rounded-lg transition-colors"
                      onClick={() => setIsAddingTask(false)}
                    >
                      Anuluj
                    </button>
                    <button 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={addNewTask}
                      disabled={!newTaskTitle.trim()}
                    >
                      Dodaj zadanie
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-primary/30 bg-dark-200/50 flex justify-end">
              <button 
                className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Zamknij
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 