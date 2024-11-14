const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taskmanager')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Task schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
