"use client"

import { useRef, useState } from "react"
import { create, StateCreator } from "zustand" // import cost is extremely smol
import Instruction from "components/Instruction/Instruction"

/**
 * Best Practices https://tkdodo.eu/blog/working-with-zustand
 */
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
/**
 * **Store Creation**
 * Create slices before creating the store.
 * See Slice Pattern: https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern
 *
 * Either Slices pattern, or create multiple stores and combine them into one store
 * Instead of single store, multiple stores can be created and optionally combined into one store
 * https://zustand.docs.pmnd.rs/middlewares/combine
 * NOTE that: TKDoDo prefers the `combine` stores pattern
 * Citation: https://tkdodo.eu/blog/working-with-zustand#keep-the-scope-of-your-store-small
 */
interface ThemeState {
  theme: "light" | "dark"
  user: string
  setTheme: (theme: "light" | "dark") => void
  setUser: (user: string) => void
}
const createThemeSlice: StateCreator<ThemeState> = (set) => ({
  theme: "light",
  user: "John Doe",
  setTheme: (theme: "light" | "dark") =>
    set((state) => {
      return { ...state, theme }
    }),
  setUser: (user: string) =>
    set((state) => {
      return { ...state, user }
    }),
})
const createTodoSlice: StateCreator<TodoState> = (set) => ({
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
})
// Combine the slices together with `create` store.
const useBoundedTodoStore = create<ThemeState & TodoState>((...a) => ({
  ...createTodoSlice(...a),
  ...createThemeSlice(...a),
}))

const ThemeToggle: React.FC = () => {
  const theme = useBoundedTodoStore((state) => state.theme)
  const setTheme = useBoundedTodoStore((state) => state.setTheme)
  return (
    <div className="mb-4">
      <button
        className="cursor-pointer rounded px-4 py-2 hover:bg-gray-200"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        Switch to <b>{theme === "light" ? "🌒 Dark" : "☀️ Light"}</b> Mode
      </button>
    </div>
  )
}

const User = () => {
  const user = useBoundedTodoStore((state) => state.user)
  const setUser = useBoundedTodoStore((state) => state.setUser)
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="mb-4">
      {isEditing && (
        <>
          <input
            className="mr-1 border-2 px-2 py-1"
            type="text"
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
            autoFocus
          />
          <b onClick={() => setIsEditing(false)}>✅</b>
        </>
      )}
      {!isEditing && (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer hover:bg-blue-100">
          Hello <b>{user}</b>!
        </div>
      )}
    </div>
  )
}

const TodoList: React.FC<{ todos: Todo[] }> = ({ todos }) => {
  // ! bad example
  // const { toggleTodo, deleteTodo } = useBoundedTodoStore()
  // ! good example
  const toggleTodo = useBoundedTodoStore((state) => state.toggleTodo)
  const deleteTodo = useBoundedTodoStore((state) => state.deleteTodo)
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

const Todo = () => {
  /**
   * Only Extract the necesary state and actions, not the whole store
   */
  // ! bad example
  // const { todos, addTodo } = useBoundedTodoStore()
  // ! good example -
  //     select only necessary state so it doesn't cause re-render when other unrelated state(s) change
  const todos = useBoundedTodoStore((state) => state.todos)
  const addTodo = useBoundedTodoStore((state) => state.addTodo)

  const inputRef = useRef<HTMLInputElement>(null)
  const handleAddTodo = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      addTodo(inputRef.current!.value)
      inputRef.current!.value = ""
    }
  }

  return (
    <>
      <div className="mb-4 flex">
        <input type="text" ref={inputRef} className="flex-1 rounded-l border p-2" placeholder="Add a new task..." />
        <button onClick={handleAddTodo} className="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600">
          Add
        </button>
      </div>
      <TodoList todos={todos} />
    </>
  )
}

function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
        <Instruction />
        <h1 className="mb-4 text-center text-2xl font-bold">Todo App Zustand</h1>
        <User />
        <ThemeToggle />
        <Todo />
      </div>
    </div>
  )
}

export default Page
