'use client';

import { useState } from 'react';
import { Todo } from './types';
import TodoItem from './TodoItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'dueDate' | 'priority' | 'title';

export default function TodoList({ todos, onToggle, onUpdate, onDelete }: TodoListProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('dueDate');

  // Apply filters
  const filteredTodos = todos.filter(todo => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return !todo.completed;
    if (filterType === 'completed') return todo.completed;
    return true;
  });

  // Apply sorting
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortType === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortType === 'priority') {
      const priorityWeight = { low: 1, medium: 2, high: 3 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortType === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" onValueChange={(value: string) => setFilterType(value as FilterType)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select defaultValue="dueDate" onValueChange={(value: string) => setSortType(value as SortType)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="divide-y rounded-md border">
        {sortedTodos.length > 0 ? (
          sortedTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggle={onToggle} 
              onUpdate={onUpdate} 
              onDelete={onDelete} 
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No tasks found. {filterType !== 'all' && 'Try changing your filter.'}
          </div>
        )}
      </div>
    </div>
  );
} 