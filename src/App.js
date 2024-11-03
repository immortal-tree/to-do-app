import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // State for filter
  const [sort, setSort] = useState('descending'); // State for sorting

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks && Array.isArray(savedTasks)) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true; // 'all'
  });

  // Sort tasks based on selected sort option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'ascending') return a.id - b.id; // Sort by date added
    if (sort === 'descending') return b.id - a.id; // Sort by date added
    if (sort === 'alphabetical') return a.text.localeCompare(b.text); // Sort by task text
    return 0; // No sort
  });

  return (
    <div className="app">
      <h1>GET INSPIRED</h1>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task"
        />
        <button onClick={addTask} disabled={!newTask.trim()}>Add</button>
      </div>
      
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Active</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
      </div>
      
      {/* Sort Buttons */}
      <div className="sort-buttons">
        <button onClick={() => setSort('ascending')} className={sort === 'ascending' ? 'active' : ''}>Date Ascending</button>
        <button onClick={() => setSort('descending')} className={sort === 'descending' ? 'active' : ''}>Date Descending</button>
        <button onClick={() => setSort('alphabetical')} className={sort === 'alphabetical' ? 'active' : ''}>Alphabetical</button>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              className="checkbox"
            />
            <span 
              onClick={() => toggleTaskCompletion(task.id)} 
              className={task.completed ? 'completed' : ''}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} className="delete-button">
            <span class="material-symbols-outlined">remove</span>
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default App;
