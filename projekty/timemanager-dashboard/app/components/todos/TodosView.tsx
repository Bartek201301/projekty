'use client';

import { useEffect, useState } from 'react';
import { useTodoStore } from '@/app/lib/store';
import { Plus, Clock } from 'lucide-react';
import { Todo } from './types';

export default function TodosView() {
  const { initializeStore, todos, addTodo, toggleTodo } = useTodoStore();
  const [newTaskText, setNewTaskText] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Filtrowanie zadań na kategorie
  const todayTasks = todos.filter(todo => 
    !todo.completed && (todo.dueDate === 'today' || todo.dueDate === undefined)
  );
  
  const upcomingTasks = todos.filter(todo => 
    !todo.completed && todo.dueDate === 'future'
  );
  
  const completedTasks = todos.filter(todo => 
    todo.completed
  );

  const handleTaskAdd = () => {
    if (newTaskText.trim()) {
      // Dodajemy do domyślnej listy bądź pierwszej dostępnej
      const listId = "default";
      addTodo(listId, newTaskText);
      setNewTaskText("");
      setIsAddingTask(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTaskAdd();
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskText("");
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1>To-Do</h1>
      
      {isAddingTask ? (
        <div className="add-task-button">
          <input 
            type="text" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add a task"
            autoFocus
            className="w-full bg-transparent border-none focus:ring-0 text-white text-lg"
          />
        </div>
      ) : (
        <div className="add-task-button" onClick={() => setIsAddingTask(true)}>
          <div className="add-task-icon">
            <Plus size={20} />
          </div>
          <span>Add a task</span>
        </div>
      )}
      
      {/* Today section */}
      <div className="task-category">
        <h2>Today</h2>
        <div className="card">
          {todayTasks.length === 0 ? (
            <div className="todo-item text-gray-500">No tasks for today</div>
          ) : (
            todayTasks.map(todo => (
              <TaskItem 
                key={todo.id} 
                task={todo} 
                onToggle={() => toggleTodo(todo.id)} 
                time="3:00 PM"
              />
            ))
          )}
        </div>
      </div>
      
      {/* Upcoming section */}
      <div className="task-category">
        <h2>Upcoming</h2>
        <div className="card">
          {upcomingTasks.length === 0 ? (
            <div className="todo-item text-gray-500">No upcoming tasks</div>
          ) : (
            upcomingTasks.map(todo => (
              <TaskItem 
                key={todo.id} 
                task={todo} 
                onToggle={() => toggleTodo(todo.id)}
                timeLabel="Tomorrow" 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Done section */}
      <div className="task-category">
        <h2>Done</h2>
        <div className="card">
          {completedTasks.length === 0 ? (
            <div className="todo-item text-gray-500">No completed tasks</div>
          ) : (
            completedTasks.map(todo => (
              <TaskItem 
                key={todo.id} 
                task={todo} 
                onToggle={() => toggleTodo(todo.id)} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: Todo;
  onToggle: () => void;
  time?: string;
  timeLabel?: string;
}

function TaskItem({ task, onToggle, time, timeLabel }: TaskItemProps) {
  return (
    <div className={`todo-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="todo-checkbox"
      />
      <span>{task.title}</span>
      
      {time && (
        <span className="task-time">{time}</span>
      )}
      
      {timeLabel && (
        <span className="task-time">{timeLabel}</span>
      )}
    </div>
  );
} 