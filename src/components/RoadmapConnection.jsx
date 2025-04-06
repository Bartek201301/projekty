import React from 'react';

const RoadmapConnection = ({ connection, elements, isSelected, onSelect }) => {
  // Pobieranie elementów początkowego i końcowego
  const sourceElement = elements.find(elem => elem.id === connection.sourceId);
  const targetElement = elements.find(elem => elem.id === connection.targetId);

  // Jeśli któryś z elementów nie istnieje, nie renderujemy połączenia
  if (!sourceElement || !targetElement) {
    return null;
  }

  // Obliczanie środków elementów
  const sourceCenter = {
    x: sourceElement.x + (connection.sourceAnchor?.x || 100), // Domyślne wartości w przypadku braku kotwicy
    y: sourceElement.y + (connection.sourceAnchor?.y || 50),
  };

  const targetCenter = {
    x: targetElement.x + (connection.targetAnchor?.x || 100),
    y: targetElement.y + (connection.targetAnchor?.y || 50),
  };

  // Obliczanie punktów kontrolnych dla krzywej Beziera
  const controlPoint1 = {
    x: sourceCenter.x + (targetCenter.x - sourceCenter.x) / 3,
    y: sourceCenter.y,
  };

  const controlPoint2 = {
    x: sourceCenter.x + 2 * (targetCenter.x - sourceCenter.x) / 3,
    y: targetCenter.y,
  };

  // Tworzenie ścieżki dla krzywej Beziera
  const pathData = `
    M ${sourceCenter.x},${sourceCenter.y}
    C ${controlPoint1.x},${controlPoint1.y} 
      ${controlPoint2.x},${controlPoint2.y} 
      ${targetCenter.x},${targetCenter.y}
  `;

  // Obliczanie punktu dla strzałki (na końcu)
  const angle = Math.atan2(targetCenter.y - controlPoint2.y, targetCenter.x - controlPoint2.x);
  const arrowSize = 10;
  
  const arrowPoint1 = {
    x: targetCenter.x - arrowSize * Math.cos(angle - Math.PI / 6),
    y: targetCenter.y - arrowSize * Math.sin(angle - Math.PI / 6),
  };
  
  const arrowPoint2 = {
    x: targetCenter.x - arrowSize * Math.cos(angle + Math.PI / 6),
    y: targetCenter.y - arrowSize * Math.sin(angle + Math.PI / 6),
  };

  const arrowPath = `
    M ${targetCenter.x},${targetCenter.y}
    L ${arrowPoint1.x},${arrowPoint1.y}
    L ${arrowPoint2.x},${arrowPoint2.y}
    Z
  `;

  // Obsługa kliknięcia w połączenie
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(connection.id);
  };

  return (
    <g className="roadmap-connection" onClick={handleClick}>
      {/* Ścieżka połączenia */}
      <path
        d={pathData}
        stroke={isSelected ? "#a78bfa" : "white"}
        strokeWidth={isSelected ? 3 : 2}
        fill="none"
        strokeDasharray={connection.type === 'dashed' ? "6,3" : "none"}
        className="transition-colors duration-200"
      />
      
      {/* Strzałka na końcu */}
      <path
        d={arrowPath}
        fill={isSelected ? "#a78bfa" : "white"}
        className="transition-colors duration-200"
      />
      
      {/* Niewidzialny, szerszy obszar do łatwiejszego klikania */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth={10}
        fill="none"
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
};

export default RoadmapConnection; 