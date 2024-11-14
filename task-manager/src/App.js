import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // New filter state
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

  const addTask = async () => {
    if (!title || !description) {
      // Basic form validation: Check if title and description are not empty
      setError('Title and description cannot be empty.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/tasks', { title, description });
      setTitle('');
      setDescription('');
      setError(''); // Clear any previous errors
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to add task. Please try again.');
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to delete task. Please try again.');
    }
  };

  // Filter tasks based on status
  const filteredTasks = statusFilter === 'All' ? tasks : tasks.filter(task => task.status === statusFilter);

  // Sorting tasks by status order: Pending -> In Progress -> Completed
  const sortedTasks = filteredTasks.sort((a, b) => {
    const statusOrder = ['Pending', 'In Progress', 'Completed'];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  return (
    <div className="App container">
      <h1 className="text-center my-4">Project Management Dashboard</h1>

      {/* Display error messages */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Task Form */}
      <div className="form-group">
        <input 
          className="form-control mb-2"
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          className="form-control mb-2"
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <button className="btn btn-primary" onClick={addTask}>Add Task</button>
      </div>

      {/* Filter Tasks by Status */}
      <div className="form-group my-4">
        <label>Filter by Status: </label>
        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="task-list">
        {sortedTasks.map(task => (
          <div key={task._id} className="card my-2">
            <div className="card-body">
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.description}</p>
              <p>Status: {task.status}</p>

              {/* Update Task Status */}
              <select className="form-control mb-2" value={task.status} onChange={(e) => updateTaskStatus(task._id, e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Delete Task */}
              <button className="btn btn-danger" onClick={() => deleteTask(task._id)}>Delete Task</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
