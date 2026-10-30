import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e)
      }
    }
    return [
      { id: 1, text: 'Learn React basics', completed: true },
      { id: 2, text: 'Build a simple To-Do app', completed: false },
      { id: 3, text: 'Celebrate progress 🎉', completed: false }
    ]
  })

  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const handleAddTodo = (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false
    }

    setTodos([newTodo, ...todos])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const remainingCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.length - remainingCount

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>To-Do List</h1>
        <p className="subtitle">Stay organized and get things done</p>
      </header>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({remainingCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-state">
            {filter === 'completed'
              ? 'No completed tasks yet.'
              : filter === 'active'
              ? 'No active tasks! You are all caught up.'
              : 'No tasks yet. Add one above!'}
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="checkmark"></span>
              </label>

              <span
                className="todo-text"
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>

              <button
                className="delete-btn"
                title="Delete task"
                onClick={() => deleteTodo(todo.id)}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>

      {todos.length > 0 && (
        <footer className="todo-footer">
          <span>
            {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} remaining
          </span>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </footer>
      )}
    </div>
  )
}

export default App
