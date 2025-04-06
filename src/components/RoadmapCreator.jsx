import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, Plus, ZoomIn, ZoomOut, Save, Download, Settings, X, 
  ArrowLeft, Undo, Redo, Trash2, Link, Eye
} from 'lucide-react';
// Zastępuję import uuid własną funkcją generującą identyfikatory
// import { v4 as uuidv4 } from 'uuid';
import RoadmapElement from './RoadmapElement';
import RoadmapConnection from './RoadmapConnection';

const LOCAL_STORAGE_KEY = 'timemanager_roadmaps';

// Prosta funkcja generująca unikalne ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const RoadmapCreator = () => {
  // Stany dla przechowywania roadmap
  const [roadmaps, setRoadmaps] = useState(() => {
    const savedRoadmaps = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedRoadmaps) {
      try {
        return JSON.parse(savedRoadmaps);
      } catch (e) {
        console.error('Błąd podczas wczytywania zapisanych roadmap:', e);
      }
    }
    return [
      { 
        id: generateId(), 
        name: 'Moja pierwsza roadmapa', 
        elements: [
          { 
            id: generateId(), 
            type: 'start', 
            name: 'Launch', 
            status: 'completed', 
            x: 300, 
            y: 200 
          },
          { 
            id: generateId(), 
            type: 'task', 
            name: 'Design', 
            status: 'in-progress', 
            x: 600, 
            y: 300 
          },
        ], 
        connections: [] 
      }
    ];
  });
  
  const [currentRoadmapId, setCurrentRoadmapId] = useState(roadmaps[0]?.id);
  const [zoom, setZoom] = useState(1);
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [isConnectingElements, setIsConnectingElements] = useState(false);
  const [connectingElement, setConnectingElement] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [newElementData, setNewElementData] = useState({
    type: 'task',
    name: '',
    status: 'todo',
  });
  
  // Historia akcji dla funkcji undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // Efekt do zapisywania roadmap w localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roadmaps));
  }, [roadmaps]);

  // Funkcja zwracająca aktualną roadmapę
  const getCurrentRoadmap = () => {
    return roadmaps.find(roadmap => roadmap.id === currentRoadmapId) || roadmaps[0];
  };

  // Funkcja dodająca stan do historii
  const addToHistory = (roadmaps) => {
    const newHistory = [...history.slice(0, historyIndex + 1), JSON.stringify(roadmaps)];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Funkcje undo/redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setRoadmaps(JSON.parse(history[historyIndex - 1]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setRoadmaps(JSON.parse(history[historyIndex + 1]));
    }
  };

  // Funkcja dodająca nowy element do roadmapy
  const handleAddElement = () => {
    setIsAddingElement(true);
    setSelectedElement(null);
    setSelectedConnection(null);
  };

  // Funkcja zatwierdzająca dodanie nowego elementu
  const handleConfirmAddElement = () => {
    const currentRoadmap = getCurrentRoadmap();
    if (!currentRoadmap) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = (canvasRect.width / 2) / zoom;
    const centerY = (canvasRect.height / 2) / zoom;

    const newElement = {
      id: generateId(),
      ...newElementData,
      x: centerX - 100, // Środek canvasu minus połowa szerokości elementu
      y: centerY - 50,  // Środek canvasu minus połowa wysokości elementu
    };

    const updatedRoadmaps = roadmaps.map(roadmap => {
      if (roadmap.id === currentRoadmapId) {
        return {
          ...roadmap,
          elements: [...roadmap.elements, newElement]
        };
      }
      return roadmap;
    });

    setRoadmaps(updatedRoadmaps);
    addToHistory(updatedRoadmaps);
    setIsAddingElement(false);
    setNewElementData({
      type: 'task',
      name: '',
      status: 'todo',
    });
  };

  // Funkcja obsługująca zmianę pola formularza dodawania elementu
  const handleNewElementChange = (field, value) => {
    setNewElementData({
      ...newElementData,
      [field]: value
    });
  };

  // Funkcja do aktualizacji pozycji elementu po przeciągnięciu
  const handleElementDragEnd = (elementId, offset) => {
    if (isReadOnly) return;
    
    const currentRoadmap = getCurrentRoadmap();
    if (!currentRoadmap) return;

    const updatedRoadmaps = roadmaps.map(roadmap => {
      if (roadmap.id === currentRoadmapId) {
        return {
          ...roadmap,
          elements: roadmap.elements.map(element => {
            if (element.id === elementId) {
              return {
                ...element,
                x: element.x + offset.x,
                y: element.y + offset.y
              };
            }
            return element;
          })
        };
      }
      return roadmap;
    });

    setRoadmaps(updatedRoadmaps);
    addToHistory(updatedRoadmaps);
  };

  // Funkcja do obsługi wyboru elementu
  const handleSelectElement = (elementId) => {
    if (isConnectingElements && connectingElement) {
      // Jeśli jesteśmy w trybie łączenia i mamy już wybrany pierwszy element
      if (connectingElement !== elementId) {
        // Dodajemy nowe połączenie
        const newConnection = {
          id: generateId(),
          sourceId: connectingElement,
          targetId: elementId,
          type: 'solid',
        };

        const updatedRoadmaps = roadmaps.map(roadmap => {
          if (roadmap.id === currentRoadmapId) {
            return {
              ...roadmap,
              connections: [...roadmap.connections, newConnection]
            };
          }
          return roadmap;
        });

        setRoadmaps(updatedRoadmaps);
        addToHistory(updatedRoadmaps);
      }
      
      setIsConnectingElements(false);
      setConnectingElement(null);
    } else {
      setSelectedElement(elementId);
      setSelectedConnection(null);
      
      if (isConnectingElements) {
        setConnectingElement(elementId);
      }
    }
  };

  // Funkcja do obsługi wyboru połączenia
  const handleSelectConnection = (connectionId) => {
    setSelectedConnection(connectionId);
    setSelectedElement(null);
  };

  // Funkcja do rozpoczęcia procesu tworzenia połączenia
  const handleStartConnecting = () => {
    setIsConnectingElements(true);
    setConnectingElement(null);
  };

  // Funkcja usuwająca element lub połączenie
  const handleDelete = () => {
    if (isReadOnly) return;
    
    const currentRoadmap = getCurrentRoadmap();
    if (!currentRoadmap) return;

    let updatedRoadmaps;

    if (selectedElement) {
      // Usuwanie elementu i wszystkich jego połączeń
      updatedRoadmaps = roadmaps.map(roadmap => {
        if (roadmap.id === currentRoadmapId) {
          return {
            ...roadmap,
            elements: roadmap.elements.filter(element => element.id !== selectedElement),
            connections: roadmap.connections.filter(
              connection => connection.sourceId !== selectedElement && connection.targetId !== selectedElement
            )
          };
        }
        return roadmap;
      });
      
      setSelectedElement(null);
    } else if (selectedConnection) {
      // Usuwanie tylko połączenia
      updatedRoadmaps = roadmaps.map(roadmap => {
        if (roadmap.id === currentRoadmapId) {
          return {
            ...roadmap,
            connections: roadmap.connections.filter(connection => connection.id !== selectedConnection)
          };
        }
        return roadmap;
      });
      
      setSelectedConnection(null);
    } else {
      return; // Nic nie jest wybrane
    }

    setRoadmaps(updatedRoadmaps);
    addToHistory(updatedRoadmaps);
  };

  // Funkcja tworząca nową pustą roadmapę
  const handleCreateNewRoadmap = () => {
    const newRoadmapId = generateId();
    const newRoadmap = {
      id: newRoadmapId,
      name: `Nowa roadmapa ${roadmaps.length + 1}`,
      elements: [],
      connections: []
    };

    const updatedRoadmaps = [...roadmaps, newRoadmap];
    setRoadmaps(updatedRoadmaps);
    setCurrentRoadmapId(newRoadmapId);
    addToHistory(updatedRoadmaps);
  };

  // Funkcje do obsługi zoomu
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Funkcja do przełączania trybu tylko do odczytu
  const toggleReadOnly = () => {
    setIsReadOnly(!isReadOnly);
  };

  // Aktualny roadmap
  const currentRoadmap = getCurrentRoadmap();

  return (
    <div className="min-h-screen bg-dark-300 text-white">
      {/* Nagłówek */}
      <header className="bg-dark-200 p-4 border-b border-dark-100 flex items-center justify-between">
        <div className="flex items-center">
          <Map className="text-primary mr-2" size={24} />
          <h1 className="text-xl font-bold">Kreator Roadmapy</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Wybór roadmapy */}
          <select 
            className="bg-dark-100 border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={currentRoadmapId}
            onChange={(e) => setCurrentRoadmapId(e.target.value)}
          >
            {roadmaps.map(roadmap => (
              <option key={roadmap.id} value={roadmap.id}>
                {roadmap.name}
              </option>
            ))}
          </select>
          
          {/* Przyciski kontrolne */}
          <div className="flex space-x-2">
            <button 
              className="p-2 bg-dark-100 rounded-lg hover:bg-dark-100/80" 
              onClick={handleZoomIn}
              title="Powiększ"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              className="p-2 bg-dark-100 rounded-lg hover:bg-dark-100/80" 
              onClick={handleZoomOut}
              title="Pomniejsz"
            >
              <ZoomOut size={20} />
            </button>
            <button 
              className={`p-2 rounded-lg ${isReadOnly ? 'bg-primary' : 'bg-dark-100'} hover:bg-dark-100/80`}
              onClick={toggleReadOnly}
              title={isReadOnly ? "Tryb edycji" : "Tryb podglądu"}
            >
              <Eye size={20} />
            </button>
            <button 
              className="p-2 bg-dark-100 rounded-lg hover:bg-dark-100/80"
              onClick={() => window.location.href = '/dashboard'}
              title="Powrót do dashboardu"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Główny obszar roboczy */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Pasek narzędzi */}
        <div className="w-16 bg-dark-200 border-r border-dark-100 flex flex-col items-center py-4 space-y-4">
          <button 
            className={`p-2 rounded-lg ${isReadOnly ? 'bg-dark-100/50 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} transition-colors`}
            onClick={handleAddElement}
            disabled={isReadOnly}
            title="Dodaj element"
          >
            <Plus size={20} />
          </button>
          <button 
            className={`p-2 rounded-lg ${isReadOnly || !selectedElement ? 'bg-dark-100/50 text-gray-500 cursor-not-allowed' : 'bg-dark-100 hover:bg-dark-100/80'}`}
            onClick={handleStartConnecting}
            disabled={isReadOnly || !selectedElement}
            title="Połącz elementy"
          >
            <Link size={20} />
          </button>
          <button 
            className={`p-2 rounded-lg ${isReadOnly || (!selectedElement && !selectedConnection) ? 'bg-dark-100/50 text-gray-500 cursor-not-allowed' : 'bg-dark-100 hover:bg-dark-100/80'}`}
            onClick={handleDelete}
            disabled={isReadOnly || (!selectedElement && !selectedConnection)}
            title="Usuń"
          >
            <Trash2 size={20} />
          </button>
          <button 
            className={`p-2 rounded-lg ${historyIndex <= 0 ? 'bg-dark-100/50 text-gray-500 cursor-not-allowed' : 'bg-dark-100 hover:bg-dark-100/80'}`}
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Cofnij"
          >
            <Undo size={20} />
          </button>
          <button 
            className={`p-2 rounded-lg ${historyIndex >= history.length - 1 ? 'bg-dark-100/50 text-gray-500 cursor-not-allowed' : 'bg-dark-100 hover:bg-dark-100/80'}`}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Ponów"
          >
            <Redo size={20} />
          </button>
        </div>
        
        {/* Obszar roboczy / Canvas */}
        <div className="flex-1 overflow-auto relative">
          <div 
            ref={canvasRef}
            className={`absolute inset-0 bg-dark-300 ${isConnectingElements ? 'cursor-crosshair' : 'cursor-grab'}`}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <div className="w-[3000px] h-[2000px] relative">
              {/* Siatka pomocnicza */}
              <div className="absolute top-0 left-0 w-full h-full grid grid-cols-[repeat(auto-fill,20px)] grid-rows-[repeat(auto-fill,20px)]">
                {Array.from({ length: 150 }, (_, i) => (
                  <div 
                    key={i} 
                    className="border-r border-t border-dark-200/20"
                    style={{ gridColumn: `${i + 1} / span 1`, gridRow: `1 / span 100` }}
                  />
                ))}
                {Array.from({ length: 100 }, (_, i) => (
                  <div 
                    key={i} 
                    className="border-t border-r border-dark-200/20"
                    style={{ gridRow: `${i + 1} / span 1`, gridColumn: `1 / span 150` }}
                  />
                ))}
              </div>
              
              {/* SVG dla połączeń */}
              <svg 
                ref={svgRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                {currentRoadmap?.connections.map(connection => (
                  <RoadmapConnection
                    key={connection.id}
                    connection={connection}
                    elements={currentRoadmap.elements}
                    isSelected={selectedConnection === connection.id}
                    onSelect={!isReadOnly ? handleSelectConnection : () => {}}
                  />
                ))}
              </svg>
              
              {/* Elementy roadmapy */}
              {currentRoadmap?.elements.map(element => (
                <RoadmapElement
                  key={element.id}
                  element={element}
                  onDragEnd={!isReadOnly ? handleElementDragEnd : () => {}}
                  onSelect={handleSelectElement}
                  isSelected={selectedElement === element.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal dodawania elementu */}
      {isAddingElement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-dark-200 rounded-xl p-6 w-96"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dodaj nowy element</h2>
              <button 
                className="p-1 hover:bg-dark-100 rounded-full"
                onClick={() => setIsAddingElement(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Typ elementu</label>
                <select 
                  className="w-full bg-dark-100 border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newElementData.type}
                  onChange={(e) => handleNewElementChange('type', e.target.value)}
                >
                  <option value="task">Zadanie</option>
                  <option value="milestone">Kamień milowy</option>
                  <option value="decision">Decyzja</option>
                  <option value="start">Start</option>
                  <option value="end">Koniec</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nazwa</label>
                <input 
                  type="text" 
                  className="w-full bg-dark-100 border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Nazwa elementu"
                  value={newElementData.name}
                  onChange={(e) => handleNewElementChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select 
                  className="w-full bg-dark-100 border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={newElementData.status}
                  onChange={(e) => handleNewElementChange('status', e.target.value)}
                >
                  <option value="todo">Do zrobienia</option>
                  <option value="in-progress">W trakcie</option>
                  <option value="completed">Ukończone</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  className="px-4 py-2 bg-dark-100 rounded-lg hover:bg-dark-100/80"
                  onClick={() => setIsAddingElement(false)}
                >
                  Anuluj
                </button>
                <button
                  className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg"
                  onClick={handleConfirmAddElement}
                  disabled={!newElementData.name.trim()}
                >
                  Dodaj
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating button do tworzenia nowej roadmapy */}
      <button
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg z-10"
        onClick={handleCreateNewRoadmap}
        title="Stwórz nową roadmapę"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default RoadmapCreator; 