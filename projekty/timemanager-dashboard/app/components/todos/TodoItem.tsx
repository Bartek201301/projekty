'use client';

import { useState } from 'react';
import { Todo, Priority } from './types';
import { Trash, Edit } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedPriority, setEditedPriority] = useState<Priority>(todo.priority);

  // Handle save edit
  const handleSave = () => {
    if (editedTitle.trim()) {
      onUpdate({
        ...todo,
        title: editedTitle,
        priority: editedPriority
      });
      setIsEditing(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  // Handle keydown events for the input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />

      {isEditing ? (
        <div className="flex flex-1">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 mr-2"
          />
          
          <select 
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value as Priority)}
            className="mr-2"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button onClick={handleCancel} className="outline mr-1">
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            className="primary"
            disabled={!editedTitle.trim()}
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </span>
          
          <div className="flex items-center">
            <span className={`mr-4 ${todo.priority === 'high' ? 'priority-high' : todo.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            
            <button
              onClick={() => setIsEditing(true)}
              className="outline p-1 mr-1"
            >
              <Edit className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(todo.id)}
              className="outline p-1"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
} 