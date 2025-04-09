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
  ArrowLeft,
  CheckCircle,
  AlignLeft,
  Star,
  MoreVertical,
  Tag,
  Clock3,
  Trash
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

  // Add this state to track item and list relationships
  const [editingListId, setEditingListId] = useState(null);

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

  // Clean up states when closing the modal or changing lists
  const closeListModal = () => {
    setShowListModal(false);
    setCurrentList(null);
    setNewItemText('');
    setIsEditingTitle(false);
    setEditingItemId(null);
    setEditingListId(null);
    setExpandedListId(null);
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

  // Funkcja do rozwijania listy i dodawania nowego elementu
  const toggleListExpand = (listId) => {
    const clickedListId = Number(listId);
    
    // Jeśli klikamy na tę samą listę, zamykamy pole dodawania
    if (expandedListId === clickedListId) {
      setExpandedListId(null);
    } else {
      // W przeciwnym razie otwieramy pole dodawania dla wybranej listy
      setExpandedListId(clickedListId);
    }
    
    // Resetujemy wszystkie stany edycji
    setNewListText('');
    setEditingItemId(null);
    setEditingListId(null);
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
        setEditingListId(numericListId); // Track which list the item belongs to
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
    setEditingListId(null);
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

  // Dodawanie nowego elementu do listy
  const addItemToList = (listId) => {
    // Walidacja tekstu
    if (!newListText.trim()) return;
    
    const numericListId = Number(listId);
    
    // Wygeneruj unikalny ID dla nowego elementu
    const allItems = checklistLists.flatMap(list => list.items);
    const maxItemId = allItems.length > 0 ? Math.max(...allItems.map(item => item.id)) : 0;
    const newItemId = maxItemId + 1;
    
    // Aktualizacja listy
    setChecklistLists(checklistLists.map(list => {
      if (list.id === numericListId) {
        const newItem = {
          id: newItemId,
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
    
    // Resetujemy pole tekstowe, ale pozostawiamy listę rozwiniętą
    setNewListText('');
  };

  // Handle keydown in the new item input field
  const handleListItemKeyDown = (e, listId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemToList(listId);
    } else if (e.key === 'Escape') {
      setExpandedListId(null);
      setNewListText('');
      setEditingItemId(null);
      setEditingListId(null);
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
      setEditingListId(null);
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
    // Nie robimy nic przy utracie fokusa, aby użytkownik mógł kliknąć przycisk "Dodaj"
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

  // Renderowanie płytki listy
  const renderListTile = (list) => {
    // Obliczanie procentu ukończenia zadań
    const totalItems = list.items.length;
    const completedItems = list.items.filter(item => item.completed).length;
    const completionPercentage = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100) 
      : 0;
    
    // Znajdowanie powiązanego zadania
    const relatedTask = tasks.find(task => task.id === list.taskId);
    
    return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow transition-all hover:shadow-md"
      >
        {/* Nagłówek listy */}
        <div className="p-4 bg-indigo-600">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-white truncate pr-2">{list.title}</h3>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 hover:bg-indigo-500/40 rounded-full text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  editItemInList(list.id, null);
                }}
              >
                <Pencil size={15} />
              </button>
              <button
                className="p-1.5 hover:bg-indigo-500/40 rounded-full text-white/80 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  initiateDeleteList(list.id);
                }}
              >
                <Trash size={15} />
              </button>
            </div>
          </div>
          
          {/* Pasek postępu */}
          <div className="flex items-center">
            <div className="w-full bg-indigo-800 rounded-full h-2 mr-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-white font-medium">
              {completionPercentage}%
            </span>
          </div>
        </div>
        
        {/* Treść listy */}
        <div className="p-4">
          {/* Informacja o zadaniu, jeśli istnieje */}
          {relatedTask && (
            <div className="bg-gray-700/50 rounded-lg p-2 mb-3 flex items-center text-sm text-gray-300">
              <Link2 size={14} className="mr-2 text-indigo-400" />
              <span className="truncate">Przypisano do: {relatedTask.title}</span>
            </div>
          )}
          
          {/* Lista elementów */}
          <div className="space-y-2 mb-3">
            {list.items.slice(0, 3).map(item => (
              <div 
                key={item.id} 
                className="flex items-center gap-2"
              >
                {item.completed ? (
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-gray-400 flex-shrink-0" />
                )}
                <span 
                  className={`text-sm truncate ${
                    item.completed ? 'line-through text-gray-500' : 'text-gray-300'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
            
            {list.items.length > 3 && (
              <div className="text-xs text-gray-400 italic">
                +{list.items.length - 3} więcej elementów
              </div>
            )}
            
            {list.items.length === 0 && (
              <div className="text-center py-2 text-sm text-gray-500 italic">
                Lista jest pusta
              </div>
            )}
          </div>
          
          {/* Przycisk otwierania listy */}
          <button
            className="mt-2 w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm rounded-lg flex items-center justify-center gap-1"
            onClick={() => openList(list)}
          >
            <AlignLeft size={14} />
            <span>Otwórz listę</span>
          </button>
        </div>
      </div>
    );
  };

  // Renderowanie widoku zadania
  const renderTaskView = () => {
    const task = getTaskById(activeTaskId);
    if (!task) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Zadanie nie znalezione</h3>
            <p className="text-gray-500 mb-6">Zadanie nie zostało znalezione lub zostało usunięte.</p>
            <button 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-lg"
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
      <div className="container mx-auto py-8 px-4">
        {/* Nagłówek zadania */}
        <div className="flex flex-col md:flex-row md:items-center mb-8 gap-4">
          <button 
            className="flex items-center text-gray-500 hover:text-indigo-600 mr-4 transition-colors"
            onClick={backToAllLists}
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Powrót</span>
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(task.deadline)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock3 size={16} className="mr-1" />
                <span>{task.status === 'in-progress' ? 'W trakcie' : 'Do zrobienia'}</span>
              </div>
              
              <div className="flex items-center">
                <Tag size={16} className="mr-1" />
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  task.priority === 'Wysoki' || task.priority === 'Krytyczny' 
                    ? 'bg-red-100 text-red-700' 
                    : task.priority === 'Średni' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:ml-auto">
            <motion.button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => createNewList(task.id)}
            >
              <Plus size={16} />
              <span>Nowa lista zadań</span>
            </motion.button>
          </div>
        </div>
        
        {/* Listy zadań */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ListChecks size={20} className="mr-2 text-indigo-500" />
            Listy zadań
          </h2>
          
          {listsForTask.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listsForTask.map(list => renderListTile(list))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <ListChecks size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Brak list dla tego zadania</h3>
              <p className="text-gray-500 mb-6">
                Dodaj nową listę, aby skutecznie zarządzać tym zadaniem.
              </p>
              <motion.button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => createNewList(task.id)}
              >
                <Plus size={18} />
                <span>Utwórz nową listę</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Główny widok komponentu
  return (
    <div className="w-full bg-gray-900 min-h-screen">
      {activeTaskId !== null ? (
        // Widok dla konkretnego zadania
        renderTaskView()
      ) : (
        // Główny widok list
        <div className="container mx-auto py-6 px-4">
          {/* Nagłówek z tytułem i przyciskami */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Moje Listy</h1>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-48 focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-gray-400"
                  placeholder="Szukaj list..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Wszystkie listy</option>
                  <option value="assigned">Przypisane do zadań</option>
                  <option value="unassigned">Osobiste</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() => createNewList()}
              >
                <Plus size={16} />
                <span>Nowa lista</span>
              </button>
            </div>
          </div>
          
          {/* Wyświetlanie list */}
          {filteredLists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLists.map(list => renderListTile(list))}
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <ListChecks size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Brak list</h3>
              <p className="text-gray-400 mb-6">
                {searchValue ? 'Nie znaleziono list pasujących do kryteriów wyszukiwania.' : 'Nie masz jeszcze żadnych list. Utwórz swoją pierwszą listę, aby rozpocząć organizację zadań.'}
              </p>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 mx-auto"
                onClick={() => createNewList()}
              >
                <Plus size={18} />
                <span>Utwórz nową listę</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal do tworzenia/edycji listy */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            ref={modalRef}
          >
            <div className="px-5 py-4 bg-indigo-600 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {currentList?.id ? 'Edytuj listę' : 'Nowa lista'}
              </h3>
              <button 
                className="text-white/80 hover:text-white p-1.5 hover:bg-indigo-500/40 rounded-full"
                onClick={closeListModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <label htmlFor="listTitle" className="block text-sm font-medium text-gray-300 mb-1">Tytuł listy</label>
                <input
                  id="listTitle"
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white"
                  placeholder="Wprowadź tytuł..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  ref={titleInputRef}
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1">Przypisz do zadania</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white"
                  value={currentList?.taskId || 'none'}
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
              
              <div className="border-t border-gray-700 -mx-5 px-5 pt-4 mt-4">
                <h4 className="font-medium text-white mb-3">Elementy listy</h4>
                {currentList?.items && currentList.items.length > 0 ? (
                  <ul className="mb-4 max-h-56 overflow-y-auto space-y-2">
                    {currentList.items.map((item) => (
                      <li key={item.id} className="py-2 flex items-center gap-3 hover:bg-gray-700/30 px-2 rounded">
                        <button 
                          className="flex-shrink-0"
                          onClick={() => toggleItemCompletion(item.id)}
                        >
                          {item.completed ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <Circle size={20} className="text-gray-400" />
                          )}
                        </button>
                        <span className={`flex-grow ${item.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                          {item.text}
                        </span>
                        <button 
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => removeItemFromList(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">
                    Lista jest pusta
                  </p>
                )}
                
                <div className="flex items-center">
                  <input
                    type="text"
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white"
                    placeholder="Dodaj nowy element..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleNewItemKeyDown}
                    ref={newItemInputRef}
                  />
                  <button
                    className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg"
                    onClick={addNewItem}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg"
                  onClick={closeListModal}
                >
                  Anuluj
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                  onClick={saveList}
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal do usuwania listy */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            ref={deleteModalRef}
          >
            <div className="px-5 py-4 bg-red-600 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Usuń listę</h3>
              <button 
                className="text-white/80 hover:text-white p-1.5 hover:bg-red-500/40 rounded-full"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={22} className="text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Potwierdzenie usunięcia</h4>
                  <p className="text-gray-300">Czy na pewno chcesz usunąć tę listę? Tej operacji nie można cofnąć.</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Anuluj
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                  onClick={deleteList}
                >
                  Usuń
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistView; 