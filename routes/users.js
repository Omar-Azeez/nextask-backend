// routes/users.js
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const router = express.Router();

const USERS_FILE = './data/users.json';

// Helper: Read users from JSON
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Helper: Write users to JSON
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// ✅ Register user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const users = readUsers();
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), email, password: hashedPassword };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: 'User registered successfully' });
});

// ✅ Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // bcrypt.compare for password match
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error checking password' });
    if (!result) return res.status(401).json({ message: 'Invalid password' });

    // ✅ Return user info for frontend
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });
  });
});


module.exports = router;
