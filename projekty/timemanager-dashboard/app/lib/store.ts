'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, TodoList, Priority } from '@/app/components/todos/types';
import { v4 as uuidv4 } from 'uuid';

interface TodoState {
  todos: Todo[];
  lists: TodoList[];
  addTodo: (listId: string, title: string, priority?: Priority, dueDate?: string) => Todo;
  updateTodo: (todo: Todo) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  getTodosByList: (listId: string) => Todo[];
  
  addList: (name: string) => TodoList;
  updateList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  getList: (id: string) => TodoList | undefined;
  
  initializeStore: () => void;
}

// Define the localStorage key
const STORAGE_KEY = 'todo-app-state';

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      lists: [],
      
      // Initialize the store from localStorage
      initializeStore: () => {
        try {
          const savedState = localStorage.getItem(STORAGE_KEY);
          if (savedState) {
            const { lists, todos } = JSON.parse(savedState);
            set({ lists, todos });
          } else {
            // If no data exists, create a default list and sample tasks
            const defaultListId = uuidv4();
            set({
              lists: [
                {
                  id: defaultListId,
                  name: 'Default List',
                }
              ],
              todos: [
                {
                  id: uuidv4(),
                  listId: defaultListId,
                  title: 'Design mockups',
                  completed: false,
                  priority: 'medium',
                  dueDate: 'today',
                },
                {
                  id: uuidv4(),
                  listId: defaultListId,
                  title: 'Team meeting',
                  completed: false,
                  priority: 'high',
                  dueDate: 'today',
                },
                {
                  id: uuidv4(),
                  listId: defaultListId,
                  title: 'Review pull requests',
                  completed: true,
                  priority: 'medium',
                  dueDate: 'today',
                },
                {
                  id: uuidv4(),
                  listId: defaultListId,
                  title: 'Write documentation',
                  completed: false,
                  priority: 'medium',
                  dueDate: 'future',
                },
                {
                  id: uuidv4(),
                  listId: defaultListId,
                  title: 'Plan sprint',
                  completed: false,
                  priority: 'medium',
                  dueDate: 'future',
                }
              ]
            });
          }
        } catch (error) {
          console.error('Error initializing store:', error);
        }
      },
      
      // Todo actions
      addTodo: (listId, title, priority = 'medium', dueDate) => {
        const newTodo: Todo = {
          id: Date.now().toString(),
          title,
          completed: false,
          priority,
          dueDate,
          listId
        };
        
        set((state) => ({
          todos: [...state.todos, newTodo]
        }));
        
        return newTodo;
      },
      
      updateTodo: (updatedTodo) => {
        set((state) => ({
          todos: state.todos.map((todo) => 
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        }));
      },
      
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        }));
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }));
      },
      
      getTodosByList: (listId) => {
        return get().todos.filter((todo) => todo.listId === listId);
      },
      
      // TodoList actions
      addList: (name) => {
        const newList: TodoList = {
          id: uuidv4(),
          name,
        };
        
        set(state => {
          const newState = {
            lists: [...state.lists, newList]
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            lists: newState.lists,
            todos: state.todos
          }));
          return newState;
        });
      },
      
      updateList: (id, name) => {
        set(state => {
          const updatedLists = state.lists.map(list => 
            list.id === id 
              ? { ...list, name } 
              : list
          );
          
          const newState = { lists: updatedLists };
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            lists: updatedLists,
            todos: state.todos
          }));
          return newState;
        });
      },
      
      deleteList: (id) => {
        // Delete the list
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id)
        }));
        
        // Also delete all todos belonging to this list
        set((state) => ({
          todos: state.todos.filter((todo) => todo.listId !== id)
        }));
      },
      
      getList: (id) => {
        return get().lists.find((list) => list.id === id);
      }
    }),
    {
      name: 'todo-storage',
    }
  )
); 