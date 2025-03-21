"use client"

import { useRef, useState } from "react"

interface Todo {
  text: string
  completed: boolean
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addTodo = () => {
    const inputValue = inputRef.current?.value.trim();
    if (inputValue) {
      setTodos([...todos, { text: inputValue, completed: false }]);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const toggleTodo = (index: number) => {
    const newTodos = todos.map((todo, i) => (i === index ? { ...todo, completed: !todo.completed } : todo))
    setTodos(newTodos)
  }

  const deleteTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Todo App</h1>
        <div className="mb-4 flex">
          <input type="text" ref={inputRef} className="flex-1 rounded-l border p-2" placeholder="Add a new task..." />
          <button onClick={addTodo} className="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600">
            Add
          </button>
        </div>
        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      </div>
    </div>
  )
}

type TodoListProps = {
  todos: Todo[]
  toggleTodo: (index: number) => void
  deleteTodo: (index: number) => void
}
const TodoList = ({ todos, toggleTodo, deleteTodo }: TodoListProps) => {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li
          key={index}
          className={`flex items-center justify-between border-b p-2 ${
            todo.completed ? "text-gray-400 line-through" : ""
          }`}
        >
          <span onClick={() => toggleTodo(index)} className="cursor-pointer">
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(index)} className="text-red-500 hover:text-red-700">
            ❌
          </button>
        </li>
      ))}
    </ul>
  )
}
