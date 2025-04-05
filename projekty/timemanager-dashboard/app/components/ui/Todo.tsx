'use client';

import { Checkbox } from './checkbox';
import { Button } from './button';
import { Edit, Trash } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface TodoProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Todo({ id, title, completed, onToggle, onEdit, onDelete }: TodoProps) {
  return (
    <div className={cn(
      "flex items-center p-4 border-b border-gray-100 group hover:bg-gray-50 transition-colors",
      completed && "bg-gray-50/50"
    )}>
      <Checkbox 
        id={`todo-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mr-3"
      />
      <label 
        htmlFor={`todo-${id}`} 
        className={cn(
          "flex-1 text-sm font-medium cursor-pointer",
          completed && "line-through text-gray-400"
        )}
      >
        {title}
      </label>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          onClick={() => onEdit(id)} 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => onDelete(id)} 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-red-500 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 