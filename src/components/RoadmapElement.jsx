import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Check, Clock, AlertTriangle } from 'lucide-react';

// Typy elementów roadmapy
const elementShapes = {
  task: {
    shape: 'rounded-lg',
    className: 'bg-dark-200/90 border border-dark-100',
    width: 200,
    height: 100,
  },
  milestone: {
    shape: 'rounded-lg',
    className: 'bg-dark-200/90 border-2 border-primary/50',
    width: 200,
    height: 100,
  },
  decision: {
    shape: 'rounded-full',
    className: 'bg-dark-200/90 border border-dark-100',
    width: 150,
    height: 150,
  },
  start: {
    shape: 'rounded-lg',
    className: 'bg-green-800/30 border border-green-700',
    width: 150,
    height: 80,
  },
  end: {
    shape: 'rounded-lg',
    className: 'bg-red-800/30 border border-red-700',
    width: 150,
    height: 80,
  },
};

// Statusy elementów
const elementStatuses = {
  todo: {
    color: 'text-gray-400',
    bgColor: 'bg-dark-200',
    icon: AlertTriangle,
  },
  'in-progress': {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-800/30',
    icon: Clock,
  },
  completed: {
    color: 'text-green-400',
    bgColor: 'bg-green-800/30',
    icon: Check,
  },
};

const RoadmapElement = ({ element, onDragEnd, onSelect, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [elementName, setElementName] = useState(element.name);
  
  // Pobieranie odpowiednich stylów dla typu elementu
  const elementStyle = elementShapes[element.type] || elementShapes.task;
  const statusStyle = elementStatuses[element.status] || elementStatuses.todo;
  const StatusIcon = statusStyle.icon;
  
  // Obsługa zakończenia edycji nazwy elementu
  const handleNameEdit = () => {
    setIsEditing(false);
    if (element.name !== elementName) {
      // Tutaj będzie wywołanie funkcji aktualizującej nazwę elementu
      console.log(`Zmieniono nazwę z "${element.name}" na "${elementName}"`);
    }
  };
  
  // Obsługa dwukrotnego kliknięcia (rozpoczęcie edycji)
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 3000, top: 0, bottom: 2000 }}
      dragElastic={0}
      onDragEnd={(_, info) => onDragEnd(element.id, info.offset)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`absolute cursor-grab ${elementStyle.shape} ${elementStyle.className} ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        width: elementStyle.width,
        height: elementStyle.height,
        left: element.x || 100,
        top: element.y || 100,
        zIndex: isSelected ? 5 : 1,
      }}
      onClick={() => onSelect(element.id)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Nagłówek elementu */}
      <div className={`flex justify-between items-center p-2 border-b border-dark-100 ${element.type === 'decision' ? 'rounded-t-full' : 'rounded-t-lg'}`}>
        <div className="flex items-center">
          <StatusIcon size={16} className={statusStyle.color} />
          <span className={`ml-2 text-xs ${statusStyle.color}`}>
            {element.status === 'todo' && 'Do zrobienia'}
            {element.status === 'in-progress' && 'W trakcie'}
            {element.status === 'completed' && 'Ukończone'}
          </span>
        </div>
        <button className="p-1 rounded-full hover:bg-dark-100/50">
          <MoreVertical size={16} />
        </button>
      </div>
      
      {/* Zawartość elementu */}
      <div className="p-3 flex items-center justify-center h-[calc(100%-36px)]">
        {isEditing ? (
          <input
            type="text"
            value={elementName}
            onChange={(e) => setElementName(e.target.value)}
            onBlur={handleNameEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameEdit()}
            className="w-full bg-dark-100 border border-dark-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
            autoFocus
          />
        ) : (
          <h3 className="text-sm font-medium text-center">{element.name}</h3>
        )}
      </div>
    </motion.div>
  );
};

export default RoadmapElement; 