export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // Może być 'today', 'future' lub undefined
}

export interface TodoList {
  id: string;
  name: string;
}

export enum ActionType {
  ADD_TODO = 'ADD_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  DELETE_TODO = 'DELETE_TODO',
  ADD_LIST = 'ADD_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  DELETE_LIST = 'DELETE_LIST',
}

export type TodoAction = 
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id'> }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_TODOS'; payload: Todo[] };

export type TodoListAction =
  | { type: 'ADD_LIST'; payload: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_LIST'; payload: Pick<TodoList, 'id' | 'name'> }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_LISTS'; payload: TodoList[] }; 