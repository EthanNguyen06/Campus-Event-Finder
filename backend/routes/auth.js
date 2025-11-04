const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// helpers
function setAuthCookie(res, token) {
  // In dev over HTTP, you may need secure:false; in prod keep secure:true
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,        // true on HTTPS (Azure)
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 // 1 hour
  });
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, hashed]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Register failed' });
  }
});

// LOGIN (sets the HTTP-only cookie)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    setAuthCookie(res, token);
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Login failed' });
  }
});

// REGISTER (Create new account)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for existing email
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Optionally, auto-login (create token + cookie)
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res.status(201).json({ message: 'Account created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating account:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});


// LOGOUT (clears cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out' });
});

// WHO AM I
router.get('/me', (req, res) => {
  try {
    const token = req.cookies.token;  // read cookie
    if (!token) return res.status(401).json({ message: 'No auth' });
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ id: decoded.id, email: decoded.email });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
