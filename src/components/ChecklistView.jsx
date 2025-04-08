import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  CheckSquare,
  X,
  AlertCircle,
  Link2,
  Calendar,
  Filter,
  Clock,
  ListChecks,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  ArrowUp,
  Pencil,
  GripVertical,
  ArrowLeft
} from 'lucide-react';

const ChecklistView = ({ selectedTaskId = null }) => {
  // Stany
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(selectedTaskId ? 'assigned' : 'all');
  const [showListModal, setShowListModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [deleteListId, setDeleteListId] = useState(null);
  const [newListText, setNewListText] = useState('');
  const [expandedListId, setExpandedListId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // Do zarządzania widokiem zadania używamy jednego stanu z wyraźnie określonym typem
  const [activeTaskId, setActiveTaskId] = useState(
    selectedTaskId ? Number(selectedTaskId) : null
  );
  
  // Referencje
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const titleInputRef = useRef(null);
  const newItemInputRef = useRef(null);

  // Inicjalizacja stanu na podstawie przekazanego id zadania
  useEffect(() => {
    if (selectedTaskId) {
      setActiveTaskId(Number(selectedTaskId));
      setSelectedFilter('assigned');
    }
  }, [selectedTaskId]);

  // Hook zamykający menu i modalne okna po kliknięciu na zewnątrz
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && showListModal) {
        // Nie zamykamy modalu przy kliknięciu na zewnątrz
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target) && showDeleteModal) {
        setShowDeleteModal(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showListModal, showDeleteModal]);

  // Focus na polu wprowadzania tytułu po otwarciu edycji
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  // Autofocus na nowym polu po otwarciu modala
  useEffect(() => {
    if (showListModal && newItemInputRef.current && !currentList?.items.length) {
      setTimeout(() => {
        newItemInputRef.current.focus();
      }, 300);
    }
  }, [showListModal, currentList]);

  // Przykładowe dane zadań
  const [tasks] = useState([
    { 
      id: 1, 
      title: 'Przygotowanie prezentacji dla klienta', 
      deadline: '2023-12-01', 
      priority: 'Wysoki', 
      status: 'in-progress',
    },
    { 
      id: 2, 
      title: 'Analiza danych z ostatniego kwartału', 
      deadline: '2023-11-30', 
      priority: 'Średni', 
      status: 'to-do',
    },
    { 
      id: 3, 
      title: 'Aktualizacja dokumentacji projektu', 
      deadline: '2023-11-25', 
      priority: 'Niski', 
      status: 'to-do',
    },
    { 
      id: 4, 
      title: 'Poprawa błędów w aplikacji', 
      deadline: '2023-11-20', 
      priority: 'Krytyczny', 
      status: 'in-progress',
    },
  ]);

  // Przykładowe dane list checklisty
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

  // Pomocnik: konwersja taskId do liczby lub null
  const normalizeTaskId = (id) => {
    return id === null || id === undefined || id === 'null' ? null : Number(id);
  };

  // Filtrowanie list
  const getFilteredLists = () => {
    // Jeśli aktywne jest zadanie, pokazujemy tylko jego listy
    if (activeTaskId !== null) {
      return checklistLists.filter(list => {
        const listTaskId = normalizeTaskId(list.taskId);
        return listTaskId === activeTaskId;
      });
    }
    
    // W przeciwnym razie filtrujemy według wybranych filtrów
    return checklistLists.filter(list => {
      const listTaskId = normalizeTaskId(list.taskId);
      
      // Filtrowanie według przypisania do zadania
      if (selectedFilter === 'assigned' && listTaskId === null) return false;
      if (selectedFilter === 'unassigned' && listTaskId !== null) return false;
      
      // Filtrowanie według wyszukiwania
      if (searchValue && !list.title.toLowerCase().includes(searchValue.toLowerCase()) && 
          !list.items.some(item => item.text.toLowerCase().includes(searchValue.toLowerCase()))) {
        return false;
      }
      
      return true;
    });
  };

  // Pobranie przefiltrowanych list
  const filteredLists = getFilteredLists();

  // Formatowanie daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Tworzenie nowej pustej listy
  const createNewList = (taskId = null) => {
    const normalizedTaskId = normalizeTaskId(taskId);
    let title = 'Nowa lista';
    
    if (normalizedTaskId !== null) {
      const task = tasks.find(t => t.id === normalizedTaskId);
      if (task) {
        title = `Lista dla ${task.title}`;
      }
    }
    
    const newList = {
      id: checklistLists.length > 0 ? Math.max(...checklistLists.map(list => list.id)) + 1 : 1,
      title: title,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      taskId: normalizedTaskId,
      items: []
    };
    
    setCurrentList(newList);
    setIsEditingTitle(true);
    setNewListTitle(newList.title);
    setShowListModal(true);
  };

  // Pobieranie zadania po ID
  const getTaskById = (taskId) => {
    if (taskId === null) return null;
    return tasks.find(task => task.id === Number(taskId));
  };

  // Pobieranie list dla zadania
  const getListsForTask = (taskId) => {
    if (taskId === null) return [];
    const normalizedTaskId = Number(taskId);
    return checklistLists.filter(list => normalizeTaskId(list.taskId) === normalizedTaskId);
  };

  // Przełączanie widoku na zadanie
  const showTaskView = (taskId) => {
    setActiveTaskId(Number(taskId));
  };

  // Powrót do widoku wszystkich list
  const backToAllLists = () => {
    setActiveTaskId(null);
  };

  // Otwieranie istniejącej listy
  const openList = (list) => {
    setCurrentList({...list, items: [...list.items]});
    setShowListModal(true);
    setIsEditingTitle(false);
    setNewListTitle(list.title);
  };

  // Zapisywanie listy
  const saveList = () => {
    const listToSave = {
      ...currentList,
      title: newListTitle || 'Nowa lista',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (checklistLists.some(list => list.id === listToSave.id)) {
      // Aktualizacja istniejącej listy
      setChecklistLists(checklistLists.map(list => 
        list.id === listToSave.id ? listToSave : list
      ));
    } else {
      // Dodanie nowej listy
      setChecklistLists([...checklistLists, listToSave]);
    }

    closeListModal();
  };

  // Zamykanie modalu listy
  const closeListModal = () => {
    setShowListModal(false);
    setCurrentList(null);
    setNewItemText('');
    setIsEditingTitle(false);
  };

  // Inicjowanie usuwania listy
  const initiateDeleteList = (listId) => {
    setDeleteListId(listId);
    setShowDeleteModal(true);
  };

  // Usuwanie listy
  const deleteList = () => {
    if (deleteListId) {
      setChecklistLists(checklistLists.filter(list => list.id !== deleteListId));
      setShowDeleteModal(false);
      setDeleteListId(null);
      
      if (currentList && currentList.id === deleteListId) {
        closeListModal();
      }
    }
  };

  // Przypisywanie listy do zadania
  const assignListToTask = (taskId) => {
    setCurrentList({
      ...currentList,
      taskId: taskId === 'none' ? null : normalizeTaskId(taskId),
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Dodawanie nowego elementu do listy
  const addNewItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: currentList.items.length > 0 ? Math.max(...currentList.items.map(item => item.id)) + 1 : 1,
      text: newItemText,
      completed: false
    };
    
    setCurrentList({
      ...currentList,
      items: [...currentList.items, newItem],
      updatedAt: new Date().toISOString().split('T')[0]
    });
    
    setNewItemText('');
    
    if (newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  };

  // Usuwanie elementu z listy
  const removeItemFromList = (itemId) => {
    setCurrentList({
      ...currentList,
      items: currentList.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Przełączanie stanu ukończenia elementu
  const toggleItemCompletion = (itemId) => {
    setCurrentList({
      ...currentList,
      items: currentList.items.map(item => 
        item.id === itemId ? {...item, completed: !item.completed} : item
      ),
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Aktualizacja kolejności elementów
  const updateItemsOrder = (newOrder) => {
    setCurrentList({
      ...currentList,
      items: newOrder,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Edycja tekstu elementu
  const updateItemText = (itemId, newText) => {
    if (!newText.trim()) return;
    
    setCurrentList({
      ...currentList,
      items: currentList.items.map(item => 
        item.id === itemId ? {...item, text: newText} : item
      ),
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Pobieranie powiązanego zadania
  const getRelatedTask = (taskId) => {
    if (!taskId) return null;
    return tasks.find(task => task.id === Number(taskId));
  };

  // Funkcja licząca ukończone elementy w liście
  const getCompletedItemsCount = (list) => {
    if (!list || !list.items || list.items.length === 0) return 0;
    return list.items.filter(item => item.completed).length;
  };

  // Funkcja obliczająca procent ukończonych elementów
  const getListProgress = (list) => {
    if (!list || !list.items || list.items.length === 0) return 0;
    const completedCount = getCompletedItemsCount(list);
    return Math.round((completedCount / list.items.length) * 100);
  };

  // Obsługa klawisza Enter w polu nowego elementu
  const handleNewItemKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewItem();
    }
  };

  // Obsługa klawisza Enter w polu tytułu
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditingTitle(false);
    }
  };

  // Toggle the expanded state for adding a new item
  const toggleListExpand = (listId) => {
    // Make sure we're working with numbers for proper comparison
    const numericListId = Number(listId);
    const numericExpandedId = expandedListId !== null ? Number(expandedListId) : null;
    
    // If we're expanding a list different from the currently expanded one
    if (numericExpandedId !== numericListId) {
      setExpandedListId(numericListId);
    } else {
      // If it's the same list, toggle it
      setExpandedListId(null);
    }
    
    // Reset text and editing states when toggling
    setNewListText('');
    setEditingItemId(null);
  };

  // Edit an item in a specific list
  const editItemInList = (listId, itemId) => {
    // Make sure we're working with numbers
    const numericListId = Number(listId);
    const numericItemId = Number(itemId);
    
    // Get the list and item to edit
    const listToEdit = checklistLists.find(list => list.id === numericListId);
    if (!listToEdit) return;
    
    // If itemId is provided, we're editing an existing item
    if (numericItemId) {
      const itemToEdit = listToEdit.items.find(item => item.id === numericItemId);
      if (itemToEdit) {
        // Set the text to edit mode
        setNewListText(itemToEdit.text);
        setEditingItemId(numericItemId);
      }
    }
  };

  // Save the edited item
  const saveEditedItem = (listId, itemId) => {
    // Make sure we're working with numbers
    const numericListId = Number(listId);
    const numericItemId = Number(itemId);
    
    // Only update if we have a valid item text
    if (newListText.trim()) {
      setChecklistLists(checklistLists.map(list => {
        if (list.id === numericListId) {
          return {
            ...list,
            items: list.items.map(item => 
              item.id === numericItemId ? {...item, text: newListText} : item
            ),
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return list;
      }));
    }
    
    // Reset the editing state
    setNewListText('');
    setEditingItemId(null);
  };

  // Remove an item from a specific list
  const removeItemFromSpecificList = (listId, itemId) => {
    // Make sure we're working with numbers
    const numericListId = Number(listId);
    const numericItemId = Number(itemId);
    
    setChecklistLists(checklistLists.map(list => {
      if (list.id === numericListId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== numericItemId),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return list;
    }));
  };

  // Toggle completion of an item in a specific list
  const toggleItemInList = (listId, itemId) => {
    // Make sure we're working with numbers
    const numericListId = Number(listId);
    const numericItemId = Number(itemId);
    
    setChecklistLists(checklistLists.map(list => {
      if (list.id === numericListId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === numericItemId ? {...item, completed: !item.completed} : item
          ),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return list;
    }));
  };

  // Add new item to a specific list
  const addItemToList = (listId) => {
    if (!newListText.trim()) return;
    
    const numericListId = Number(listId);
    
    setChecklistLists(checklistLists.map(list => {
      if (list.id === numericListId) {
        const newItem = {
          id: list.items.length > 0 ? Math.max(...list.items.map(item => item.id)) + 1 : 1,
          text: newListText,
          completed: false
        };
        
        return {
          ...list,
          items: [...list.items, newItem],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return list;
    }));
    
    setNewListText('');
    // Close the input field after adding an item
    setExpandedListId(null);
  };

  // Handle keydown in the new item input field
  const handleListItemKeyDown = (e, listId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemToList(listId);
    } else if (e.key === 'Escape') {
      setExpandedListId(null);
      setNewListText('');
    }
  };

  // Handle keydown for editing
  const handleEditKeyDown = (e, listId, itemId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditedItem(listId, itemId);
    } else if (e.key === 'Escape') {
      setNewListText('');
      setEditingItemId(null);
    }
  };

  // Edit the title of a list
  const startTitleEdit = (listId, currentTitle) => {
    setEditingTitleId(listId);
    setEditingTitle(currentTitle);
  };

  // Save the edited title
  const saveTitleEdit = (listId) => {
    if (!editingTitle.trim()) return;
    
    setChecklistLists(checklistLists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          title: editingTitle,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return list;
    }));
    
    setEditingTitleId(null);
    setEditingTitle('');
  };

  // Handle blur for title edit
  const handleTitleBlur = (listId) => {
    saveTitleEdit(listId);
  };

  // Handle blur for item input
  const handleItemInputBlur = (listId) => {
    const numericListId = Number(listId);
    
    if (newListText.trim()) {
      addItemToList(numericListId);
    } else {
      setExpandedListId(null);
    }
  };

  // Handle keydown for title edit
  const handleTitleEditKeyDown = (e, listId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitleEdit(listId);
    } else if (e.key === 'Escape') {
      setEditingTitleId(null);
      setEditingTitle('');
    }
  };

  // Renderowanie kafelka listy
  const renderListTile = (list) => {
    const progress = getListProgress(list);
    const relatedTask = getRelatedTask(list.taskId);
    // Ensure we're comparing numbers
    const isExpanded = Number(expandedListId) === Number(list.id);
    const isEditingThisTitle = Number(editingTitleId) === Number(list.id);
    
    return (
      <motion.div
        key={list.id}
        className="bg-dark-100 rounded-lg border border-dark-100/50 shadow-md overflow-visible w-[275px] flex flex-col relative"
        style={{ height: 'auto' }}
        whileHover={{ y: -3, boxShadow: "0 6px 16px -4px rgba(0, 0, 0, 0.3)" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 pb-10 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-3">
            {isEditingThisTitle ? (
              <input
                type="text"
                className="flex-grow bg-dark-200/70 border border-dark-200 rounded px-2 py-1 text-white text-lg focus:outline-none focus:ring-1 focus:ring-primary"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => handleTitleEditKeyDown(e, list.id)}
                onBlur={() => handleTitleBlur(list.id)}
                autoFocus
              />
            ) : (
              <h3 className="font-medium text-white text-lg line-clamp-1">{list.title}</h3>
            )}
            <div className="flex items-center">
              <button 
                className="text-gray-400 hover:text-white p-1 rounded-full mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  startTitleEdit(list.id, list.title);
                }}
              >
                <Edit size={14} />
              </button>
              <button 
                className="text-gray-400 hover:text-white p-1 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  initiateDeleteList(list.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex-grow">
            <ul className="text-sm text-gray-300 space-y-2">
              {list.items.map((item, index) => {
                // Check if this specific item is being edited
                const isEditingThisItem = Number(editingItemId) === Number(item.id);
                
                return (
                  <li key={index} className="flex items-center py-1 group">
                    <button 
                      className="mr-2 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemInList(list.id, item.id);
                      }}
                    >
                      {item.completed ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <Circle size={20} className="text-gray-400" />
                      )}
                    </button>
                    
                    {isEditingThisItem ? (
                      <div className="flex-grow flex items-center bg-dark-200/50 rounded px-2">
                        <input
                          type="text"
                          className="flex-grow bg-transparent border-none py-1 focus:outline-none focus:ring-0 text-white"
                          value={newListText}
                          onChange={(e) => setNewListText(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, list.id, item.id)}
                          onBlur={() => saveEditedItem(list.id, item.id)}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <span 
                          className={`flex-grow text-base ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemInList(list.id, item.id);
                          }}
                        >
                          {item.text}
                        </span>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="text-gray-400 hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              editItemInList(list.id, item.id);
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItemFromSpecificList(list.id, item.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
              {list.items.length === 0 && (
                <li className="text-gray-400 italic py-2 text-center">
                  Lista jest pusta
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-10">
            <div className="flex items-center bg-dark-200 border border-dark-200/80 rounded-md overflow-hidden">
              <input
                type="text"
                className="flex-grow bg-transparent border-none py-2 px-3 focus:outline-none focus:ring-0 text-white placeholder-gray-500 text-sm"
                placeholder="Wpisz nowy element..."
                value={newListText}
                onChange={(e) => setNewListText(e.target.value)}
                onKeyDown={(e) => handleListItemKeyDown(e, list.id)}
                onBlur={() => handleItemInputBlur(list.id)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
        )}
        
        {/* Centered plus button that sits on the bottom edge */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              toggleListExpand(list.id);
            }}
          >
            <Plus size={22} />
          </button>
        </div>
      </motion.div>
    );
  };

  // Renderowanie kafelka zadania
  const renderTaskTile = (task) => {
    const listsForTask = getListsForTask(task.id);
    const hasLists = listsForTask.length > 0;
    
    return (
      <motion.div
        key={task.id}
        className="bg-dark-200 rounded-lg border border-dark-200/90 shadow-lg overflow-hidden w-full flex flex-col"
        whileHover={{ y: -3, boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.3)" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4 flex justify-between items-start">
          <div>
            <h3 className="font-medium text-white text-lg mb-1">{task.title}</h3>
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(task.deadline)}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                task.priority === 'Wysoki' || task.priority === 'Krytyczny' 
                  ? 'bg-red-500/20 text-red-400' 
                  : task.priority === 'Średni' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-green-500/20 text-green-400'
              }`}>
                {task.priority}
              </span>
            </div>
            
            {hasLists ? (
              <div className="text-sm text-primary/90 flex items-center">
                <ListChecks size={14} className="mr-1" />
                <span>Liczba list: {listsForTask.length}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex items-center">
                <ListChecks size={14} className="mr-1" />
                <span>Brak list</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {hasLists && (
              <motion.button
                className="flex items-center bg-dark-300 hover:bg-dark-400 text-white px-3 py-1 rounded-md text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => showTaskView(task.id)}
              >
                <ListChecks size={14} className="mr-1" />
                <span>Pokaż checklistę</span>
              </motion.button>
            )}
            <motion.button
              className="flex items-center bg-primary/80 hover:bg-primary text-white px-3 py-1 rounded-md text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => createNewList(task.id)}
            >
              <Plus size={14} className="mr-1" />
              <span>Dodaj listę</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Renderowanie widoku zadania
  const renderTaskView = () => {
    const task = getTaskById(activeTaskId);
    if (!task) {
      return (
        <div className="text-center py-10">
          <div className="text-gray-400">
            <p>Zadanie nie zostało znalezione lub zostało usunięte.</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
              onClick={backToAllLists}
            >
              Powrót do list
            </button>
          </div>
        </div>
      );
    }
    
    // Listy dla zadania są już przefiltrowane przez getFilteredLists
    const listsForTask = filteredLists;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button 
            className="text-gray-400 hover:text-white flex items-center mr-4"
            onClick={backToAllLists}
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Powrót</span>
          </button>
          <h1 className="text-2xl font-bold text-white">{task.title}</h1>
        </div>
        
        <div className="bg-dark-100/30 rounded-xl p-4 flex justify-between">
          <div className="flex space-x-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Termin</div>
              <div className="text-white flex items-center">
                <Calendar size={16} className="mr-2 text-primary" />
                {formatDate(task.deadline)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Priorytet</div>
              <div className={`flex items-center ${
                task.priority === 'Wysoki' || task.priority === 'Krytyczny' 
                  ? 'text-red-400' 
                  : task.priority === 'Średni' 
                    ? 'text-yellow-400' 
                    : 'text-green-400'
              }`}>
                <span className="font-medium">{task.priority}</span>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">Status</div>
              <div className="text-white">
                {task.status === 'in-progress' ? 'W trakcie' : 'Do zrobienia'}
              </div>
            </div>
          </div>
          
          <motion.button
            className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => createNewList(task.id)}
          >
            <Plus size={18} className="mr-2" />
            <span>Nowa lista dla zadania</span>
          </motion.button>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ListChecks size={20} className="mr-2 text-primary" />
            Listy zadania
          </h2>
          
          {listsForTask.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listsForTask.map(list => renderListTile(list))}
            </div>
          ) : (
            <div className="bg-dark-100/30 rounded-xl p-6 text-center">
              <ListChecks size={40} className="text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">Brak list dla tego zadania</h3>
              <p className="text-gray-400 mb-4">
                Dodaj nową listę, aby uporządkować pracę nad zadaniem
              </p>
              <motion.button
                className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createNewList(task.id)}
              >
                <Plus size={18} className="mr-2" />
                <span>Nowa lista</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderowanie komponentu głównego
  return (
    <div className="w-full">
      {activeTaskId !== null ? (
        renderTaskView()
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Moje Listy</h1>
            <div className="flex space-x-3">
              <div className="relative">
                <select
                  className="appearance-none bg-dark-200 hover:bg-dark-100 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Wszystkie listy</option>
                  <option value="assigned">Przypisane do zadań</option>
                  <option value="unassigned">Osobiste</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
              </div>
              
              <motion.button
                className="flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createNewList()}
              >
                <Plus size={18} className="mr-2" />
                <span>Nowa lista</span>
              </motion.button>
            </div>
          </div>

          {/* Pasek wyszukiwania */}
          <div className="bg-dark-100/50 backdrop-blur-sm rounded-xl border border-dark-100/80 shadow-lg p-4 mb-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full bg-dark-200 border border-dark-100 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Szukaj list..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Zadania - widoczne tylko gdy filtr ustawiony na "assigned" */}
          {selectedFilter === 'assigned' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckSquare size={20} className="mr-2 text-primary" />
                Zadania
              </h2>
              <div className="space-y-4">
                {tasks.map(task => renderTaskTile(task))}
              </div>
            </div>
          )}

          {/* Lista kafelków */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ListChecks size={20} className="mr-2 text-primary" />
              Listy {selectedFilter === 'assigned' ? 'przypisane do zadań' : 
                     selectedFilter === 'unassigned' ? 'osobiste' : ''}
            </h2>
            
            {filteredLists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredLists.map(list => renderListTile(list))}
              </div>
            ) : (
              <div className="text-center py-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400"
                >
                  <div className="mb-4 flex justify-center">
                    <ListChecks size={48} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-1">Brak list</h3>
                  <p className="text-gray-400">
                    {searchValue ? "Nie znaleziono list pasujących do wyszukiwania" : "Dodaj nową listę, aby rozpocząć"}
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal edytora listy */}
      <AnimatePresence>
        {showListModal && currentList && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <motion.div
              ref={modalRef}
              className="bg-dark-100 rounded-xl border border-dark-100/80 shadow-2xl w-[800px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Nagłówek modalu */}
              <div className="flex justify-between items-center border-b border-dark-200 p-4">
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    className="text-xl font-bold text-white bg-dark-200 border border-primary px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 w-full max-w-[400px]"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={handleTitleKeyDown}
                  />
                ) : (
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold text-white mr-2">{currentList.title}</h2>
                    <button 
                      className="text-gray-400 hover:text-white p-1 rounded-md"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <div>
                    <select
                      className="appearance-none bg-dark-200 hover:bg-dark-100 text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      value={currentList.taskId || 'none'}
                      onChange={(e) => assignListToTask(e.target.value)}
                    >
                      <option value="none">Lista osobista</option>
                      <optgroup label="Przypisz do zadania">
                        {tasks.map(task => (
                          <option key={task.id} value={task.id}>{task.title}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-500 p-1.5 bg-dark-200 rounded-md"
                    onClick={() => initiateDeleteList(currentList.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-white p-1.5 bg-dark-200 rounded-md"
                    onClick={closeListModal}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {/* Zawartość modalu */}
              <div className="flex-grow overflow-auto p-4">
                {/* Drag and drop lista elementów */}
                <Reorder.Group
                  axis="y"
                  values={currentList.items}
                  onReorder={updateItemsOrder}
                  className="space-y-2 mb-4"
                >
                  {currentList.items.map((item) => (
                    <Reorder.Item 
                      key={item.id} 
                      value={item}
                      className="bg-dark-200/70 rounded-md flex items-start p-3 border border-dark-100/50 group"
                      dragListener={false} // Wyłączamy domyślny drag na całym elemencie
                      layoutId={`item-${item.id}`}
                    >
                      <div className="cursor-move flex-shrink-0 mr-2 text-gray-500 hover:text-gray-300 mt-1 touch-none">
                        <GripVertical size={16} />
                      </div>
                      
                      <button 
                        className="flex-shrink-0 mr-2 mt-1"
                        onClick={(e) => toggleItemCompletion(item.id)}
                      >
                        {item.completed ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                          <Circle size={18} className="text-gray-500" />
                        )}
                      </button>
                      
                      <div className="flex-grow">
                        <input
                          type="text"
                          className={`w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 ${
                            item.completed ? 'text-gray-400 line-through' : 'text-white'
                          }`}
                          value={item.text}
                          onChange={(e) => updateItemText(item.id, e.target.value)}
                        />
                      </div>
                      
                      <button 
                        className="flex-shrink-0 ml-2 text-transparent group-hover:text-gray-400 hover:text-red-500"
                        onClick={() => removeItemFromList(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                
                {/* Dodawanie nowego elementu */}
                <div className="flex items-center bg-dark-200/30 border border-dark-100/30 rounded-md p-2">
                  <div className="mr-2 text-gray-500">
                    <Plus size={18} />
                  </div>
                  <input
                    ref={newItemInputRef}
                    type="text"
                    className="flex-grow bg-transparent border-none p-1 focus:outline-none focus:ring-0 text-white placeholder-gray-500"
                    placeholder="Dodaj nowy element..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleNewItemKeyDown}
                  />
                  <button
                    className="ml-2 px-3 py-1 bg-primary/80 hover:bg-primary text-white rounded-md text-sm"
                    onClick={addNewItem}
                  >
                    Dodaj
                  </button>
                </div>
              </div>
              
              {/* Stopka modalu */}
              <div className="bg-dark-200/50 p-3 flex justify-between items-center border-t border-dark-200">
                <div className="text-xs text-gray-400">
                  Ostatnia edycja: {formatDate(currentList.updatedAt)}
                </div>
                
                <button
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm"
                  onClick={saveList}
                >
                  Zapisz zmiany
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal potwierdzenia usunięcia */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <motion.div
              ref={deleteModalRef}
              className="bg-dark-100 rounded-xl border border-dark-100/80 shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
                  Czy na pewno chcesz usunąć tę listę? Wszystkie elementy zostaną trwale usunięte.
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
                    onClick={deleteList}
                  >
                    Usuń listę
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChecklistView; 