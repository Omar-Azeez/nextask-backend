const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/users', usersRoute);
app.use('/tasks', tasksRoute);

app.get('/', (req, res) => {
  res.send('✅ NexTask Backend is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
