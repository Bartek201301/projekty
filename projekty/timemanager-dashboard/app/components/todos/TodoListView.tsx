'use client';

import { useState, useMemo } from 'react';
import { useTodoStore } from '@/app/lib/store';
import { Todo, Priority } from './types';
import TodoItem from './TodoItem';
import { 
  ChevronLeft, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Check, 
  X,
  SortAsc,
  Filter,
  Calendar,
  Flag
} from 'lucide-react';

interface TodoListViewProps {
  listId: string;
  onBack: () => void;
}

type SortKey = 'priority' | 'dueDate' | 'title' | 'completed';
type FilterKey = 'all' | 'active' | 'completed';

export default function TodoListView({ listId, onBack }: TodoListViewProps) {
  const { 
    getList, 
    getTodosByList, 
    updateList, 
    deleteList, 
    addTodo, 
    updateTodo, 
    toggleTodo, 
    deleteTodo 
  } = useTodoStore();

  const list = getList(listId);
  const allTodos = getTodosByList(listId);
  
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list?.name || '');
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [filterKey, setFilterKey] = useState<FilterKey>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filtered and sorted todos
  const todos = useMemo(() => {
    // First apply filters
    let result = [...allTodos];
    
    if (filterKey === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filterKey === 'completed') {
      result = result.filter(todo => todo.completed);
    }
    
    // Then apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortKey === 'priority') {
        const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortKey === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        comparison = dateA - dateB;
      } else if (sortKey === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortKey === 'completed') {
        comparison = Number(a.completed) - Number(b.completed);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [allTodos, sortKey, filterKey, sortDirection]);

  // Handle adding new todo
  const handleAddTodo = () => {
    if (newTodoTitle.trim() && list) {
      addTodo(list.id, newTodoTitle.trim());
      setNewTodoTitle('');
    }
  };

  // Handle saving list title edit
  const saveListTitle = () => {
    if (list && editedTitle.trim()) {
      updateList(list.id, editedTitle);
      setIsEditingTitle(false);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey === key) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  // Handle list deletion
  const handleDeleteList = () => {
    if (list) {
      deleteList(list.id);
      onBack();
    }
  };

  if (!list) {
    return (
      <div className="text-center py-8">
        <p>List not found. It may have been deleted.</p>
        <button onClick={onBack} className="mt-4 outline">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Lists
        </button>
      </div>
    );
  }

  const completedCount = allTodos.filter(todo => todo.completed).length;
  const activeCount = allTodos.length - completedCount;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <button 
          className="outline"
          onClick={onBack} 
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Lists
        </button>
        
        <div className="flex">
          <select
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value as FilterKey)}
            className="mr-2"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="priority">Sort: Priority</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="title">Sort: Name</option>
            <option value="completed">Sort: Status</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <div className="p-3 border-b flex items-center justify-between">
          {isEditingTitle ? (
            <div className="flex items-center w-full gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={e => setEditedTitle(e.target.value)}
                autoFocus
                placeholder="List name"
                className="flex-grow"
              />
              <button className="outline p-1" onClick={() => setIsEditingTitle(false)}>
                <X className="h-4 w-4" />
              </button>
              <button className="primary p-1" onClick={saveListTitle}>
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h2>{list.name}</h2>
              <div className="flex gap-2">
                <button 
                  className="outline p-1" 
                  onClick={() => setIsEditingTitle(true)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="outline p-1" 
                  onClick={handleDeleteList}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="new-task-form">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="primary"
            onClick={handleAddTodo} 
            disabled={!newTodoTitle.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </button>
        </div>
        
        <div className="p-2">
          <div className="text-xs text-gray-500 mb-2 px-2">
            {activeCount} active, {completedCount} completed
          </div>
          
          <div>
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
          
          {todos.length === 0 && (
            <div className="py-6 text-center text-gray-500">
              {allTodos.length === 0 ? (
                <p>No tasks in this list yet. Add your first task above.</p>
              ) : (
                <p>No tasks match your current filter.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 