const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const router = express.Router();

const publicUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  createdAt: user.createdAt,
});

router.post('/register', async (req, res, next) => {
  try {
    const username = (req.body.username || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters.' });
    }

    const db = req.app.locals.db;
    const existingUser = await db.collection('users').findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = new Date();
    const result = await db.collection('users').insertOne({ username, passwordHash, createdAt });

    const user = { _id: result.insertedId, username, createdAt };
    req.login(user, (err) => (err ? next(err) : res.status(201).json({ user: publicUser(user) })));
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Invalid username or password.' });
    req.login(user, (loginErr) => (loginErr ? next(loginErr) : res.json({ user: publicUser(user) })));
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => (err ? next(err) : res.json({ ok: true })));
});

router.get('/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

module.exports = router;
