"use client"

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useRef, useState } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import Instruction from "components/Instruction/Instruction"

/**
 * Best Practice
 *  1. ReduxJS enforce a single store pattern (Single-Source-of-Truth)
 *  2. ReduxJS enforces immutable update on reducers
 *  3. ReduxJS enforces a single way to update the store (dispatching actions)
 *  4. ReduxJS enforces a single way to read the store (selectors)
 *  5. ReduxJS enforces a single way to create actions (action creators)
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
 * Create slices before creating the store.
 * See Slices per Redux's preferred way: https://redux-toolkit.js.org/usage/usage-with-typescript#createaslice
 */
interface ThemeState {
  theme: "light" | "dark"
  user: string
  setTheme: (theme: "light" | "dark") => void
  setUser: (user: string) => void
}

/**
 * A "slice" is a collection of Redux reducer logic and actions for a single feature in your app.
 * Defination is different to Zustand's slice pattern.
 * https://redux.js.org/tutorials/essentials/part-2-app-structure#redux-slices
 */
const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "light",
    user: "John Doe",
  } as ThemeState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      return { ...state, theme: action.payload }
    },
    setUser: (state, action: PayloadAction<string>) => {
      return { ...state, user: action.payload }
    },
  },
})
const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [] as Todo[],
  } as TodoState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }],
      }
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        todos: state.todos.map((todo) => (todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo)),
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      }
    },
  },
})

// ! Combine the slices together with `combineStores` store.
const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    todo: todoSlice.reducer,
  },
})

// ! Give it a type so that TypeScript knows about the store's state
// Not that intuitive unfortunately 😮‍💨
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.theme.theme)
  return (
    <div className="mb-4">
      <button
        className="cursor-pointer rounded px-4 py-2 hover:bg-gray-200"
        onClick={() => dispatch(themeSlice.actions.setTheme(theme === "light" ? "dark" : "light"))}
      >
        Switch to <b>{theme === "light" ? "🌒 Dark" : "☀️ Light"}</b> Mode
      </button>
    </div>
  )
}

const User = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.theme.user)
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="mb-4">
      {isEditing && (
        <>
          <input
            className="mr-1 border-2 px-2 py-1"
            type="text"
            onChange={(e) => dispatch(themeSlice.actions.setUser(e.target.value))}
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
  const dispatch = useDispatch<AppDispatch>()
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-center justify-between border-b p-2 ${
            todo.completed ? "text-gray-400 line-through" : ""
          }`}
        >
          <span onClick={() => dispatch(todoSlice.actions.toggleTodo(todo.id))} className="cursor-pointer">
            {todo.text}
          </span>
          <button
            onClick={() => dispatch(todoSlice.actions.deleteTodo(todo.id))}
            className="text-red-500 hover:text-red-700"
          >
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
  // ! good example -
  //   select only necessary state so it doesn't cause re-render when other unrelated state(s) change
  const dispatch = useDispatch<AppDispatch>()
  const todos = useSelector((state: RootState) => state.todo.todos)

  const inputRef = useRef<HTMLInputElement>(null)
  const handleAddTodo = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      dispatch(todoSlice.actions.addTodo(inputRef.current!.value))
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
        <Provider store={store}>
          <User />
          <ThemeToggle />
          <Todo />
        </Provider>
      </div>
    </div>
  )
}

export default Page
