'use client';

import { useState } from 'react';
import { useTodoStore } from '@/app/lib/store';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface CreateListViewProps {
  onBack: () => void;
  onCreated: (id: string) => void;
}

export default function CreateListView({ onBack, onCreated }: CreateListViewProps) {
  const [listName, setListName] = useState('');
  const [error, setError] = useState('');
  const { addList } = useTodoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listName.trim()) {
      setError('Please enter a list name');
      return;
    }
    
    // Create the new list
    const newList = addList(listName.trim());
    
    // Navigate to the new list
    onCreated(newList.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto"
    >
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Lists
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Create New List</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="listName" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              List Name
            </label>
            <Input
              id="listName"
              type="text"
              placeholder="e.g., Work Tasks, Shopping List, Travel Plans"
              value={listName}
              onChange={(e) => {
                setListName(e.target.value);
                setError('');
              }}
              className={error ? "border-red-500" : ""}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!listName.trim()}
            >
              Create List
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Tips for organizing your tasks:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
          <li>Create separate lists for different areas of your life</li>
          <li>Use clear, actionable names for your lists</li>
          <li>Keep lists focused on specific projects or themes</li>
        </ul>
      </div>
    </motion.div>
  );
} 