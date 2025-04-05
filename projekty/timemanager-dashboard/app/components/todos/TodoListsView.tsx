'use client';

import { useState } from 'react';
import { useTodoStore } from '@/app/lib/store';
import { Plus, List, MoreHorizontal, Edit, Trash, Check, X, AlignLeft } from 'lucide-react';
import TodoListView from './TodoListView';

export default function TodoListsView() {
  const { lists, addList, updateList, deleteList, getTodosByList } = useTodoStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editedListName, setEditedListName] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Handle adding a new list
  const handleAddList = () => {
    if (newListName.trim()) {
      addList(newListName);
      setNewListName('');
      setIsCreating(false);
    }
  };

  // Handle saving edited list name
  const handleSaveEdit = (listId: string) => {
    if (editedListName.trim()) {
      updateList(listId, editedListName);
      setEditingListId(null);
    }
  };

  // Handle starting to edit a list name
  const handleStartEdit = (listId: string, currentName: string) => {
    setEditingListId(listId);
    setEditedListName(currentName);
  };

  // Handle key press events for input fields
  const handleKeyDown = (e: React.KeyboardEvent, actionType: 'add' | 'edit', listId?: string) => {
    if (e.key === 'Enter') {
      if (actionType === 'add') {
        handleAddList();
      } else if (actionType === 'edit' && listId) {
        handleSaveEdit(listId);
      }
    } else if (e.key === 'Escape') {
      if (actionType === 'add') {
        setIsCreating(false);
        setNewListName('');
      } else if (actionType === 'edit') {
        setEditingListId(null);
      }
    }
  };

  // Show the detail view of a specific list
  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
  };

  // Go back to the lists overview
  const handleBackToLists = () => {
    setSelectedListId(null);
  };

  // Render a single list preview card
  const renderListItem = (listId: string, name: string) => {
    const todos = getTodosByList(listId);
    const completedCount = todos.filter(todo => todo.completed).length;
    const activeCount = todos.length - completedCount;
    const completionPercentage = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

    return (
      <div key={listId} className="card mb-5 cursor-pointer hover:shadow-md transition-shadow">
        {editingListId === listId ? (
          <div className="p-5 flex items-center gap-2">
            <input
              type="text"
              value={editedListName}
              onChange={(e) => setEditedListName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'edit', listId)}
              autoFocus
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button onClick={() => setEditingListId(null)} className="outline p-2" title="Cancel">
              <X className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleSaveEdit(listId)} 
              className="primary p-2"
              disabled={!editedListName.trim()}
              title="Save"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="p-5" onClick={() => handleSelectList(listId)}>
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <List className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">{name}</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="outline p-2 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(listId, name);
                    }}
                    title="Edit list name"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="outline p-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(listId);
                    }}
                    title="Delete list"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">{completionPercentage}% completed</span>
                  <span className="text-sm text-gray-500">
                    {activeCount} active, {completedCount} completed
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-center">
              <button 
                className="outline w-full hover:bg-white"
                onClick={() => handleSelectList(listId)}
              >
                View Tasks
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // If a list is selected, show its detail view
  if (selectedListId) {
    return (
      <TodoListView 
        listId={selectedListId} 
        onBack={handleBackToLists} 
      />
    );
  }

  // Otherwise show the lists overview
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl mb-1">Your Todo Lists</h2>
        <p className="text-gray-500 text-sm">Manage your tasks and stay organized</p>
      </div>

      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsCreating(true)} 
          className="primary"
        >
          <Plus className="h-4 w-4 mr-1" /> New List
        </button>
      </div>

      {/* New List Creator */}
      {isCreating && (
        <div className="card mb-4 p-4">
          <h3 className="mb-3">Create a new list</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="List name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              autoFocus
              className="flex-1"
            />
            <button onClick={() => setIsCreating(false)} className="outline">
              Cancel
            </button>
            <button 
              onClick={handleAddList} 
              className="primary"
              disabled={!newListName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Display existing lists */}
      <div className="card">
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <AlignLeft className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No lists yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">
              Create your first todo list to get started
            </p>
            <button 
              onClick={() => setIsCreating(true)} 
              className="primary"
            >
              Create First List
            </button>
          </div>
        ) : (
          lists.map(list => {
            const todos = getTodosByList(list.id);
            const completedCount = todos.filter(todo => todo.completed).length;
            const activeCount = todos.length - completedCount;
            
            return (
              <div 
                key={list.id} 
                className="task-list-card" 
                onClick={() => handleSelectList(list.id)}
              >
                <AlignLeft className="task-list-icon h-5 w-5" />
                <h3>{list.name}</h3>
                <span className="text-sm text-gray-500 mr-3">
                  {activeCount} active, {completedCount} completed
                </span>
                <div className="flex">
                  <button 
                    className="outline mr-1 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(list.id, list.name);
                    }}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="outline p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteList(list.id);
                    }}
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 