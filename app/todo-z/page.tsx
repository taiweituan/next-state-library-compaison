"use client"

import { useRef } from "react"
import { create } from "zustand"

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
}

const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodo: (text: string) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, completed: false }],
    })),
  toggleTodo: (id: number) =>
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    })),
  deleteTodo: (id: number) => set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
}))

export default function Page() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { todos, addTodo } = useTodoStore()

  const handleAddTodo = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      addTodo(inputRef.current!.value)
      inputRef.current!.value = ""
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Todo App Zustand</h1>
        <div className="mb-4 flex">
          <input type="text" ref={inputRef} className="flex-1 rounded-l border p-2" placeholder="Add a new task..." />
          <button onClick={handleAddTodo} className="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600">
            Add
          </button>
        </div>
        <TodoList todos={todos} />
      </div>
    </div>
  )
}

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  const { toggleTodo, deleteTodo } = useTodoStore()
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-center justify-between border-b p-2 ${
            todo.completed ? "text-gray-400 line-through" : ""
          }`}
        >
          <span onClick={() => toggleTodo(todo.id)} className="cursor-pointer">
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700">
            ❌
          </button>
        </li>
      ))}
    </ul>
  )
}
