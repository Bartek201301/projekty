import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  X, 
  Filter, 
  Clock,
  GripVertical
} from 'lucide-react';

const ListaDoZrobienia = ({ selectedTaskId = null }) => {
  // Stany
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(selectedTaskId ? 'przypisane' : 'wszystkie');
  const [showListModal, setShowListModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [deleteListId, setDeleteListId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(selectedTaskId ? Number(selectedTaskId) : null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Referencje
  const modalRef = useRef(null);
  const deleteModalRef = useRef(null);
  const titleInputRef = useRef(null);
  const newItemInputRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Pusta lista do utworzenia nowej listy
  const emptyList = {
    id: null,
    title: 'Nowa lista',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    taskId: activeTaskId,
    items: []
  };

  // Dane list do zrobienia
  const [todoLists, setTodoLists] = useState([
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
      title: 'Plan tygodnia',
      createdAt: '2023-11-12',
      updatedAt: '2023-11-14',
      taskId: null,
      items: [
        { id: 1, text: 'Spotkanie z zespołem', completed: true },
        { id: 2, text: 'Prezentacja projektu', completed: true },
        { id: 3, text: 'Aktualizacja dokumentacji', completed: false },
        { id: 4, text: 'Code review', completed: false },
      ]
    }
  ]);

  // Efekty
  useEffect(() => {
    if (selectedTaskId) {
      setActiveTaskId(Number(selectedTaskId));
      setSelectedFilter('przypisane');
    }
  }, [selectedTaskId]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && showListModal) {
        // Nie zamykamy modalu przy kliknięciu na zewnątrz
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target) && showDeleteModal) {
        setShowDeleteModal(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target) && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showListModal, showDeleteModal, isFilterOpen]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (showListModal && newItemInputRef.current && !currentList?.items.length) {
      setTimeout(() => {
        newItemInputRef.current.focus();
      }, 300);
    }
  }, [showListModal, currentList]);

  // Funkcje pomocnicze
  const getFilteredLists = () => {
    switch (selectedFilter) {
      case 'przypisane':
        return todoLists.filter(list => list.taskId === activeTaskId);
      case 'własne':
        return todoLists.filter(list => list.taskId === null);
      case 'ukończone':
        return todoLists.filter(list => {
          if (!list.items.length) return false;
          return list.items.every(item => item.completed);
        });
      case 'wszystkie':
      default:
        return todoLists;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Funkcje do zarządzania listami
  const createNewList = () => {
    setCurrentList({...emptyList});
    setNewListTitle('Nowa lista');
    setShowListModal(true);
  };

  const openList = (list) => {
    setCurrentList({...list});
    setNewListTitle(list.title);
    setShowListModal(true);
  };

  const saveList = () => {
    if (currentList.id) {
      // Aktualizacja istniejącej listy
      setTodoLists(prev => prev.map(list => 
        list.id === currentList.id ? 
        {...currentList, title: newListTitle, updatedAt: new Date().toISOString().split('T')[0]} : 
        list
      ));
    } else {
      // Dodanie nowej listy
      const newId = Math.max(0, ...todoLists.map(list => list.id)) + 1;
      setTodoLists(prev => [
        ...prev, 
        {
          ...currentList, 
          id: newId, 
          title: newListTitle,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      ]);
    }
    closeListModal();
  };

  const closeListModal = () => {
    setShowListModal(false);
    setCurrentList(null);
    setNewListTitle('');
    setNewItemText('');
  };

  const initiateDeleteList = (listId) => {
    setDeleteListId(listId);
    setShowDeleteModal(true);
  };

  const deleteList = () => {
    setTodoLists(prev => prev.filter(list => list.id !== deleteListId));
    setShowDeleteModal(false);
    setDeleteListId(null);
  };

  // Funkcje do zarządzania elementami listy
  const addNewItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: Math.max(0, ...currentList.items.map(item => item.id)) + 1,
      text: newItemText.trim(),
      completed: false
    };
    
    setCurrentList(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      updatedAt: new Date().toISOString().split('T')[0]
    }));
    
    setNewItemText('');
    
    if (newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  };

  const removeItem = (itemId) => {
    setCurrentList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString().split('T')[0]
    }));
  };

  const toggleItemCompletion = (itemId) => {
    setCurrentList(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? 
        {...item, completed: !item.completed} : 
        item
      ),
      updatedAt: new Date().toISOString().split('T')[0]
    }));
  };

  const handleNewItemKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewItem();
    }
  };

  // Obliczanie postępu listy
  const getListProgress = (list) => {
    if (!list.items.length) return 0;
    const completedItems = list.items.filter(item => item.completed).length;
    return Math.round((completedItems / list.items.length) * 100);
  };

  const getCompletedItemsCount = (list) => {
    return list.items.filter(item => item.completed).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Nagłówek */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Lista do zrobienia
        </h1>
        <p className="text-gray-400">
          Organizuj swoje zadania w prosty i przejrzysty sposób
        </p>
      </div>

      {/* Pasek narzędzi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Wyszukiwarka */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            className="bg-dark-100/50 text-white w-full sm:w-80 py-2 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Szukaj na liście..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Filtry i przycisk dodawania */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative" ref={filterMenuRef}>
            <button 
              className="bg-dark-100/50 text-white py-2 px-3 rounded-xl flex items-center cursor-pointer"
              onClick={() => setIsFilterOpen(prev => !prev)}
            >
              <Filter size={16} className="mr-2 text-gray-400" />
              <span>{
                selectedFilter === 'wszystkie' ? 'Wszystkie' :
                selectedFilter === 'własne' ? 'Własne' :
                selectedFilter === 'przypisane' ? 'Przypisane' :
                'Ukończone'
              }</span>
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 bg-dark-200 border border-dark-100 rounded-xl shadow-lg z-10 w-40 overflow-hidden">
                <div 
                  className={`py-2 px-3 cursor-pointer ${selectedFilter === 'wszystkie' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-100'}`}
                  onClick={() => {
                    setSelectedFilter('wszystkie');
                    setIsFilterOpen(false);
                  }}
                >
                  Wszystkie
                </div>
                <div 
                  className={`py-2 px-3 cursor-pointer ${selectedFilter === 'własne' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-100'}`}
                  onClick={() => {
                    setSelectedFilter('własne');
                    setIsFilterOpen(false);
                  }}
                >
                  Własne
                </div>
                <div 
                  className={`py-2 px-3 cursor-pointer ${selectedFilter === 'przypisane' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-100'}`}
                  onClick={() => {
                    setSelectedFilter('przypisane');
                    setIsFilterOpen(false);
                  }}
                >
                  Przypisane
                </div>
                <div 
                  className={`py-2 px-3 cursor-pointer ${selectedFilter === 'ukończone' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-dark-100'}`}
                  onClick={() => {
                    setSelectedFilter('ukończone');
                    setIsFilterOpen(false);
                  }}
                >
                  Ukończone
                </div>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white py-2 px-4 rounded-xl flex items-center font-medium"
            onClick={createNewList}
          >
            <Plus size={18} className="mr-2" />
            Nowa lista
          </motion.button>
        </div>
      </div>

      {/* Lista kart */}
      {getFilteredLists().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {getFilteredLists()
            .filter(list => list.title.toLowerCase().includes(searchValue.toLowerCase()))
            .map(list => (
              <motion.div
                key={list.id}
                className="bg-dark-100/50 backdrop-blur-sm rounded-xl border border-dark-100/80 overflow-hidden shadow-lg"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-bold text-lg truncate group-hover:text-primary transition-colors">{list.title}</h3>
                    <div className="flex items-center gap-1">
                      <button 
                        className="text-gray-400 hover:text-white p-1 transition-colors flex items-center"
                        onClick={() => openList(list)}
                        title="Edytuj listę"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        onClick={() => initiateDeleteList(list.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1 flex justify-between">
                      <span>Postęp</span>
                      <span>{getCompletedItemsCount(list)} / {list.items.length}</span>
                    </div>
                    <div className="h-1.5 bg-dark-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${getListProgress(list)}%` }}
                      ></div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4 max-h-40 overflow-auto">
                    {list.items.slice(0, 4).map(item => (
                      <li key={item.id} className="flex items-start gap-2">
                        {item.completed ? (
                          <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={16} />
                        ) : (
                          <Circle className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                        )}
                        <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                    {list.items.length > 4 && (
                      <li className="text-xs text-gray-500 italic text-center">
                        + {list.items.length - 4} więcej elementów
                      </li>
                    )}
                    {list.items.length === 0 && (
                      <li className="text-sm text-gray-500 italic">
                        Lista jest pusta
                      </li>
                    )}
                  </ul>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock size={14} />
                      <span>Zaktualizowano: {formatDate(list.updatedAt)}</span>
                    </div>
                    <button
                      className="text-primary hover:text-primary/80 text-sm font-medium"
                      onClick={() => openList(list)}
                    >
                      Otwórz
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-dark-100/30 rounded-xl p-10 mt-4">
          <div className="bg-dark-100/50 p-4 rounded-full mb-4">
            <CheckCircle2 size={40} className="text-gray-400" />
          </div>
          <h3 className="text-white text-xl font-medium mb-2">Brak list</h3>
          <p className="text-gray-400 text-center mb-6">
            {selectedFilter === 'wszystkie' 
              ? 'Nie masz jeszcze żadnych list. Utwórz swoją pierwszą listę do zrobienia!' 
              : 'Nie znaleziono list spełniających wybrane kryteria.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white py-2 px-6 rounded-xl flex items-center font-medium"
            onClick={createNewList}
          >
            <Plus size={18} className="mr-2" />
            Utwórz listę
          </motion.button>
        </div>
      )}

      {/* Modal edycji/tworzenia listy */}
      <AnimatePresence>
        {showListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              ref={modalRef}
              className="bg-dark-200 rounded-xl w-full max-w-lg shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  {isEditingTitle ? (
                    <input
                      ref={titleInputRef}
                      type="text"
                      className="text-xl font-bold text-white bg-dark-300 p-2 rounded-lg w-full"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIsEditingTitle(false);
                        }
                      }}
                    />
                  ) : (
                    <h2 
                      className="text-xl font-bold text-white cursor-pointer flex items-center group" 
                      onClick={() => setIsEditingTitle(true)}
                    >
                      {newListTitle || currentList?.title || 'Nowa lista'}
                      <Edit size={16} className="ml-2 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="ml-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">(kliknij, aby edytować)</span>
                    </h2>
                  )}
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={closeListModal}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      ref={newItemInputRef}
                      type="text"
                      placeholder="Dodaj nowy element..."
                      className="flex-grow bg-dark-100 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={handleNewItemKeyDown}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-white p-3 rounded-lg"
                      onClick={addNewItem}
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>

                  {currentList?.items.length > 0 ? (
                    <ul className="space-y-2 max-h-80 overflow-y-auto">
                      {currentList?.items.map(item => (
                        <li 
                          key={item.id} 
                          className="flex items-center gap-3 bg-dark-100 p-3 rounded-lg group hover:bg-dark-300 transition-colors"
                        >
                          <button
                            className="flex-shrink-0"
                            onClick={() => toggleItemCompletion(item.id)}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="text-primary" size={20} />
                            ) : (
                              <Circle className="text-gray-400 group-hover:text-white" size={20} />
                            )}
                          </button>

                          <span className={`flex-grow ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {item.text}
                          </span>

                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="text-gray-400 hover:text-white p-1"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                            <div className="text-gray-600 cursor-move p-1">
                              <GripVertical size={16} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Dodaj elementy do swojej listy</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-gray-400 hover:text-white"
                    onClick={closeListModal}
                  >
                    Anuluj
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
                    onClick={saveList}
                  >
                    Zapisz listę
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal potwierdzenia usunięcia */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              ref={deleteModalRef}
              className="bg-dark-200 rounded-xl w-full max-w-md shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Potwierdzenie usunięcia</h2>
                <p className="text-gray-300 mb-6">
                  Czy na pewno chcesz usunąć tę listę? Tej operacji nie można cofnąć.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-gray-400 hover:text-white"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Anuluj
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium"
                    onClick={deleteList}
                  >
                    Usuń
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

export default ListaDoZrobienia; 